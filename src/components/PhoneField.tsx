"use client";

import { useId } from "react";
import { TextField } from "@/components/ds";
import { fieldClasses } from "@/components/ds/Field";
import { cleanPhoneInput, phoneHint, phonePlaceholder } from "@/lib/phone";

/*
 * A mobile number field for India and abroad. Its help line is a sibling, not part of the field, so
 * in a two-column row the parent can place it under the input and keep both inputs level.
 */
export function PhoneField({
  label = "Mobile number",
  value,
  onChange,
  error,
  optional,
  required,
  name,
  helpClassName = "",
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  optional?: boolean;
  required?: boolean;
  name?: string;
  helpClassName?: string;
}) {
  const id = useId();
  return (
    <>
      <TextField
        id={id}
        label={label}
        optional={optional}
        required={required}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder={phonePlaceholder}
        value={value}
        onChange={(e) => onChange(cleanPhoneInput(e.target.value))}
        error={error}
        aria-describedby={[error ? `${id}-error` : "", `${id}-help`].filter(Boolean).join(" ")}
      />
      <p id={`${id}-help`} className={`${fieldClasses.hint} ${helpClassName}`}>
        {phoneHint}
      </p>
    </>
  );
}
