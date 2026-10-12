"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { buttonClass, ButtonInner } from "@/components/ui";
import { elements } from "@/lib/elements";
import { projects } from "@/lib/projects";

/*
 * PROTOTYPE FORM — validates in the browser only. Nothing is transmitted or stored.
 * Real delivery needs an approved backend or form integration (see README).
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

const interests = [
  elements.name,
  "Upcoming Disha Habitat launches",
  ...projects.map((p) => p.name),
  "Something else",
];

const empty: Values = { name: "", phone: "", email: "", interest: interests[0], message: "", consent: false };

function validate(v: Values): Errors {
  const errors: Errors = {};
  const name = v.name.trim();
  if (!name) errors.name = "Please tell us your name.";
  else if (name.length < 2) errors.name = "Please enter your full name.";

  const digits = v.phone.replace(/[\s()-]/g, "").replace(/^(\+91|0091|0)/, "");
  if (!v.phone.trim()) errors.phone = "Please add a mobile number so we can call you back.";
  else if (!/^[6-9]\d{9}$/.test(digits)) errors.phone = "Enter a 10-digit Indian mobile number, e.g. 98765 43210.";

  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    errors.email = "That email address doesn’t look right.";

  if (v.message.length > 600) errors.message = "Please keep your message under 600 characters.";
  if (!v.consent) errors.consent = "Please confirm we may contact you about this enquiry.";
  return errors;
}

const labels: Record<keyof Values, string> = {
  name: "Full name",
  phone: "Mobile number",
  email: "Email",
  interest: "I’m interested in",
  message: "Message",
  consent: "Consent",
};

export function EnquiryForm({
  defaultInterest,
  tone = "light",
}: {
  defaultInterest?: string;
  tone?: "light" | "dark";
}) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [values, setValues] = useState<Values>({
    ...empty,
    interest: defaultInterest && interests.includes(defaultInterest) ? defaultInterest : empty.interest,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const dark = tone === "dark";
  const fieldBase = `peer block w-full border-0 border-b bg-transparent px-0 pb-3 pt-2 text-base outline-none transition-colors placeholder:text-current placeholder:opacity-40 focus:ring-0 ${
    dark ? "border-paper/35 text-paper focus:border-paper" : "border-ink/25 text-ink focus:border-ink"
  }`;
  const labelBase = `label ${dark ? "text-paper/70" : "text-mute"}`;
  const errorText = dark ? "text-[#ffb4a8]" : "text-error";

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
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    // Demo only: no network request is made.
    setSubmitted(values.name.trim().split(/\s+/)[0]);
    requestAnimationFrame(() => successRef.current?.focus());
  };

  if (submitted) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={`outline-none ${dark ? "text-paper" : "text-ink"}`}
      >
        <CheckCircle2 aria-hidden className="size-8" strokeWidth={1.25} />
        <h3 className="serif mt-6 text-[2.8rem] leading-none">Thank you, {submitted}.</h3>
        <p className={`mt-4 max-w-md leading-relaxed ${dark ? "text-paper/75" : "text-mute"}`}>
          Your details passed validation. On the live website, this is where your enquiry would reach the Disha
          Habitat team.
        </p>
        <p
          className={`mt-6 flex max-w-md gap-3 border p-4 text-sm leading-relaxed ${
            dark ? "border-paper/25 text-paper/85" : "border-ink/15 bg-paper-2 text-mute"
          }`}
        >
          <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong className="font-semibold">Prototype preview:</strong> this form is not connected to any system, so
            nothing has been sent or stored.
          </span>
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(null);
            setValues({ ...empty, interest: values.interest });
            setTouched(false);
            setErrors({});
          }}
          className={`mt-8 inline-flex min-h-11 items-center text-[0.92rem] font-medium underline underline-offset-8 ${
            dark ? "decoration-paper/40" : "decoration-ink/30"
          }`}
        >
          Start a new enquiry
        </button>
      </div>
    );
  }

  const errorKeys = Object.keys(errors) as (keyof Values)[];
  const describedBy = (k: keyof Values) => (errors[k] ? id(`${k}-error`) : undefined);

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby={id("demo-note")} className="space-y-8">
      {touched && errorKeys.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className={`flex gap-3 border p-4 text-sm outline-none ${
            dark ? "border-[#ffb4a8]/50 text-paper" : "border-error/40 bg-error/5 text-ink"
          }`}
        >
          <AlertCircle aria-hidden className={`mt-0.5 size-4 shrink-0 ${errorText}`} />
          <div>
            <p className="font-semibold">
              Please check {errorKeys.length === 1 ? "one field" : `${errorKeys.length} fields`}:
            </p>
            <ul className="mt-1 space-y-0.5">
              {errorKeys.map((k) => (
                <li key={k}>
                  <a href={`#${id(k)}`} className="underline underline-offset-2">
                    {labels[k]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={id("name")} className={labelBase}>
            Full name <span aria-hidden>*</span>
          </label>
          <input
            id={id("name")}
            name="name"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            className={fieldBase}
            placeholder="Your name"
          />
          {errors.name && (
            <p id={id("name-error")} className={`mt-2 text-sm ${errorText}`}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id("phone")} className={labelBase}>
            Mobile number <span aria-hidden>*</span>
          </label>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            className={fieldBase}
            placeholder="98765 43210"
          />
          {errors.phone && (
            <p id={id("phone-error")} className={`mt-2 text-sm ${errorText}`}>
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id("email")} className={labelBase}>
            Email <span className="font-normal normal-case tracking-normal opacity-70">(optional)</span>
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={fieldBase}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id={id("email-error")} className={`mt-2 text-sm ${errorText}`}>
              {errors.email}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id("interest")} className={labelBase}>
            I’m interested in
          </label>
          <select
            id={id("interest")}
            name="interest"
            value={values.interest}
            onChange={(e) => set("interest", e.target.value)}
            className={`${fieldBase} cursor-pointer appearance-none bg-[length:12px] bg-[right_0.25rem_center] bg-no-repeat pr-8`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='${dark ? "%23fbf8f2" : "%231d1c19"}' stroke-width='1.4'/%3E%3C/svg%3E")`,
            }}
          >
            {interests.map((option) => (
              <option key={option} value={option} className="text-ink">
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id("message")} className={labelBase}>
            Message <span className="font-normal normal-case tracking-normal opacity-70">(optional)</span>
          </label>
          <textarea
            id={id("message")}
            name="message"
            rows={3}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message")}
            className={`${fieldBase} resize-none`}
            placeholder="A good time to call, questions about a site visit…"
          />
          {errors.message && (
            <p id={id("message-error")} className={`mt-2 text-sm ${errorText}`}>
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={id("consent")}
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy("consent")}
            className={`mt-0.5 size-5 shrink-0 cursor-pointer ${dark ? "accent-paper" : "accent-ink"}`}
          />
          <label htmlFor={id("consent")} className={`text-sm leading-relaxed ${dark ? "text-paper/80" : "text-mute"}`}>
            I agree to be contacted by Disha Habitat by phone or email about this enquiry.
          </label>
        </div>
        {errors.consent && (
          <p id={id("consent-error")} className={`mt-2 text-sm ${errorText}`}>
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className={buttonClass(dark ? "paper" : "ink", "shrink-0 whitespace-nowrap")}
        >
          <ButtonInner>Send enquiry</ButtonInner>
        </button>
        <p id={id("demo-note")} className={`flex items-center gap-2 text-xs ${dark ? "text-paper/60" : "text-mute"}`}>
          <Info aria-hidden className="size-3.5 shrink-0" />
          Prototype: submissions are validated but not sent.
        </p>
      </div>
    </form>
  );
}
