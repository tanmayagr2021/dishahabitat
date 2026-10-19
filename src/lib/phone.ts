/*
 * Phone numbers as people actually type them. Indian mobiles in any common form (98765 43210,
 * 098765 43210, +91 98765 43210, 0091…), and any other country written with its code (+971…, 001…)
 * so buyers abroad can send a request too. Kept free of other imports so it can be unit-tested.
 */
export const phoneHelp = "Enter a 10-digit Indian mobile number, or your number with its country code, e.g. +971 50 123 4567.";

/* Digits typed on an Indian-language or Arabic keyboard (०-९, ೦-೯, ௦-௯, ٠-٩…) become 0-9. */
const zeros = [0x0660, 0x06f0, 0x0966, 0x09e6, 0x0a66, 0x0ae6, 0x0b66, 0x0be6, 0x0c66, 0x0ce6, 0x0d66, 0xff10];
export const toAsciiDigits = (s: string) =>
  s.replace(/[\u0660-\u0669\u06f0-\u06f9\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef\u0d66-\u0d6f\uff10-\uff19]/g, (c) => {
    const code = c.charCodeAt(0);
    const zero = zeros.find((z) => code >= z && code <= z + 9)!;
    return String(code - zero);
  });

/* What a phone field accepts as you type: digits (in any script, shown as 0-9), spaces, + ( ) -. */
export const cleanPhoneInput = (s: string) => toAsciiDigits(s).replace(/[^\d\s+()-]/g, "").slice(0, 20);

export function parsePhone(input: string): { ok: boolean; empty: boolean; display: string } {
  const raw = toAsciiDigits(input).trim();
  if (!raw) return { ok: false, empty: true, display: "" };
  const compact = raw.replace(/[\s()-]/g, "");
  const indian = (n: string) =>
    /^[6-9]\d{9}$/.test(n) ? { ok: true, empty: false, display: `+91 ${n.slice(0, 5)} ${n.slice(5)}` } : { ok: false, empty: false, display: "" };
  if (/^(\+|00)/.test(compact)) {
    const d = compact.replace(/^(\+|00)/, "").replace(/\D/g, "");
    if (d.startsWith("91")) return indian(d.slice(2));
    return d.length >= 8 && d.length <= 15 ? { ok: true, empty: false, display: `+${d}` } : { ok: false, empty: false, display: "" };
  }
  return indian(compact.replace(/\D/g, "").replace(/^(?:91|0)(?=\d{10}$)/, ""));
}
