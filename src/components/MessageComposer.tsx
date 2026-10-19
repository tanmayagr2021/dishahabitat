"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Mail, MessageCircle, Send, X } from "lucide-react";
import { buildMessage, cleanPhoneInput, destinations, mailtoUrl, parsePhone, phoneHelp, whatsappUrl, type Channel } from "@/lib/messaging";
import { elements } from "@/lib/elements";
import { projectsNewestFirst } from "@/lib/projects";

/*
 * One message form for the whole site. Every "WhatsApp us" and "Email us" opens it: the visitor
 * fills a few fields, sees the exact message, and sending opens WhatsApp or their email app with
 * that message ready. Nothing is stored or sent by the website.
 */
const topics = [
  `${elements.name}`,
  "Booking a site visit",
  "Documents and approvals",
  "Current prices",
  "Floor plans and carpet areas",
  ...projectsNewestFirst.map((p) => p.name),
  "Something else",
];

export function MessageComposer() {
  const uid = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [topic, setTopic] = useState(topics[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [tried, setTried] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const open = (e: Event) => {
      const d = (e as CustomEvent<{ channel?: Channel; topic?: string }>).detail ?? {};
      if (d.channel) setChannel(d.channel);
      // Each opening starts from its own topic (or the default), never the last visitor action's.
      setTopic(d.topic && topics.includes(d.topic) ? d.topic : topics[0]);
      setTried(false);
      setCopied(false);
      ref.current?.showModal();
    };
    window.addEventListener("disha:compose", open);
    return () => window.removeEventListener("disha:compose", open);
  }, []);

  const parsed = parsePhone(phone);
  // Optional on both channels (WhatsApp already shows your number), but checked when given.
  const phoneOk = parsed.empty || parsed.ok;
  const emailOk = email.trim() === "" ? true : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const nameOk = name.trim().length >= 2;
  const ok = nameOk && phoneOk && emailOk;

  const message = buildMessage(
    topic === "Booking a site visit"
      ? "I’d like to book a site visit."
      : topic === "Documents and approvals"
        ? `I’d like to see the documents and approvals for ${elements.name}.`
        : topic === "Current prices"
          ? `Please share the current prices for homes at ${elements.name}.`
          : topic === "Floor plans and carpet areas"
            ? `Please send the floor plans and carpet areas for homes at ${elements.name}.`
        : `I’d like to know more about ${topic === "Something else" ? "your homes" : topic}.`,
    [
      ["Name", name],
      ["Mobile", parsed.ok ? parsed.display : undefined],
      ["Email", email],
    ],
    note,
  );
  const emailTo = [elements.name, "Documents and approvals", "Current prices", "Floor plans and carpet areas"].includes(topic) ? elements.email : destinations.email.to;
  const href = channel === "whatsapp" ? whatsappUrl(message) : mailtoUrl(`Enquiry: ${topic}`, message, emailTo);
  const d = channel === "whatsapp" ? destinations.whatsapp : { ...destinations.email, to: emailTo };

  const field =
    "mt-1.5 w-full rounded-lg border border-ink/45 bg-white px-3.5 py-3 text-[1rem] outline-none transition-shadow focus:border-ink focus:shadow-[0_0_0_3px_rgb(57_170_225/0.25)] aria-[invalid=true]:border-error";

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${uid}-title`}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="m-auto w-[min(94vw,46rem)] overflow-visible bg-transparent p-0 text-ink backdrop:bg-forest-deep/70 backdrop:backdrop-blur-sm"
    >
      <div className="max-h-[92svh] overflow-y-auto rounded-2xl bg-paper shadow-[0_40px_120px_-30px_rgb(0_0_0/0.6)]">
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 p-5 sm:p-7">
          <div>
            <p className="eyebrow text-mute">Message us</p>
            <h2 id={`${uid}-title`} className="serif mt-2 text-[1.9rem] leading-tight">
              {channel === "whatsapp" ? "Write to us on WhatsApp." : "Write to us by email."}
            </h2>
          </div>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-ink/5 hover:bg-ink/10">
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-2">
          <div className="space-y-4">
            <div role="radiogroup" aria-label="Send with" className="grid grid-cols-2 gap-2 rounded-xl bg-ink/5 p-1">
              {(["whatsapp", "email"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={channel === c}
                  onClick={() => setChannel(c)}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors ${
                    channel === c ? "bg-white shadow-sm" : "text-mute hover:text-ink"
                  }`}
                >
                  {c === "whatsapp" ? <MessageCircle aria-hidden className="size-4 text-[#187a41]" /> : <Mail aria-hidden className="size-4" />}
                  {destinations[c].label}
                </button>
              ))}
            </div>
            <div>
              <label htmlFor={`${uid}-topic`} className="text-sm font-medium">
                I’m interested in
              </label>
              <select id={`${uid}-topic`} value={topic} onChange={(e) => setTopic(e.target.value)} className={field}>
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${uid}-name`} className="text-sm font-medium">
                Your name
              </label>
              <input id={`${uid}-name`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={tried && !nameOk} className={field} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-phone`} className="text-sm font-medium">
                  Mobile <span className="font-normal text-mute">(optional)</span>
                </label>
                <input
                  id={`${uid}-phone`}
                  value={phone}
                  onChange={(e) => setPhone(cleanPhoneInput(e.target.value))}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="98765 43210"
                  aria-invalid={tried && !phoneOk}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor={`${uid}-email`} className="text-sm font-medium">
                  Email <span className="font-normal text-mute">(optional)</span>
                </label>
                <input id={`${uid}-email`} value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" aria-invalid={tried && !emailOk} className={field} />
              </div>
            </div>
            <div>
              <label htmlFor={`${uid}-note`} className="text-sm font-medium">
                Your message <span className="font-normal text-mute">(optional)</span>
              </label>
              <textarea maxLength={500}
                id={`${uid}-note`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="A good time to call, the size of home you’re looking for…"
                aria-describedby={`${uid}-note-count`}
                className={field}
              />
              <p id={`${uid}-note-count`} className="mt-1 text-right text-xs tabular-nums text-mute">
                {note.length}/500
              </p>
            </div>
            {tried && !ok && (
              <p role="alert" className="text-sm text-error">
                {!nameOk ? "Please add your name. " : ""}
                {!phoneOk ? `${phoneHelp} ` : ""}
                {!emailOk ? "Check the email address." : ""}
              </p>
            )}
          </div>

          {/* The exact message */}
          <div className="flex flex-col">
            <p className="text-sm font-medium">This is exactly what will be sent</p>
            <div className={`mt-1.5 flex-1 rounded-xl p-4 text-[0.92rem] leading-relaxed ${channel === "whatsapp" ? "bg-[#e7f6e9]" : "border border-ink/10 bg-white"}`}>
              <p className="text-xs text-mute">
                To {d.label} · {d.to}
              </p>
              <p className="mt-2 whitespace-pre-wrap" aria-live="polite">
                {message}
              </p>
            </div>
            {(() => {
              const cls = `mt-4 inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 font-semibold transition-colors ${
                channel === "whatsapp" ? "bg-[#187a41] text-white hover:bg-[#12613a]" : "bg-forest text-paper hover:bg-forest-2"
              }`;
              const label = (
                <>
                  <Send aria-hidden className="size-4" /> {channel === "whatsapp" ? "Send on WhatsApp" : "Send by email"}
                </>
              );
              // Until the form is complete this is a button that shows what is missing; then a real link.
              return ok ? (
                <a
                  href={href}
                  target={channel === "whatsapp" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={() => setTimeout(() => ref.current?.close(), 300)}
                  className={cls}
                >
                  {label}
                </a>
              ) : (
                <button type="button" onClick={() => setTried(true)} className={`${cls} opacity-60`}>
                  {label}
                </button>
              );
            })()}
            <p className="mt-2 text-xs text-mute">
              Opens {channel === "whatsapp" ? "WhatsApp" : "your email app"} with this message ready to send. The website does not store it.{" "}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(`${channel === "email" ? `To: ${emailTo}\n\n` : ""}${message}`).then(
                    () => setCopied(true),
                    () => setCopied(false),
                  );
                }}
                className="font-semibold text-forest underline underline-offset-2"
              >
                {copied ? "Copied" : "Copy the message instead"}
              </button>
            </p>
            {channel === "whatsapp" && (
              <p className="mt-2 text-xs text-mute">
                Rather write it yourself?{" "}
                <a href={elements.whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest underline underline-offset-2">
                  Just open WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
