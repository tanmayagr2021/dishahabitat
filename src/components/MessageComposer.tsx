"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SelectField, TextArea, TextField } from "@/components/ds";
import { CloseIcon } from "@/components/showroom/Icons";
import { elements } from "@/lib/elements";
import { recordLead } from "@/lib/leads";
import { buildMessage, cleanPhoneInput, destinations, mailtoUrl, parsePhone, phoneHelp, whatsappUrl, type Channel } from "@/lib/messaging";
import { projectsNewestFirst } from "@/lib/projects";
import { SuccessTick } from "./SuccessTick";
import s from "./MessageComposer.module.css";

/*
 * One message form for the whole site. Every "WhatsApp us" and "Email us" opens it: the visitor
 * fills a few fields, sees the exact message, and sending opens WhatsApp or their email app with
 * that message ready. The details are also recorded so the team can reply (src/lib/leads.ts).
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

const elementsTopics = [elements.name, "Documents and approvals", "Current prices", "Floor plans and carpet areas"];

function opening(topic: string) {
  switch (topic) {
    case "Booking a site visit":
      return "I’d like to book a site visit.";
    case "Documents and approvals":
      return `I’d like to see the documents and approvals for ${elements.name}.`;
    case "Current prices":
      return `Please share the current prices for homes at ${elements.name}.`;
    case "Floor plans and carpet areas":
      return `Please send the floor plans and carpet areas for homes at ${elements.name}.`;
    case "Something else":
      return "I’d like to know more about your homes.";
    default:
      return `I’d like to know more about ${topic}.`;
  }
}

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
  const [sent, setSent] = useState(false);
  const recorded = useRef("");

  useEffect(() => {
    const open = (e: Event) => {
      const d = (e as CustomEvent<{ channel?: Channel; topic?: string }>).detail ?? {};
      if (d.channel) setChannel(d.channel);
      // Each opening starts from its own topic (or the default), never the last visitor action's.
      setTopic(d.topic && topics.includes(d.topic) ? d.topic : topics[0]);
      setTried(false);
      setCopied(false);
      setSent(false);
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
    opening(topic),
    [
      ["Name", name],
      ["Mobile", parsed.ok ? parsed.display : undefined],
      ["Email", email],
    ],
    note,
  );
  const emailTo = elementsTopics.includes(topic) ? elements.email : destinations.email.to;
  const href = channel === "whatsapp" ? whatsappUrl(message) : mailtoUrl(`Enquiry: ${topic}`, message, emailTo);
  const to = channel === "whatsapp" ? destinations.whatsapp.to : emailTo;
  const close = () => ref.current?.close();

  const handOff = () => {
    if (recorded.current === message) return;
    recorded.current = message;
    recordLead({
      kind: "message",
      name: name.trim(),
      phone: parsed.ok ? parsed.display : undefined,
      email: email.trim() || undefined,
      interest: topic,
      message: note.trim() || undefined,
      channel,
      consent: true,
    });
    // After the hand-off has opened, so the link is not removed mid-click.
    setTimeout(() => setSent(true), 300);
  };

  return (
    <dialog ref={ref} aria-labelledby={`${uid}-title`} onClick={(e) => e.target === e.currentTarget && close()} className={s.dialog}>
      <div className={s.sheet}>
        <header className={s.head}>
          <div>
            <p className="eyebrow">Message us</p>
            <h2 id={`${uid}-title`} className={`display ${s.title}`}>
              {channel === "whatsapp" ? "Write to us on WhatsApp" : "Write to us by email"}
            </h2>
          </div>
          <button type="button" onClick={close} aria-label="Close" className={s.close}>
            <CloseIcon />
          </button>
        </header>

        {sent ? (
          <div className={s.done} role="status">
            <SuccessTick />
            <p className={s.doneTitle}>{channel === "whatsapp" ? "Your message is open in WhatsApp." : "Your message is open in your email app."}</p>
            <p className={s.doneLine}>Press send there to finish.</p>
            <button type="button" className={`btn btn-dark ${s.send}`} onClick={close}>
              Done
            </button>
          </div>
        ) : (
          <>
        <div role="group" aria-label="Send with" className={s.tabs}>
          {(["whatsapp", "email"] as const).map((c) => (
            <button key={c} type="button" aria-pressed={channel === c} onClick={() => setChannel(c)} className={s.tab}>
              {destinations[c].label}
            </button>
          ))}
        </div>

        <div className={s.fields}>
          <SelectField label="I’m interested in" value={topic} onChange={(e) => setTopic(e.target.value)} options={topics} />
          <TextField
            label="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            error={tried && !nameOk ? "Please add your name." : undefined}
          />
          <div className={s.pair}>
            <TextField
              label="Mobile"
              optional
              value={phone}
              onChange={(e) => setPhone(cleanPhoneInput(e.target.value))}
              inputMode="tel"
              autoComplete="tel"
              placeholder="98765 43210"
              error={tried && !phoneOk ? phoneHelp : undefined}
            />
            <TextField
              label="Email"
              optional
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              error={tried && !emailOk ? "Check the email address." : undefined}
            />
          </div>
          <TextArea
            label="Your message"
            optional
            maxLength={500}
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A good time to call, the size of home you’re looking for…"
            hint={`${note.length}/500`}
          />
        </div>

        <div className={s.preview}>
          <p className={s.previewLabel}>
            This is exactly what will be sent, to {to}
          </p>
          <p className={s.previewText} aria-live="polite">
            {message}
          </p>
        </div>

        {ok ? (
          <a
            href={href}
            target={channel === "whatsapp" ? "_blank" : undefined}
            rel="noopener noreferrer"
            onClick={handOff}
            className={`btn btn-dark ${s.send}`}
          >
            {channel === "whatsapp" ? "Send on WhatsApp" : "Send by email"}
            {channel === "whatsapp" && <span className="sr-only">(opens in a new tab)</span>}
          </a>
        ) : (
          <button type="button" onClick={() => setTried(true)} aria-disabled className={`btn btn-dark ${s.send}`}>
            {channel === "whatsapp" ? "Send on WhatsApp" : "Send by email"}
          </button>
        )}

        <p className={s.fine}>
          Opens {channel === "whatsapp" ? "WhatsApp" : "your email app"} with this message ready. By sending, you agree that Disha Habitat may store these details to reply to you.
        </p>
        <p className={s.links}>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              navigator.clipboard?.writeText(`${channel === "email" ? `To: ${emailTo}\n\n` : ""}${message}`).then(
                () => setCopied(true),
                () => setCopied(false),
              );
            }}
          >
            {copied ? "Copied" : "Copy the message instead"}
          </button>
          {channel === "whatsapp" && (
            <a href={elements.whatsapp} target="_blank" rel="noopener noreferrer" className="text-link">
              Just open WhatsApp
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </p>
          </>
        )}
      </div>
    </dialog>
  );
}
