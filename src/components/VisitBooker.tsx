"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, Building2, CalendarPlus, Check, Coffee, Mail, MessageCircle, PhoneCall } from "lucide-react";
import { elements } from "@/lib/elements";
import { cleanPhoneInput, mailtoUrl, parsePhone, phoneHelp } from "@/lib/messaging";
import { company } from "@/lib/site";

/*
 * Book a site visit in four short steps. The website does not store or send anything: the request
 * goes to Disha's published sales WhatsApp with every detail filled in, and the visitor can save a
 * calendar reminder. Times are preferences for the sales team to confirm, not guaranteed slots.
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
  const uid = useId();
  const [step, setStep] = useState(0);
  const [place, setPlace] = useState<string | null>(null);
  const days = useSyncExternalStore(noop, clientDays, serverDays);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [people, setPeople] = useState(2);
  const [tried, setTried] = useState(false);


  const p = places.find((x) => x.id === place);
  const s = slots.find((x) => x.id === slot);
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
      s ? `Preferred time: ${s.label} (${s.hint})` : "",
      !isCall ? `People: ${people}` : "",
      `Name: ${name.trim()}`,
      `Phone: ${parsed.display}`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [p, isCall, when, s, people, name, parsed.display]);

  const next = () => {
    if (!canNext) {
      setTried(true);
      return;
    }
    setTried(false);
    setStep((v) => Math.min(3, v + 1));
  };

  const downloadIcs = () => {
    if (!p || day === null || !s) return;
    const d = days[day];
    const key = `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}-${s.id}-${p.id}`;
    const blob = new Blob([icsFile(`Disha Habitat: ${p.title}`, p.where, d, s.h, 2, key)], { type: "text/calendar;charset=utf-8" });
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

  const choice = (on: boolean) =>
    `rounded-xl border text-left transition-[border-color,background-color,box-shadow] duration-200 ${
      on ? "border-forest bg-forest text-paper shadow-[0_12px_30px_-16px_rgb(15_38_32/0.8)]" : "border-ink/12 bg-white/60 hover:border-ink/35"
    }`;

  return (
    <div className="card min-w-0 overflow-hidden">
      {/* Progress */}
      <ol className="grid grid-cols-4 border-b border-ink/10 bg-white/40" aria-label="Booking steps">
        {steps.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined} className="relative px-3 py-4 text-center text-sm sm:px-5 sm:text-left">
            <span className={`inline-flex items-center gap-2 ${i <= step ? "text-ink" : "text-mute"}`}>
              <span
                className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  i < step ? "bg-forest text-paper" : i === step ? "bg-ink text-paper" : "bg-ink/8 text-mute"
                }`}
              >
                {i < step ? <Check aria-hidden className="size-3.5" /> : i + 1}
              </span>
              <span className="sr-only sm:not-sr-only">{label}</span>
            </span>
            <span aria-hidden className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-forest transition-transform duration-500 ${i <= step ? "scale-x-100" : "scale-x-0"}`} />
          </li>
        ))}
      </ol>

      <div className="p-5 sm:p-8 lg:p-10">
        <div key={step} ref={stepBox} className="swap-in min-h-[22rem]">
          {step === 0 && (
            <fieldset className="min-w-0">
              <legend data-step-title tabIndex={-1} className="serif text-[1.9rem] leading-tight outline-none">Where would you like to meet us?</legend>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {places.map((x) => (
                  <button key={x.id} type="button" aria-pressed={place === x.id} onClick={() => setPlace(x.id)} className={`${choice(place === x.id)} p-5`}>
                    <x.Icon aria-hidden className={`size-6 ${place === x.id ? "text-brass" : "text-forest"}`} strokeWidth={1.5} />
                    <span className="mt-4 block text-[1.05rem] font-semibold">{x.title}</span>
                    <span className={`mt-1.5 block text-sm leading-relaxed ${place === x.id ? "text-paper/75" : "text-mute"}`}>{x.detail}</span>
                  </button>
                ))}
              </div>
              {tried && !canNext && (
                <p role="alert" className="mt-4 text-sm text-error">
                  Choose where you’d like to meet us to continue.
                </p>
              )}
            </fieldset>
          )}

          {step === 1 && (
            <div className="min-w-0">
              {!isCall && (
                <fieldset className="min-w-0">
                  <legend data-step-title tabIndex={-1} className="serif text-[1.9rem] leading-tight outline-none">Pick a day</legend>
                  <div className="-mx-1 mt-5 flex snap-x gap-2 overflow-x-auto overscroll-x-contain px-1 pb-2" role="group" aria-label="The next 14 days">
                    {days.map((dt, i) => (
                      <button
                        key={dt.toISOString()}
                        type="button"
                        aria-pressed={day === i}
                        aria-label={longFmt.format(dt)}
                        onClick={() => setDay(i)}
                        className={`${choice(day === i)} flex w-[4.6rem] shrink-0 snap-start flex-col items-center py-3`}
                      >
                        <span className={`text-xs ${day === i ? "text-paper/70" : "text-mute"}`}>{dayFmt.format(dt)}</span>
                        <span className="serif mt-1 text-[1.6rem] leading-none">{dt.getDate()}</span>
                        <span className={`mt-1 text-xs ${day === i ? "text-paper/70" : "text-mute"}`}>{dateFmt.format(dt).split(" ")[1]}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
              <fieldset className={`min-w-0 ${isCall ? "" : "mt-8"}`}>
                <legend {...(isCall ? { "data-step-title": "", tabIndex: -1 } : {})} className="serif text-[1.9rem] leading-tight outline-none">{isCall ? "When should we call?" : "Preferred time"}</legend>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {slots.map((x) => (
                    <button key={x.id} type="button" aria-pressed={slot === x.id} onClick={() => setSlot(x.id)} className={`${choice(slot === x.id)} p-4`}>
                      <span className="block font-semibold">{x.label}</span>
                      <span className={`mt-0.5 block text-sm ${slot === x.id ? "text-paper/75" : "text-mute"}`}>{x.hint}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              {tried && !canNext && (
                <p role="alert" className="mt-4 text-sm text-error">
                  Choose {isCall ? "a time" : "a day and a time"} to continue.
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <fieldset className="min-w-0">
              <legend data-step-title tabIndex={-1} className="serif text-[1.9rem] leading-tight outline-none">Who should we expect?</legend>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-name`} className="text-sm font-medium">
                    Your name
                  </label>
                  <input
                    id={`${uid}-name`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    aria-invalid={tried && !nameOk}
                    aria-describedby={tried && !nameOk ? `${uid}-name-error` : undefined}
                    className="mt-2 h-12 w-full rounded-lg border border-ink/45 bg-white/70 px-3.5 text-[1.05rem] outline-none focus:border-ink focus:shadow-[0_0_0_3px_rgb(57_170_225/0.25)] aria-[invalid=true]:border-error"
                  />
                  {tried && !nameOk && (
                    <p id={`${uid}-name-error`} className="mt-1.5 text-sm text-error">
                      Please enter your name.
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`${uid}-phone`} className="text-sm font-medium">
                    Mobile number
                  </label>
                  <div className="mt-2 flex h-12 items-center gap-2 rounded-lg border border-ink/45 bg-white/70 px-3.5 focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgb(57_170_225/0.25)]">
                    <input
                      id={`${uid}-phone`}
                      value={phone}
                      onChange={(e) => setPhone(cleanPhoneInput(e.target.value))}
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={tried && !phoneOk}
                      aria-describedby={`${uid}-phone-hint`}
                      placeholder="98765 43210"
                      className="w-full border-0 bg-transparent p-0 text-[1.05rem] tabular-nums outline-none placeholder:text-mute/60 focus:ring-0"
                    />
                  </div>
                  <p id={`${uid}-phone-hint`} className={`mt-1.5 text-sm ${tried && !phoneOk ? "text-error" : "text-mute"}`}>
                    {tried && !phoneOk ? phoneHelp : "Outside India? Add your country code, e.g. +971."}
                  </p>
                </div>
              </div>
              {!isCall && (
                <div className="mt-6">
                  <p className="text-sm font-medium">How many people are coming?</p>
                  <div className="mt-2 inline-flex items-center rounded-lg border border-ink/45 bg-white/70">
                    <button type="button" onClick={() => setPeople((n) => Math.max(1, n - 1))} aria-label="Fewer people" className="size-11 text-lg">
                      −
                    </button>
                    <span className="w-10 text-center font-semibold tabular-nums" aria-live="polite">
                      {people}
                    </span>
                    <button type="button" onClick={() => setPeople((n) => Math.min(10, n + 1))} aria-label="More people" className="size-11 text-lg">
                      +
                    </button>
                  </div>
                </div>
              )}
            </fieldset>
          )}

          {step === 3 && p && (
            <div>
              <h3 data-step-title tabIndex={-1} className="serif text-[1.9rem] leading-tight outline-none">Almost done, {name.trim().split(" ")[0]}.</h3>
              <p className="mt-2 text-mute">Send this to our sales team on WhatsApp or by email, and they will confirm the time with you.</p>
              <dl className="mt-6 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white/60">
                {[
                  [isCall ? "Request" : "Visit", p.title],
                  ...(isCall ? [] : [["Date", when]]),
                  ["Time", s ? `${s.label}, ${s.hint}` : ""],
                  ...(isCall ? [] : [["People", String(people)]]),
                  ["Name", name.trim()],
                  ["Mobile", parsed.display],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 px-4 py-3 text-[0.98rem]">
                    <dt className="text-mute">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-col flex-wrap gap-3 sm:flex-row">
                <a
                  href={`${elements.whatsapp}&text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#187a41] px-5 font-semibold text-white transition-colors hover:bg-[#12613a]"
                >
                  <MessageCircle aria-hidden className="size-5" strokeWidth={1.8} />
                  Send on WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <a
                  href={mailtoUrl(`${isCall ? "Call back request" : "Site visit request"}: ${p.title}`, message, place === "elements" ? elements.email : undefined)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-ink/20 bg-white/60 px-5 font-medium transition-colors hover:border-ink/45"
                >
                  <Mail aria-hidden className="size-5" strokeWidth={1.6} />
                  Send by email
                </a>
                {!isCall && (
                  <button
                    type="button"
                    onClick={downloadIcs}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-ink/20 bg-white/60 px-5 font-medium transition-colors hover:border-ink/45"
                  >
                    <CalendarPlus aria-hidden className="size-5" strokeWidth={1.6} />
                    Add to my calendar
                  </button>
                )}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-mute">
                Prefer to call? Sales: <a href={elements.phone.href} className="underline underline-offset-2">{elements.phone.display}</a>. This website
                does not store your details.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink/10 pt-6">
          <button
            type="button"
            onClick={() => setStep((v) => Math.max(0, v - 1))}
            disabled={step === 0}
            className="inline-flex h-11 items-center gap-2 rounded-lg px-3 text-[0.95rem] font-medium text-ink/75 transition-colors hover:text-ink disabled:invisible"
          >
            <ArrowLeft aria-hidden className="size-4" /> Back
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              aria-disabled={!canNext}
              className={`inline-flex h-12 items-center gap-2 rounded-lg px-6 text-[0.98rem] font-semibold transition-colors ${
                canNext ? "bg-forest text-paper hover:bg-forest-2" : "bg-ink/8 text-ink/70 ring-1 ring-inset ring-ink/20"
              }`}
            >
              {step === 2 ? "Review" : "Continue"} <ArrowRight aria-hidden className="size-4" />
            </button>
          ) : (
            <button type="button" onClick={() => { setStep(0); setPlace(null); setDay(null); setSlot(null); }} className="text-sm font-medium text-mute underline underline-offset-4 hover:text-ink">
              Start again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
