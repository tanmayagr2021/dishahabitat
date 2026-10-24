"use client";

import { useActionState } from "react";
import { TextField } from "@/components/ds";
import { signIn } from "./actions";

export function SignIn() {
  const [error, action, pending] = useActionState(signIn, null);
  return (
    <form action={action} style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <TextField label="Review key" name="key" type="password" autoComplete="current-password" required error={error ?? undefined} />
      <button type="submit" className="btn btn-dark" disabled={pending}>
        {pending ? "Checking…" : "Open feedback"}
      </button>
    </form>
  );
}
