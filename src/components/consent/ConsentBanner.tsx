"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { type Consent, COOKIE_SETTINGS_EVENT, getConsent, onConsentChange, openCookieSettings, saveConsent } from "@/lib/consent";
import s from "./ConsentBanner.module.css";

/* Same condition as the Feedback tab in the layout: the bar then keeps clear of its phone pill. */
const feedbackOn = process.env.NEXT_PUBLIC_FEEDBACK === "on" || process.env.NODE_ENV !== "production";

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
  // Stays mounted for the length of the slide-down after an answer.
  const [leaving, setLeaving] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const uid = useId();
  const bar = useRef<HTMLElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const visible = choice !== "unknown" && (choice === "none" || reopened || leaving);

  useEffect(() => {
    const open = () => {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const c = getConsent();
      setAnalytics(c?.analytics ?? false);
      setMarketing(c?.marketing ?? false);
      setChoosing(true);
      setReopened(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, open);
  }, []);

  /* Someone who already chose never sees the bar, so the space reserved for it is released. */
  useEffect(() => {
    if (choice !== "unknown" && !visible) document.documentElement.classList.remove("consent-pending");
  }, [choice, visible]);

  /* Keyboard users: when the choices open, focus moves to them (the button that was pressed is gone). */
  useEffect(() => {
    if (choosing) bar.current?.querySelector<HTMLElement>("input")?.focus({ preventScroll: true });
  }, [choosing]);

  /*
   * While the bar is up, the page knows its height (--consent-h): every photo panel adds it to its foot,
   * and scrolling to a focused control keeps clear of it. Set before the bar's first paint, so nothing moves.
   */
  useLayoutEffect(() => {
    const el = bar.current;
    if (!visible || !el) return;
    const root = document.documentElement;
    /* Height plus the gap under the bar; unaffected by the slide-in transform. */
    const measure = () => root.style.setProperty("--consent-h", `${Math.ceil(el.offsetHeight + (parseFloat(getComputedStyle(el).bottom) || 0))}px`);
    measure();
    root.classList.remove("consent-pending");
    root.dataset.consentBar = "";
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Its offset from the bottom changes with the screen width too, which the observer does not see.
    addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
      delete root.dataset.consentBar;
      root.style.removeProperty("--consent-h");
      root.classList.remove("consent-pending");
    };
  }, [visible]);

  if (!visible) return null;

  const decide = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    setReopened(false);
    setChoosing(false);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLeaving(true);
      setTimeout(() => setLeaving(false), 300);
    }
    // Reopened from "Cookie settings": put the visitor back where they were.
    if (reopened) requestAnimationFrame(() => opener.current?.focus());
  };

  return (
    <section ref={bar} className={s.bar} aria-label="Cookie notice" data-feedback={feedbackOn || undefined} data-leaving={leaving || undefined}>
      <p className={s.body}>
        No tracking unless you accept.{" "}
        <span className={s.nowrap}>
          <Link href="/privacy" className={s.link}>
            Privacy
          </Link>
          {!choosing && (
            <>
              {" · "}
              <button type="button" className={s.link} onClick={() => setChoosing(true)}>
                Choose
              </button>
            </>
          )}
        </span>
      </p>

      {choosing && (
        <div className={s.choose} role="group" aria-label="Choose what to allow">
          <p className={s.always}>Always on: what the site needs to work, such as your checklist ticks and this choice.</p>
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
              <span>Lets us measure our adverts, if we run any.</span>
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
            <button type="button" className="btn btn-dark" onClick={() => decide(false, false)}>
              Reject
            </button>
            <button type="button" className="btn btn-dark" onClick={() => decide(true, true)}>
              Accept
            </button>
          </>
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
