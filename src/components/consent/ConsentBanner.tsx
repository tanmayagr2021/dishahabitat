"use client";

import Link from "next/link";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { type Consent, COOKIE_SETTINGS_EVENT, getConsent, onConsentChange, openCookieSettings, saveConsent } from "@/lib/consent";
import s from "./ConsentBanner.module.css";

const subscribe = (cb: () => void) => onConsentChange(cb);
/* "unknown" on the server and during hydration, so the bar never flashes for someone who already chose. */
const useChoice = (): Consent | "none" | "unknown" =>
  useSyncExternalStore<Consent | "none" | "unknown">(
    subscribe,
    () => getConsent() ?? "none",
    () => "unknown",
  );

/*
 * A quiet notice at the bottom of the page. It never blocks anything: the site works the same
 * whichever button is pressed. No analytics or marketing tool exists on the site yet, so the choice
 * is recorded for when one does (see src/lib/consent.ts).
 */
export function ConsentBanner() {
  const choice = useChoice();
  const [reopened, setReopened] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const uid = useId();

  useEffect(() => {
    const open = () => {
      const c = getConsent();
      setAnalytics(c?.analytics ?? false);
      setMarketing(c?.marketing ?? false);
      setChoosing(true);
      setReopened(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, open);
  }, []);

  if (choice === "unknown" || (choice !== "none" && !reopened)) return null;

  const decide = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    setReopened(false);
    setChoosing(false);
  };

  return (
    <section className={s.bar} aria-label="Cookie notice">
      <p className={s.body}>
        Nothing that tracks you loads unless you accept.{" "}
        <Link href="/privacy" className="text-link">
          Privacy
        </Link>
      </p>

      {choosing && (
        <div className={s.choose} role="group" aria-label="Choose what to allow">
          <p className={s.always}>Needed to run the site (your checklist ticks, this choice): always on.</p>
          <label className={s.toggle} htmlFor={`${uid}-a`}>
            <input id={`${uid}-a`} type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
            <span>
              <strong>Analytics</strong>
              <span>Counts visits so we can improve the site.</span>
            </span>
          </label>
          <label className={s.toggle} htmlFor={`${uid}-m`}>
            <input id={`${uid}-m`} type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            <span>
              <strong>Marketing</strong>
              <span>Lets us measure our adverts.</span>
            </span>
          </label>
        </div>
      )}

      <div className={s.actions}>
        {choosing ? (
          <button type="button" className="btn btn-dark" onClick={() => decide(analytics, marketing)}>
            Save choices
          </button>
        ) : (
          <>
            <button type="button" className="btn btn-dark" onClick={() => decide(true, true)}>
              Accept
            </button>
            <button type="button" className="btn btn-dark" onClick={() => decide(false, false)}>
              Reject non-essential
            </button>
          </>
        )}
        {!choosing && (
          <button type="button" className={`text-link ${s.chooseBtn}`} onClick={() => setChoosing(true)}>
            Choose
          </button>
        )}
      </div>
    </section>
  );
}

/* A small link for the footer: opens the notice again so the choice can be changed. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={openCookieSettings}>
      Cookie settings
    </button>
  );
}
