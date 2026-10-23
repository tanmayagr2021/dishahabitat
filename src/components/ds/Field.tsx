"use client";

import { type ComponentProps, type ReactNode, useId } from "react";
import s from "./Field.module.css";

type Common = {
  label: ReactNode;
  /* Help under the label, such as "We only call between 10 am and 7 pm". */
  hint?: ReactNode;
  /* What is wrong, in words. Shown in red and read out by screen readers. */
  error?: string;
  optional?: boolean;
};

/* Label, help, the control and its error, wired together for screen readers. */
function Frame({ id, label, hint, error, optional, children }: Common & { id: string; children: ReactNode }) {
  return (
    <div className={s.field} data-invalid={error ? true : undefined}>
      <label htmlFor={id} className={s.label}>
        {label}
        {optional && <span className={s.optional}> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className={s.hint}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className={s.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const described = (id: string, hint?: ReactNode, error?: string) =>
  [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;

export function TextField({ label, hint, error, optional, id: given, className, ...input }: Common & ComponentProps<"input">) {
  const auto = useId();
  const id = given ?? auto;
  return (
    <Frame id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        className={`${s.control} ${className ?? ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={described(id, hint, error)}
        {...input}
      />
    </Frame>
  );
}

export function TextArea({ label, hint, error, optional, id: given, className, ...input }: Common & ComponentProps<"textarea">) {
  const auto = useId();
  const id = given ?? auto;
  return (
    <Frame id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        className={`${s.control} ${s.area} ${className ?? ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={described(id, hint, error)}
        {...input}
      />
    </Frame>
  );
}

export function SelectField({
  label,
  hint,
  error,
  optional,
  id: given,
  className,
  options,
  ...select
}: Common & ComponentProps<"select"> & { options: readonly (string | { value: string; label: string })[] }) {
  const auto = useId();
  const id = given ?? auto;
  return (
    <Frame id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className={s.selectWrap}>
        <select
          id={id}
          className={`${s.control} ${s.select} ${className ?? ""}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={described(id, hint, error)}
          {...select}
        >
          {options.map((o) =>
            typeof o === "string" ? (
              <option key={o} value={o}>
                {o}
              </option>
            ) : (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ),
          )}
        </select>
      </div>
    </Frame>
  );
}

/* A tick box with its words beside it, such as a consent line. */
export function Checkbox({ label, error, id: given, ...input }: { label: ReactNode; error?: string } & ComponentProps<"input">) {
  const auto = useId();
  const id = given ?? auto;
  return (
    <div className={s.check} data-invalid={error ? true : undefined}>
      <input id={id} type="checkbox" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} {...input} />
      <label htmlFor={id}>{label}</label>
      {error && (
        <p id={`${id}-error`} className={s.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/*
 * A choice between a few options shown as cards (where to meet, which home), a radio group under the
 * hood: arrow keys move between them, and the chosen one is marked by more than colour.
 */
export function ChoiceCards<T extends string>({
  legend,
  name,
  value,
  onChange,
  options,
  error,
  columns = 3,
}: {
  legend: ReactNode;
  name: string;
  value: T | null;
  onChange: (v: T) => void;
  options: readonly { value: T; title: ReactNode; detail?: ReactNode; icon?: ReactNode }[];
  error?: string;
  columns?: 2 | 3 | 4;
}) {
  const id = useId();
  return (
    <fieldset className={s.choices} aria-describedby={error ? `${id}-error` : undefined}>
      <legend className={s.label}>{legend}</legend>
      <div className={s.cards} data-columns={columns}>
        {options.map((o) => (
          <label key={o.value} className={s.card} data-checked={value === o.value || undefined}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            {o.icon && <span className={s.cardIcon}>{o.icon}</span>}
            <span className={s.cardTitle}>{o.title}</span>
            {o.detail && <span className={s.cardDetail}>{o.detail}</span>}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className={s.error} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/* Class names for controls a page builds itself, so they match. */
export const fieldClasses = s;
