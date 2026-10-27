"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Checkbox, SelectField, TextArea, TextField } from "@/components/ds";
import { elements } from "@/lib/elements";
import { recordLead } from "@/lib/leads";
import { buildMessage, mailtoUrl, parsePhone, phoneHelp, shownPhone, whatsappUrl } from "@/lib/messaging";
import { PhoneField } from "./PhoneField";
import { projects } from "@/lib/projects";
import { SuccessTick } from "./SuccessTick";
import s from "./EnquiryForm.module.css";

/*
 * The enquiry form. Pressing Continue records the enquiry (so the team can reply even if the
 * visitor never presses Send) and shows the message; WhatsApp or email then opens with it ready.
 */
type Values = {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
  consent: boolean;
};

type Errors = Partial<Record<keyof Values, string>>;

const interests = [elements.name, "Upcoming Disha Habitat launches", ...projects.map((p) => p.name), "Something else"];

const empty: Values = { name: "", phone: "", email: "", interest: interests[0], message: "", consent: false };

function validate(v: Values): Errors {
  const errors: Errors = {};
  const name = v.name.trim();
  if (!name) errors.name = "Please tell us your name.";
  else if (name.length < 2) errors.name = "Please enter your full name.";

  if (!v.phone.trim()) errors.phone = "Please add a mobile number so our team can reach you.";
  else if (!parsePhone(v.phone).ok) errors.phone = phoneHelp;

  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = "That email address doesn’t look right.";

  if (v.message.length > 600) errors.message = "Please keep your message under 600 characters.";
  if (!v.consent) errors.consent = "Please confirm we may contact you about this enquiry.";
  return errors;
}

/* `tone` is accepted for older callers; the form now looks the same everywhere. */
export function EnquiryForm({ defaultInterest }: { defaultInterest?: string; tone?: "light" | "dark" }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>({
    ...empty,
    interest: defaultInterest && interests.includes(defaultInterest) ? defaultInterest : empty.interest,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // The project explorer can pre-select a community ("Enquire about this community").
  useEffect(() => {
    const onInterest = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      if (interests.includes(name)) setValues((v) => ({ ...v, interest: name }));
    };
    window.addEventListener("disha:interest", onInterest);
    return () => window.removeEventListener("disha:interest", onInterest);
  }, []);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched) setErrors(validate(next));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }
    const phone = parsePhone(values.phone);
    recordLead({
      kind: "enquiry",
      name: values.name.trim(),
      phone: phone.display,
      email: values.email.trim() || undefined,
      interest: values.interest,
      message: values.message.trim() || undefined,
      consent: true,
    });
    setSubmitted(values.name.trim().split(/\s+/)[0]);
    requestAnimationFrame(() => successRef.current?.focus());
  };

  const message = buildMessage(
    `I’d like to know more about ${values.interest}.`,
    [
      ["Name", values.name],
      ["Mobile", shownPhone(values.phone) || values.phone],
      ["Email", values.email],
    ],
    values.message,
  );

  if (submitted) {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className={s.done}>
        <SuccessTick />
        <h3 className={`display ${s.doneTitle}`}>Ready to send, {submitted}.</h3>
        <p className={s.doneLine}>This is the message you’ll send. Choose how to send it.</p>
        <p className={s.message}>{message}</p>
        <div className={s.doneActions}>
          <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
            Send on WhatsApp
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href={mailtoUrl(`Enquiry: ${values.interest}`, message, values.interest === elements.name ? elements.email : undefined)}
            className="btn btn-soft"
          >
            Send by email
          </a>
        </div>
        <button
          type="button"
          className={`text-link ${s.again}`}
          onClick={() => {
            setSubmitted(null);
            setValues({ ...empty, interest: values.interest });
            setTouched(false);
            setErrors({});
          }}
        >
          Start a new enquiry
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className={s.form}>
      <TextField label="Full name" name="name" autoComplete="name" required value={values.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
      <div className={s.pair}>
        <PhoneField name="phone" required value={values.phone} onChange={(v) => set("phone", v)} error={errors.phone} helpClassName={s.phoneHelp} />
        <TextField
          label="Email"
          optional
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
        />
      </div>
      <SelectField label="I’m interested in" name="interest" value={values.interest} onChange={(e) => set("interest", e.target.value)} options={interests} />
      <TextArea
        label="Message"
        optional
        name="message"
        rows={3}
        placeholder="A good time to call, questions about a site visit…"
        value={values.message}
        onChange={(e) => set("message", e.target.value)}
        error={errors.message}
      />
      <Checkbox
        name="consent"
        checked={values.consent}
        onChange={(e) => set("consent", e.target.checked)}
        error={errors.consent}
        label="I agree that Disha Habitat may contact me by phone, WhatsApp or email about this enquiry and store these details to reply."
      />
      <div className={s.submit}>
        <button type="submit" className="btn btn-dark">
          Continue
        </button>
        <p>Next, choose WhatsApp or email to send it.</p>
      </div>
    </form>
  );
}
