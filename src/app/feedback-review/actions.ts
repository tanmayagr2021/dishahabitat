"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { feedbackStatuses } from "@/lib/feedback";
import { COOKIE, cookieToken, isReviewer, keyMatches } from "@/lib/server/review-auth";
import { updateRow } from "@/lib/server/store";

export async function signIn(_prev: string | null, form: FormData): Promise<string | null> {
  const key = String(form.get("key") ?? "");
  if (!keyMatches(key)) return "That key doesn’t match. Check it and try again.";
  (await cookies()).set(COOKIE, cookieToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  refresh();
  return null;
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
  refresh();
}

const statuses = new Set<string>(feedbackStatuses.map((s) => s.id));
const leadStatuses = new Set(["new", "contacted", "visit_booked", "closed", "spam"]);

/* Moves a note (or a lead) to another status, with an optional note for the team. */
export async function setStatus(form: FormData) {
  if (!(await isReviewer())) return;
  const table = form.get("table") === "leads" ? "leads" : "feedback";
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  const note = String(form.get("team_note") ?? "").trim().slice(0, 2000);
  if (!id || !(table === "leads" ? leadStatuses : statuses).has(status)) return;
  await updateRow(table, id, { status, team_note: note || null });
  refresh();
}
