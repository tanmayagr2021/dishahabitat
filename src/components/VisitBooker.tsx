"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, Building2, CalendarPlus, Check, Coffee, MessageCircle, PhoneCall } from "lucide-react";
import { elements } from "@/lib/elements";
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
    detail: "Not ready to visit yet? We’ll call you to answer your questions.",
    Icon: PhoneCall,
    where: "Phone call",
  },
];
const slots = [
  { id: "morning", label: "Morning", hint: "10 am to 12 pm", h: 10 },
  { id: "afternoon", label: "Afternoon", hint: "12 pm to 3 pm", h: 12 },
  { id: "evening", label: "Evening", hint: "3 pm to 6 pm", h: 15 },
];
const steps = ["Where", "When", "You", "Confirm"];

function nextDays(n: number) {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 1; i <= n; i++) out.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() + i));
  return out;
}
/* Dates depend on today, so they are computed in the browser (empty while rendering on the server). */
let cachedDays: Date[] | null = null;
const EMPTY: Date[] = [];
const noop = () => () => {};
const clientDays = () => (cachedDays ??= nextDays(14));
const serverDays = () => EMPTY;

const dayFmt = new Intl.DateTimeFormat("en-IN", { weekday: "short" });
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const longFmt = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" });

function icsFile(title: string, where: string, start: Date, hours: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const end = new Date(start.getTime() + hours * 3600_000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Disha Habitat//Site visit//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@dishahabitat`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART;TZID=Asia/Kolkata:${stamp(start)}`,
    `DTEND;TZID=Asia/Kolkata:${stamp(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${where.replace(/,/g, "\\,")}`,
    `DESCRIPTION:Requested with Disha Habitat. The sales team will confirm the exact time. Sales: ${elements.phone.display}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
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
  const digits = phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  const phoneOk = /^[6-9]\d{9}$/.test(digits);
  const nameOk = name.trim().length >= 2;

  const canNext = [Boolean(place), isCall ? Boolean(slot) : day !== null && Boolean(slot), nameOk && phoneOk, true][step];
  const when = day !== null && days[day] ? longFmt.format(days[day]) : "";

  const message = useMemo(() => {
    if (!p) return "";
    const lines = [
      `Hello Disha Habitat, I'd like to ${isCall ? "request a call back" : "book a visit"}.`,
      `${isCall ? "About" : "Visit"}: ${p.title}`,
      !isCall && when ? `Date: ${when}` : "",
      s ? `Preferred time: ${s.label} (${s.hint})` : "",
      !isCall ? `People: ${people}` : "",
      `Name: ${name.trim()}`,
      `Phone: +91 ${digits}`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [p, isCall, when, s, people, name, digits]);

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
    const start = new Date(days[day]);
    start.setHours(s.h, 0, 0, 0);
    const blob = new Blob([icsFile(`Disha Habitat: ${p.title}`, p.where, start, 2)], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "disha-habitat-site-visit.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const choice = (on: boolean) =>
    `rounded-xl border text-left transition-[border-color,background-color,box-shadow] duration-200 ${
      on ? "border-forest bg-forest text-paper shadow-[0_12px_30px_-16px_rgb(15_38_32/0.8)]" : "border-ink/12 bg-white/60 hover:border-ink/35"
    }`;

  return (
    <div className="card overflow-hidden">
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
              <span className="hidden sm:inline">{label}</span>
            </span>
            <span aria-hidden className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-forest transition-transform duration-500 ${i <= step ? "scale-x-100" : "scale-x-0"}`} />
          </li>
        ))}
      </ol>

      <div className="p-5 sm:p-8 lg:p-10">
        <div key={step} className="swap-in min-h-[22rem]">
          {step === 0 && (
            <fieldset>
              <legend className="serif text-[1.9rem] leading-tight">Where would you like to meet us?</legend>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {places.map((x) => (
                  <button key={x.id} type="button" aria-pressed={place === x.id} onClick={() => setPlace(x.id)} className={`${choice(place === x.id)} p-5`}>
                    <x.Icon aria-hidden className={`size-6 ${place === x.id ? "text-brass" : "text-forest"}`} strokeWidth={1.5} />
                    <span className="mt-4 block text-[1.05rem] font-semibold">{x.title}</span>
                    <span className={`mt-1.5 block text-sm leading-relaxed ${place === x.id ? "text-paper/75" : "text-mute"}`}>{x.detail}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <div>
              {!isCall && (
                <fieldset>
                  <legend className="serif text-[1.9rem] leading-tight">Pick a day</legend>
                  <div className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-2" role="group" aria-label="The next 14 days">
                    {days.map((dt, i) => (
                      <button
                        key={dt.toISOString()}
                        type="button"
                        aria-pressed={day === i}
                        aria-label={longFmt.format(dt)}
                        onClick={() => setDay(i)}
                        className={`${choice(day === i)} flex w-[4.6rem] shrink-0 flex-col items-center py-3`}
                      >
                        <span className={`text-xs ${day === i ? "text-paper/70" : "text-mute"}`}>{dayFmt.format(dt)}</span>
                        <span className="serif mt-1 text-[1.6rem] leading-none">{dt.getDate()}</span>
                        <span className={`mt-1 text-xs ${day === i ? "text-paper/70" : "text-mute"}`}>{dateFmt.format(dt).split(" ")[1]}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
              <fieldset className={isCall ? "" : "mt-8"}>
                <legend className="serif text-[1.9rem] leading-tight">{isCall ? "When should we call?" : "Preferred time"}</legend>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {slots.map((x) => (
                    <button key={x.id} type="button" aria-pressed={slot === x.id} onClick={() => setSlot(x.id)} className={`${choice(slot === x.id)} p-4`}>
                      <span className="block font-semibold">{x.label}</span>
                      <span className={`mt-0.5 block text-sm ${slot === x.id ? "text-paper/75" : "text-mute"}`}>{x.hint}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              {tried && !canNext && <p className="mt-4 text-sm text-error">Choose {isCall ? "a time" : "a day and a time"} to continue.</p>}
            </div>
          )}

          {step === 2 && (
            <fieldset>
              <legend className="serif text-[1.9rem] leading-tight">Who should we expect?</legend>
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
                    className="mt-2 h-12 w-full rounded-lg border border-ink/15 bg-white/70 px-3.5 text-[1.05rem] outline-none focus:border-ink focus:shadow-[0_0_0_3px_rgb(57_170_225/0.25)] aria-[invalid=true]:border-error"
                  />
                  {tried && !nameOk && <p className="mt-1.5 text-sm text-error">Please enter your name.</p>}
                </div>
                <div>
                  <label htmlFor={`${uid}-phone`} className="text-sm font-medium">
                    Mobile number
                  </label>
                  <div className="mt-2 flex h-12 items-center gap-2 rounded-lg border border-ink/15 bg-white/70 px-3.5 focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgb(57_170_225/0.25)]">
                    <span className="text-mute">+91</span>
                    <input
                      id={`${uid}-phone`}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, "").slice(0, 14))}
                      inputMode="tel"
                      autoComplete="tel-national"
                      aria-invalid={tried && !phoneOk}
                      placeholder="98765 43210"
                      className="w-full border-0 bg-transparent p-0 text-[1.05rem] tabular-nums outline-none placeholder:text-mute/60 focus:ring-0"
                    />
                  </div>
                  {tried && !phoneOk && <p className="mt-1.5 text-sm text-error">Enter a 10-digit Indian mobile number.</p>}
                </div>
              </div>
              {!isCall && (
                <div className="mt-6">
                  <p className="text-sm font-medium">How many people are coming?</p>
                  <div className="mt-2 inline-flex items-center rounded-lg border border-ink/15 bg-white/70">
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
              <p className="serif text-[1.9rem] leading-tight">Almost done, {name.trim().split(" ")[0]}.</p>
              <p className="mt-2 text-mute">Send this to our sales team on WhatsApp and they will confirm the time with you.</p>
              <dl className="mt-6 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white/60">
                {[
                  [isCall ? "Request" : "Visit", p.title],
                  ...(isCall ? [] : [["Date", when]]),
                  ["Time", s ? `${s.label}, ${s.hint}` : ""],
                  ...(isCall ? [] : [["People", String(people)]]),
                  ["Name", name.trim()],
                  ["Mobile", `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 px-4 py-3 text-[0.98rem]">
                    <dt className="text-mute">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`${elements.whatsapp}&text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1f8f4e] px-5 font-semibold text-white transition-colors hover:bg-[#187a41]"
                >
                  <MessageCircle aria-hidden className="size-5" strokeWidth={1.8} />
                  Send on WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
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
                canNext ? "bg-forest text-paper hover:bg-forest-2" : "bg-ink/10 text-ink/45"
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
