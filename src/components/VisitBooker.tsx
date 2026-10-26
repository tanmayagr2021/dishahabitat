"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Building2, Coffee, PhoneCall } from "lucide-react";
import { ChoiceCards, TextField } from "@/components/ds";
import { elements } from "@/lib/elements";
import { recordLead } from "@/lib/leads";
import { cleanPhoneInput, mailtoUrl, parsePhone, phoneHelp } from "@/lib/messaging";
import { company } from "@/lib/site";
import { SuccessTick } from "./SuccessTick";
import s from "./VisitBooker.module.css";

/*
 * Book a site visit in four short steps. The request goes to Disha's published sales WhatsApp (or
 * email) with every detail filled in, is recorded so the team can reply (src/lib/leads.ts), and the
 * visitor can save a calendar reminder. Times are preferences for the sales team to confirm, not
 * guaranteed slots.
 */
type Place = { id: string; title: string; detail: string; Icon: typeof Building2; where: string };
const places: Place[] = [
  {
    id: "elements",
    title: `${elements.shortName} site`,
    detail: `${elements.locality}. See the towers, villas and the master plan.`,
    Icon: Building2,
    where: `${elements.name}, ${elements.locality}`,
  },
  {
    id: "office",
    title: "Coffee at our office",
    detail: `${company.office.lines.join(", ")}. Talk through any community with us.`,
    Icon: Coffee,
    where: `${company.legalName}, ${company.office.lines.join(", ")}`,
  },
  {
    id: "call",
    title: "A call first",
    detail: "Not ready to visit yet? Send us your number and ask for a call.",
    Icon: PhoneCall,
    where: "Phone call",
  },
];
const slots = [
  { id: "morning", label: "Morning", hint: "10 am to 12 pm IST", h: 10 },
  { id: "afternoon", label: "Afternoon", hint: "12 pm to 3 pm IST", h: 12 },
  { id: "evening", label: "Evening", hint: "3 pm to 6 pm IST", h: 15 },
];
const steps = ["Where", "When", "You", "Confirm"];

/* Today's date in Bengaluru, whatever the visitor's own time zone. */
const istToday = () => {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date())
    .split("-")
    .map(Number);
  return { y, m: m - 1, d };
};
function nextDays(n: number) {
  const { y, m, d } = istToday();
  return Array.from({ length: n }, (_, i) => new Date(y, m, d + i + 1));
}
/* Dates depend on today, so they are computed in the browser (empty while rendering on the server),
   and recomputed if the page has been left open past midnight. */
let cachedDays: Date[] | null = null;
let cachedFor = "";
const EMPTY: Date[] = [];
const noop = () => () => {};
const clientDays = () => {
  const t = istToday();
  const key = `${t.y}-${t.m}-${t.d}`;
  if (!cachedDays || cachedFor !== key) {
    cachedDays = nextDays(14);
    cachedFor = key;
  }
  return cachedDays;
};
const serverDays = () => EMPTY;

const dayFmt = new Intl.DateTimeFormat("en-IN", { weekday: "short" });
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const longFmt = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" });

/*
 * A calendar invite (RFC 5545). Times are written in UTC, converted from the chosen hour in
 * Bengaluru (IST, UTC+5:30), so every calendar app shows the right local time. The UID is stable,
 * so saving the same visit twice updates one event instead of making two.
 */
