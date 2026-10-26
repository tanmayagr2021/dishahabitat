/*
 * The visitor's cookie and analytics choice. It is kept in this browser only (localStorage), with a
 * version and the date it was made. No analytics or marketing tool is loaded before "analytics" or
 * "marketing" is true here: anything that adds one must check hasConsent() first and listen with
 * onConsentChange().
 */
export type ConsentCategory = "analytics" | "marketing";

export type Consent = { version: 1; date: string; analytics: boolean; marketing: boolean };

export const CONSENT_KEY = "disha-consent";
const VERSION = 1;
const OPEN_EVENT = "disha:cookie-settings";

const listeners = new Set<() => void>();
let raw: string | null | undefined; // undefined until first read

function readRaw() {
  if (raw === undefined) {
    try {
      raw = localStorage.getItem(CONSENT_KEY);
    } catch {
      raw = null;
    }
  }
  return raw;
}

/* Parsed once per change, so React can compare the result by identity. */
let parsedFor: string | null | undefined;
let parsed: Consent | null = null;

/* The saved choice, or null if the visitor has not made one (or it was made under an older notice). */
export function getConsent(): Consent | null {
  const r = readRaw();
  if (r === parsedFor) return parsed;
  parsedFor = r;
  parsed = null;
  if (r) {
    try {
      const c = JSON.parse(r) as Partial<Consent>;
      if (c.version === VERSION && typeof c.analytics === "boolean" && typeof c.marketing === "boolean" && typeof c.date === "string") {
        parsed = c as Consent;
      }
    } catch {
      /* an unreadable value counts as no choice */
    }
  }
  return parsed;
}

export function hasConsent(category: ConsentCategory): boolean {
  if (typeof window === "undefined") return false;
  return getConsent()?.[category] === true;
}

const notify = () => listeners.forEach((l) => l());

export function saveConsent(choice: { analytics: boolean; marketing: boolean }) {
  const value: Consent = { version: VERSION, date: new Date().toISOString(), ...choice };
  raw = JSON.stringify(value);
  try {
    localStorage.setItem(CONSENT_KEY, raw);
  } catch {
    /* the choice still holds for this visit */
  }
  notify();
}

/* Calls cb whenever the choice changes, in this tab or another. Returns a function that stops listening. */
export function onConsentChange(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CONSENT_KEY) {
      raw = e.newValue;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/* Opens the banner again so the visitor can change their mind. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export const COOKIE_SETTINGS_EVENT = OPEN_EVENT;
