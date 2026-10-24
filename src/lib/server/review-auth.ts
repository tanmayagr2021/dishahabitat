import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/*
 * Who may read feedback and leads: anyone holding FEEDBACK_REVIEW_KEY (a long random phrase set in
 * Vercel's environment variables). Entering it once sets an http-only cookie for 30 days that holds
 * a hash of the key, never the key itself. On a developer's own machine with no key set, the review
 * page is open; in production with no key set, it is closed to everyone.
 */
const KEY = process.env.FEEDBACK_REVIEW_KEY ?? "";
export const COOKIE = "disha_review";
export const reviewOpenLocally = !KEY && process.env.NODE_ENV !== "production";
export const reviewConfigured = !!KEY;

const hash = (k: string) => createHash("sha256").update(`disha-review:${k}`).digest();

export function keyMatches(input: string) {
  if (!KEY || !input) return false;
  return timingSafeEqual(hash(input), hash(KEY));
}

export const cookieToken = () => hash(KEY).toString("hex");

export async function isReviewer() {
  if (reviewOpenLocally) return true;
  if (!KEY) return false;
  const value = (await cookies()).get(COOKIE)?.value ?? "";
  const expected = cookieToken();
  return value.length === expected.length && timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