function icsFile(title: string, where: string, day: Date, istHour: number, hours: number, key: string) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const utc = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const start = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), istHour, 0) - 330 * 60_000);
  const end = new Date(start.getTime() + hours * 3600_000);
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
  // Lines longer than 75 octets are folded, as the standard requires.
  const fold = (line: string) => line.match(/.{1,73}/g)!.join("\r\n ");
  return (
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Disha Habitat//Site visit//EN",
      "BEGIN:VEVENT",
      `UID:${key}@dishahabitat.com`,
      `DTSTAMP:${utc(new Date())}`,
      `DTSTART:${utc(start)}`,
      `DTEND:${utc(end)}`,
      `SUMMARY:${esc(title)}`,
      `LOCATION:${esc(where)}`,
      `DESCRIPTION:${esc(`Requested with Disha Habitat. The sales team will confirm the exact time. Sales: ${elements.phone.display}`)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(fold)
      .join("\r\n") + "\r\n"
  );
}

export function VisitBooker() {
  const [step, setStep] = useState(0);
  // Which way the last move went, so the next step slides in from that side.
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [place, setPlace] = useState<string | null>(null);
  const days = useSyncExternalStore(noop, clientDays, serverDays);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [people, setPeople] = useState(2);
  const [tried, setTried] = useState(false);
  // One record per request, however many times or ways the buttons are pressed.
  const recorded = useRef(new Set<string>());

  const p = places.find((x) => x.id === place);
  const time = slots.find((x) => x.id === slot);
  const isCall = place === "call";
  const parsed = parsePhone(phone);
  const phoneOk = parsed.ok;
  const stepBox = useRef<HTMLDivElement>(null);
  const firstStep = useRef(true);
  useEffect(() => {
    // Moves focus to the new step's question so screen readers announce it; skipped on first load.
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    stepBox.current?.querySelector<HTMLElement>("[data-step-title]")?.focus({ preventScroll: true });
  }, [step]);
  const nameOk = name.trim().length >= 2;

  const canNext = [Boolean(place), isCall ? Boolean(slot) : day !== null && Boolean(slot), nameOk && phoneOk, true][step];
  const when = day !== null && days[day] ? longFmt.format(days[day]) : "";

  const message = useMemo(() => {
    if (!p) return "";
    const lines = [
      `Hello Disha Habitat, I’d like to ${isCall ? "request a call back" : "book a visit"}.`,
      `${isCall ? "About" : "Visit"}: ${p.title}`,
      !isCall && when ? `Date: ${when}` : "",
      time ? `Preferred time: ${time.label} (${time.hint})` : "",
      !isCall ? `People: ${people}` : "",
      `Name: ${name.trim()}`,
      `Phone: ${parsed.display}`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [p, isCall, when, time, people, name, parsed.display]);

  const next = () => {
    if (!canNext) {
      setTried(true);
      return;
    }
    setTried(false);
    setDir("fwd");
    setStep((v) => Math.min(3, v + 1));
  };

  const record = (channel: "whatsapp" | "email" | "call") => {
    if (!p || recorded.current.has(message)) return;
    recorded.current.add(message);
    recordLead({
      kind: isCall ? "callback" : "site-visit",
      name: name.trim(),
      phone: parsed.display,
      interest: p.title,
      channel,
      details: {
        ...(isCall ? {} : { date: when, people: String(people) }),
        ...(time ? { time: `${time.label} (${time.hint})` } : {}),
        place: p.where,
      },
      consent: true,
    });
  };

  const downloadIcs = () => {
    if (!p || day === null || !time) return;
    const d = days[day];
    const key = `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}-${time.id}-${p.id}`;
    const blob = new Blob([icsFile(`Disha Habitat: ${p.title}`, p.where, d, time.h, 2, key)], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "disha-habitat-site-visit.ics";
    document.body.appendChild(a);
    a.click();
    // Safari reads the file after the click returns, so the link is released a moment later.
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(a.href);
    }, 1500);
  };

  const rows: [string, string][] = p
    ? [
        [isCall ? "Request" : "Visit", p.title],
        ...(isCall ? [] : ([["Date", when]] as [string, string][])),
        ["Time", time ? `${time.label}, ${time.hint}` : ""],
        ...(isCall ? [] : ([["People", String(people)]] as [string, string][])),
        ["Name", name.trim()],
        ["Mobile", parsed.display],
      ]
    : [];

  return (
    <div className={s.booker}>
      <div className={s.progress}>
        <p>
          <span className="sr-only">Booking step </span>
          {step + 1} of 4<span aria-hidden> · </span>
          <strong>{steps[step]}</strong>
        </p>
        <div className={s.bar} aria-hidden>
          <span style={{ transform: `scaleX(${(step + 1) / 4})` }} />
        </div>
      </div>

      <div key={step} ref={stepBox} className={s.step} data-dir={dir}>
        {step === 0 && (
          <div>
            <h3 data-step-title tabIndex={-1} className={`display ${s.q}`}>
              Where would you like to meet us?
            </h3>
            <ChoiceCards
              legend={<span className="sr-only">Where to meet</span>}
              name="visit-place"
              value={place}
              onChange={setPlace}
              columns={3}
              error={tried && !canNext ? "Choose where you’d like to meet us to continue." : undefined}
              options={places.map((x) => ({ value: x.id, title: x.title, detail: x.detail, icon: <x.Icon aria-hidden strokeWidth={1.5} /> }))}
            />
          </div>
        )}

        {step === 1 && (
          <div className={s.when}>
            {!isCall && (
              <fieldset className={s.group}>
                <legend data-step-title tabIndex={-1} className={`display ${s.q}`}>
                  Pick a day
                </legend>
                <div className={s.days} role="group" aria-label="The next 14 days">
                  {days.map((dt, i) => (
                    <button
                      key={dt.toISOString()}
                      type="button"
                      aria-pressed={day === i}
                      aria-label={longFmt.format(dt)}
                      onClick={() => setDay(i)}
                      className={s.day}
                    >
                      <span>{dayFmt.format(dt)}</span>
                      <strong>{dt.getDate()}</strong>
                      <span>{dateFmt.format(dt).split(" ")[1]}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            <div>
              {isCall && (
                <h3 data-step-title tabIndex={-1} className={`display ${s.q}`}>
                  When should we call?
                </h3>
              )}
              <ChoiceCards
                legend={isCall ? <span className="sr-only">Time</span> : <span className={s.sub}>Preferred time</span>}
                name="visit-time"
                value={slot}
                onChange={setSlot}
                columns={3}
                error={tried && !canNext ? `Choose ${isCall ? "a time" : "a day and a time"} to continue.` : undefined}
                options={slots.map((x) => ({ value: x.id, title: x.label, detail: x.hint }))}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 data-step-title tabIndex={-1} className={`display ${s.q}`}>
              Who should we expect?
            </h3>
            <div className={s.pair}>
              <TextField
                label="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                error={tried && !nameOk ? "Please enter your name." : undefined}
              />
              <TextField
                label="Mobile number"
                value={phone}
                onChange={(e) => setPhone(cleanPhoneInput(e.target.value))}
                inputMode="tel"
                autoComplete="tel"
                placeholder="98765 43210"
                hint={tried && !phoneOk ? undefined : "Outside India? Add your country code, e.g. +971."}
                error={tried && !phoneOk ? phoneHelp : undefined}
              />
            </div>
            {!isCall && (
              <div className={s.people}>
                <p id="visit-people">How many people are coming?</p>
                <div role="group" aria-labelledby="visit-people">
                  <button type="button" onClick={() => setPeople((n) => Math.max(1, n - 1))} aria-label="Fewer people">
                    −
                  </button>
                  <span aria-live="polite">{people}</span>
                  <button type="button" onClick={() => setPeople((n) => Math.min(10, n + 1))} aria-label="More people">
                    +
                  </button>
                </div>
              </div>
            )}
            <p className={s.fine}>By continuing, you agree that Disha Habitat may store these details to reply to you.</p>
          </div>
        )}

        {step === 3 && p && (
          <div>
            <SuccessTick className={s.tick} />
            <h3 data-step-title tabIndex={-1} className={`display ${s.q}`}>
              Ready, {name.trim().split(" ")[0]}.
            </h3>
            <p className={s.lead}>Send this to our sales team on WhatsApp or by email, and they will confirm the time with you.</p>
            <dl className={s.summary}>
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className={s.send}>
              <a
                href={`${elements.whatsapp}&text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => record("whatsapp")}
                className="btn btn-primary"
              >
                Send on WhatsApp
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href={mailtoUrl(`${isCall ? "Call back request" : "Site visit request"}: ${p.title}`, message, place === "elements" ? elements.email : undefined)}
                onClick={() => record("email")}
                className="btn btn-soft"
              >
                Send by email
              </a>
              {!isCall && (
                <button type="button" onClick={downloadIcs} className="btn btn-soft">
                  Add to my calendar
                </button>
              )}
            </div>
            <p className={s.fine}>
              Prefer to call? Sales:{" "}
              <a href={elements.phone.href} onClick={() => record("call")} className="text-link">
                {elements.phone.display}
              </a>
              . By sending, you agree that Disha Habitat may store these details to reply to you.
            </p>
          </div>
        )}
      </div>

      <div className={s.nav}>
        <button type="button" onClick={() => {
            setDir("back");
            setStep((v) => Math.max(0, v - 1));
          }} disabled={step === 0} className={`text-link ${s.back}`}>
          Back
        </button>
        {step < 3 ? (
          <button type="button" onClick={next} aria-disabled={!canNext} className="btn btn-dark">
            {step === 2 ? "Review" : "Continue"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDir("back");
              setStep(0);
              setPlace(null);
              setDay(null);
              setSlot(null);
            }}
            className={`text-link ${s.back}`}
          >
            Start again
          </button>
        )}
      </div>
    </div>
  );
}
