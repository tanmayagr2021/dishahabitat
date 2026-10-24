"use client";

import { usePathname } from "next/navigation";
import { type FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { CloseIcon } from "@/components/showroom/Icons";
import { type FeedbackKind, feedbackKinds, LIMITS } from "@/lib/feedback";
import { type Described, describe, deviceKind, keyboardTargets, pick } from "./describe";
import s from "./FeedbackWidget.module.css";

/*
 * Feedback on any page, about any part of it.
 *
 * 1. The Feedback tab (right edge on a computer, bottom left on a phone) starts pointing mode.
 * 2. Whatever is under the pointer is outlined and named ("Our communities › Card: Central Park").
 *    Click or tap it to choose it. Tab and Shift+Tab step through the parts of the page; Enter
 *    chooses; Escape stops. "The whole page" skips pointing.
 * 3. A short form: what kind of note, the note, and (optionally) a name and email to reply to.
 *    It is sent with the page, the part, a selector to find it again, where it sat and the screen
 *    size (src/app/api/feedback/route.ts), so the team can see exactly what was meant.
 *
 * Opening a page with ?fb=<selector>&fbl=<label> (from the review page) outlines that part again.
 */
type Mode = "idle" | "pointing" | "writing" | "sent";
type Box = { top: number; left: number; width: number; height: number; label: string };

const VISITOR_KEY = "disha-visitor";

function visitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

const label = (d: Described) => [d.section, d.target_label].filter(Boolean).join(" › ");

const boxFor = (el: Element, label: string): Box => {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height, label };
};

