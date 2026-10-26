"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ComposeButton } from "@/components/ComposeButton";
import { links } from "@/lib/content";
import type { ChecklistItem } from "@/lib/checklist";
import s from "./ChecklistTool.module.css";

/*
 * The homebuyer's checklist as a tool. Each must-know can be opened, read and ticked; the points
 * under it can be ticked one by one. Progress is kept in this browser only (localStorage), so a
 * visitor can come back to it; nothing is sent anywhere.
 */
const KEY = "disha-checklist-v1";
type State = Record<string, boolean>;

/* A tiny store over localStorage, safe on the server and in private windows. */
const listeners = new Set<() => void>();
let cache: string | null = null;
let saves = true; // false once the browser refuses to store (some private windows, full storage)
const read = () => {
  if (cache !== null) return cache;
  try {
    cache = localStorage.getItem(KEY) ?? "{}";
  } catch {
    cache = "{}";
  }
  return cache;
};
const write = (next: State) => {
  cache = JSON.stringify(next);
  try {
    localStorage.setItem(KEY, cache);
    saves = true;
  } catch {
    saves = false;
  }
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/* The round tick: a brass check that draws itself when the box is ticked (the style is in the css). */
function Tick() {
  return (
    <span aria-hidden className={s.box}>
      <svg viewBox="0 0 24 24" fill="none">
        <path pathLength="1" d="M7 12.6l3.4 3.4L17 8.6" />
      </svg>
    </span>
  );
}

export function ChecklistTool({ items }: { items: ChecklistItem[] }) {
  const raw = useSyncExternalStore(subscribe, read, () => "{}");
  const state: State = (() => {
    try {
      const v = JSON.parse(raw);
      return v && typeof v === "object" ? v : {};
    } catch {
      return {};
    }
  })();
  const [cleared, setCleared] = useState<State | null>(null);
  useEffect(() => {
    if (!cleared) return;
    const t = window.setTimeout(() => setCleared(null), 10000);
    return () => window.clearTimeout(t);
  }, [cleared]);

  const done = (slug: string) => Boolean(state[slug]);
  const count = items.filter((c) => done(c.slug)).length;
  const complete = count === items.length;
  const points = items.reduce((n, c) => n + (c.checks?.length ?? 0), 0);
  const pointsDone = items.reduce((n, c) => n + (c.checks ?? []).filter((_, k) => state[`${c.slug}:${k}`]).length, 0);

  const toggle = (k: string) => write({ ...state, [k]: !state[k] });
  const toggleCheck = (slug: string, i: number, total: number) => {
    const key = `${slug}:${i}`;
    const next = { ...state, [key]: !state[key] };
    // Ticking every point under a must-know ticks the must-know itself.
    const all = Array.from({ length: total }, (_, k) => next[`${slug}:${k}`]).every(Boolean);
    if (all) next[slug] = true;
    write(next);
  };

  const summary = [
    "My homebuyer’s checklist (from Disha Habitat):",
    "",
    ...items.flatMap((c) => [`${done(c.slug) ? "✅" : "⬜"} ${c.title}`, ...(c.checks ?? []).map((q) => `   • ${q}`)]),
    "",
    "Read more: https://www.dishahabitat.com/checklist",
  ].join("\n");

  return (
    <div>
      <div className={s.progress}>
        <p className={s.count} aria-live="polite">
          <strong>{count}</strong> of {items.length} must-knows understood
          {complete && <span className="sr-only">{" You’re ready to visit."}</span>}
        </p>
        {points > 0 && (
          <p className={s.points}>
            {pointsDone} of {points} points ticked. Tick a must-know when you have read its guide; ticking all its points does it for you.
          </p>
        )}
        <div className={s.bar} role="progressbar" aria-label="Checklist progress" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={count}>
          <span style={{ transform: `scaleX(${count / items.length})` }} />
        </div>
        <div className={s.ready} data-show={complete || undefined} inert={!complete}>
          <div className={s.readyInner}>
            <p>You’re ready to visit.</p>
            <Link href={links.bookVisit} className="btn btn-primary">
              Book a visit
            </Link>
          </div>
        </div>
        <div className={s.actions}>
          <a href={`https://wa.me/?text=${encodeURIComponent(summary)}`} target="_blank" rel="noopener noreferrer" className="btn btn-soft">
            Send to myself<span className="sr-only"> on WhatsApp (opens in a new tab)</span>
          </a>
          <button type="button" onClick={() => window.print()} className="btn btn-outline">
            Print or save PDF
          </button>
          <ComposeButton channel="whatsapp" topic="Something else" className="btn btn-soft">
            Ask Disha
          </ComposeButton>
          <button
            type="button"
            onClick={() => {
              setCleared(state);
              write({});
            }}
            disabled={raw === "{}"}
            className="text-link"
          >
            Start over
          </button>
        </div>
        <div aria-live="polite" className={s.notes}>
          {cleared && (
            <p>
              Your ticks are cleared.{" "}
              <button
                type="button"
                onClick={() => {
                  write(cleared);
                  setCleared(null);
                }}
                className="text-link"
              >
                Undo
              </button>
            </p>
          )}
          {!saves && <p>This browser isn’t saving your ticks (a private window can do this). Use “Send to myself” to keep a copy.</p>}
        </div>
      </div>

      <ol className={s.list}>
        {items.map((c, i) => {
          const d = done(c.slug);
          return (
            <li key={c.slug} className={s.item} data-done={d || undefined}>
              <div className={s.head}>
                <label className={s.tick}>
                  <input type="checkbox" checked={d} onChange={() => toggle(c.slug)} />
                  <span className="sr-only">{c.title} understood</span>
                  <Tick />
                </label>
                <div className={s.title}>
                  <p className={s.step}>Must-know {i + 1}</p>
                  <h2>
                    <Link href={`/checklist/${c.slug}`}>{c.title}</Link>
                  </h2>
                  <p className={s.summary}>{c.summary}</p>
                </div>
              </div>
              {c.checks && (
                <fieldset className={s.checks}>
                  <legend>Before you buy, check</legend>
                  {c.checks.map((q, k) => (
                    <label key={q} className={s.check}>
                      <input type="checkbox" checked={Boolean(state[`${c.slug}:${k}`])} onChange={() => toggleCheck(c.slug, k, c.checks!.length)} />
                      <Tick />
                      <span>{q}</span>
                    </label>
                  ))}
                </fieldset>
              )}
              <Link href={`/checklist/${c.slug}`} className={`text-link ${s.more}`}>
                Read the guide<span className="sr-only">: {c.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className={s.printNote}>From the homebuyer’s checklist at dishahabitat.com/checklist. Ticked points are marked.</p>
    </div>
  );
}