export function FeedbackWidget() {
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode>("idle");
  const [box, setBox] = useState<Box | null>(null);
  const [chosen, setChosen] = useState<(Described & { whole: boolean }) | null>(null);
  const [kind, setKind] = useState<FeedbackKind | null>(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showing, setShowing] = useState<Box | null>(null);

  const hovered = useRef<Element | null>(null);
  const chosenEl = useRef<Element | null>(null);
  const kbIndex = useRef(-1);
  const tabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();

  const reset = useCallback(() => {
    setMode("idle");
    setBox(null);
    setChosen(null);
    setKind(null);
    setMessage("");
    setError(null);
    setSending(false);
    hovered.current = null;
    chosenEl.current = null;
    kbIndex.current = -1;
  }, []);

  /* Leaving the page closes the tool. */
  const [shownFor, setShownFor] = useState(pathname);
  if (shownFor !== pathname) {
    setShownFor(pathname);
    setMode("idle");
    setBox(null);
    setChosen(null);
    setKind(null);
    setMessage("");
    setError(null);
    setSending(false);
    setShowing(null);
  }
  useEffect(() => {
    hovered.current = null;
    chosenEl.current = null;
    kbIndex.current = -1;
  }, [pathname]);

  const choose = useCallback((el: Element | null, whole = false) => {
    if (whole || !el) {
      chosenEl.current = null;
      setChosen({
        whole: true,
        target_label: "The whole page",
        target_kind: "page",
        selector: "",
        rect: { x: 0, y: 0, width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      });
      setBox(null);
    } else {
      chosenEl.current = el;
      const d = describe(el);
      setChosen({ ...d, whole: false });
      setBox(boxFor(el, label(d)));
    }
    setMode("writing");
  }, []);

  /* ---------- Pointing ---------- */
  useEffect(() => {
    if (mode !== "pointing") return;
    const html = document.documentElement;
    html.dataset.feedbackPointing = "";

    const show = (el: Element | null) => {
      hovered.current = el;
      setBox(el ? boxFor(el, label(describe(el))) : null);
    };
    const at = (x: number, y: number) => pick(document.elementFromPoint(x, y));

    const onMove = (e: PointerEvent) => show(at(e.clientX, e.clientY));
    /* Every click while pointing chooses; nothing on the page reacts to it. */
    const swallow = (e: Event) => {
      const t = e.target as Element | null;
      if (t?.closest("[data-feedback-ui]")) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (t?.closest("[data-feedback-ui]")) return;
      e.preventDefault();
      e.stopPropagation();
      choose(at(e.clientX, e.clientY));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMode("idle");
        setBox(null);
        tabRef.current?.focus();
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const targets = keyboardTargets();
        if (!targets.length) return;
        kbIndex.current = (kbIndex.current + (e.shiftKey ? -1 : 1) + targets.length) % targets.length;
        const el = targets[kbIndex.current]!;
        el.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        show(el);
        return;
      }
      if (e.key === "Enter" && hovered.current) {
        e.preventDefault();
        choose(hovered.current);
      }
    };
    const onScroll = () => {
      if (hovered.current) setBox(boxFor(hovered.current, label(describe(hovered.current))));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", swallow, true);
    window.addEventListener("mousedown", swallow, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      delete html.dataset.feedbackPointing;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", swallow, true);
      window.removeEventListener("mousedown", swallow, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mode, choose]);

  /* ---------- The chosen part stays outlined while writing ---------- */
  useEffect(() => {
    if (mode !== "writing" || !chosenEl.current) return;
    const el = chosenEl.current;
    const follow = () => setBox((b) => (b ? { ...boxFor(el, b.label) } : b));
    window.addEventListener("scroll", follow, { passive: true });
    window.addEventListener("resize", follow);
    return () => {
      window.removeEventListener("scroll", follow);
      window.removeEventListener("resize", follow);
    };
  }, [mode]);

  /* The form takes focus when it opens; Escape closes it and focus returns to the tab. */
  useEffect(() => {
    if (mode !== "writing" && mode !== "sent") return;
    const panel = panelRef.current;
    (mode === "writing" ? messageRef.current : panel?.querySelector<HTMLElement>("[data-autofocus]"))?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        reset();
        tabRef.current?.focus();
      }
      if (e.key !== "Tab" || !panel) return;
      const f = Array.from(panel.querySelectorAll<HTMLElement>("button, input, textarea, a[href]")).filter((x) => !x.hasAttribute("disabled") && x.offsetParent !== null);
      const first = f[0];
      const last = f[f.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode, reset]);

  /* ---------- Opening a reviewer's link outlines the part again ---------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sel = params.get("fb");
    const lbl = params.get("fbl") ?? "Feedback";
    const rect = params.get("fbr")?.split(",").map(Number);
    if (!sel && !rect) return;
    let el: Element | null = null;
    try {
      el = sel ? document.querySelector(sel) : null;
    } catch {
      el = null;
    }
    const place = () => {
      if (el) return setShowing(boxFor(el, lbl));
      if (rect && rect.length === 4) setShowing({ top: rect[1]! - scrollY, left: rect[0]! - scrollX, width: rect[2]!, height: rect[3]!, label: `${lbl} (approximate position)` });
    };
    const target = el;
    const timer = window.setTimeout(() => {
      if (target) target.scrollIntoView({ block: "center" });
      else if (rect && rect.length === 4) scrollTo({ top: Math.max(0, rect[1]! - innerHeight / 3) });
      place();
    }, 400);
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [pathname]);

  /* ---------- Sending ---------- */
  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!chosen) return;
    if (!message.trim()) {
      setError("Please write a few words first.");
      messageRef.current?.focus();
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: kind ?? "other",
          message,
          name: name || undefined,
          email: email || undefined,
          website: trap || undefined,
          page_path: `${location.pathname}${location.search.replace(/[?&](fb|fbl|fbr)=[^&]*/g, "")}`,
          page_title: document.title,
          section: chosen.section,
          target_label: chosen.target_label,
          target_kind: chosen.target_kind,
          target_text: chosen.target_text,
          selector: chosen.selector || undefined,
          whole_page: chosen.whole,
          rect: chosen.rect,
          viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio, scrollY: Math.round(scrollY) },
          device: deviceKind(),
          language: navigator.language,
          visitor_id: visitorId(),
        }),
      });
      const out = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !out.ok) throw new Error(out.error || "We couldn’t send that just now. Please try again.");
      setMode("sent");
      setBox(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn’t send that just now. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (process.env.NEXT_PUBLIC_FEEDBACK === "off") return null;

  const startPointing = () => {
    setError(null);
    setMode("pointing");
  };

  return (
    <div data-feedback-ui="">
      {mode === "idle" && (
        <button ref={tabRef} type="button" className={s.tab} onClick={startPointing} aria-label="Give feedback on this page">
          <svg viewBox="0 0 24 24" aria-hidden="true" className={s.tabIcon}>
            <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M8.5 9h7M8.5 12h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>Feedback</span>
        </button>
      )}

      {(box || showing) && (
        <div className={s.layer} aria-hidden="true">
          {box && (
            <div className={s.box} data-mode={mode} style={{ top: box.top, left: box.left, width: box.width, height: box.height }}>
              <span className={s.boxLabel} data-below={box.top < 40 || undefined}>
                {box.label}
              </span>
            </div>
          )}
          {showing && (
            <div className={s.box} data-mode="showing" style={{ top: showing.top, left: showing.left, width: showing.width, height: showing.height }}>
              <span className={s.boxLabel} data-below={showing.top < 40 || undefined}>
                {showing.label}
              </span>
            </div>
          )}
        </div>
      )}

      {showing && (
        <div className={s.showBar} role="status">
          <span>Feedback was left on the outlined part: {showing.label}</span>
          <button type="button" className="btn btn-white" onClick={() => setShowing(null)}>
            Hide
          </button>
        </div>
      )}

      {mode === "pointing" && (
        <div className={s.bar} role="dialog" aria-label="Choose what your feedback is about" aria-describedby={`${id}-how`}>
          <div className={s.barText}>
            <p className={s.barTitle}>Point at the part you want to comment on</p>
            <p id={`${id}-how`} className={s.barHow}>
              <span className={s.onlyFine}>Click it to choose it.</span>
              <span className={s.onlyCoarse}>Tap it to choose it.</span> Tab steps through the page, Enter chooses, Esc stops.
            </p>
          </div>
          <div className={s.barActions}>
            <button type="button" className="btn btn-white" onClick={() => choose(null, true)}>
              The whole page
            </button>
            <button
              type="button"
              className={s.close}
              onClick={() => {
                setMode("idle");
                setBox(null);
              }}
              aria-label="Stop giving feedback"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}

      {(mode === "writing" || mode === "sent") && (
        <div ref={panelRef} className={s.panel} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}>
          <div className={s.panelHead}>
            <h2 id={`${id}-title`} className={s.panelTitle}>
              {mode === "sent" ? "Thank you" : "Your feedback"}
            </h2>
            <button
              type="button"
              className={s.closeDark}
              onClick={() => {
                reset();
                tabRef.current?.focus();
              }}
              aria-label="Close feedback"
            >
              <CloseIcon />
            </button>
          </div>

          {mode === "sent" ? (
            <div className={s.sent}>
              <p>It’s with the team, with this page and the part you pointed at, so they can see exactly what you mean.</p>
              <div className={s.actions}>
                <button type="button" className="btn btn-dark" data-autofocus onClick={startPointing}>
                  Leave another note
                </button>
                <button type="button" className="btn btn-soft" onClick={reset}>
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form className={s.form} onSubmit={send} noValidate>
              <div className={s.context}>
                <p className={s.contextLabel}>About</p>
                <p className={s.contextValue}>{chosen ? (chosen.whole ? "The whole page" : [chosen.section, chosen.target_label].filter(Boolean).join(" › ")) : ""}</p>
                <button type="button" className={s.change} onClick={startPointing}>
                  Change
                </button>
              </div>

              <fieldset className={s.kinds}>
                <legend className={s.legend}>What kind of note?</legend>
                <div className={s.chips}>
                  {feedbackKinds.map((k) => (
                    <label key={k.id} className={s.chip} data-checked={kind === k.id || undefined} title={k.hint}>
                      <input type="radio" name={`${id}-kind`} value={k.id} checked={kind === k.id} onChange={() => setKind(k.id)} />
                      {k.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className={s.field}>
                <label htmlFor={`${id}-message`} className={s.legend}>
                  What would you like to tell us?
                </label>
                <textarea
                  ref={messageRef}
                  id={`${id}-message`}
                  className={s.control}
                  rows={4}
                  maxLength={LIMITS.message}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-invalid={error && !message.trim() ? true : undefined}
                  aria-describedby={error ? `${id}-error` : undefined}
                  placeholder="For example: this photo is of the wrong building"
                />
              </div>

              <details className={s.more}>
                <summary>Add your name and email so we can reply (optional)</summary>
                <div className={s.moreFields}>
                  <div className={s.field}>
                    <label htmlFor={`${id}-name`} className={s.legend}>
                      Name
                    </label>
                    <input id={`${id}-name`} className={s.control} autoComplete="name" maxLength={LIMITS.name} value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className={s.field}>
                    <label htmlFor={`${id}-email`} className={s.legend}>
                      Email
                    </label>
                    <input id={`${id}-email`} className={s.control} type="email" autoComplete="email" maxLength={LIMITS.email} value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
              </details>

              {/* People never see this field; bots fill it in. */}
              <div className={s.trap} aria-hidden="true">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                </label>
              </div>

              {error && (
                <p id={`${id}-error`} className={s.error} role="alert">
                  {error}
                </p>
              )}

              <p className={s.small}>
                We save your note with this page’s address, the part you chose and your screen size, so the team can see what you
                mean. <a href="/privacy">Privacy</a>
              </p>

              <div className={s.actions}>
                <button type="submit" className="btn btn-dark" disabled={sending}>
                  {sending ? "Sending…" : "Send feedback"}
                </button>
                <button type="button" className="btn btn-soft" onClick={reset}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
