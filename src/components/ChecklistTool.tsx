"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ArrowUpRight, Check, ChevronDown, MessageCircle, Printer, RotateCcw, Share2 } from "lucide-react";
import type { ChecklistItem } from "@/lib/checklist";
import { openComposer } from "@/lib/messaging";

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
  } catch {}
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function ChecklistTool({ items }: { items: ChecklistItem[] }) {
  const uid = useId();
  const raw = useSyncExternalStore(subscribe, read, () => "{}");
  const state: State = (() => {
    try {
      const v = JSON.parse(raw);
      return v && typeof v === "object" ? v : {};
    } catch {
      return {};
    }
  })();
  const [open, setOpen] = useState<string | null>(items[0].slug);

  const done = (slug: string) => Boolean(state[slug]);
  const count = items.filter((c) => done(c.slug)).length;
  const pct = Math.round((count / items.length) * 100);
  const complete = count === items.length;

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

  const ring = 2 * Math.PI * 26;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* Progress and actions */}
      <div className="min-w-0 lg:col-span-4 print:hidden">
        <div className="lg:sticky lg:top-28">
          <div className="rounded-2xl bg-forest p-6 text-paper md:p-7">
            <div className="flex items-center gap-5">
              <svg viewBox="0 0 60 60" className="size-20 shrink-0 -rotate-90" aria-hidden>
                <circle cx="30" cy="30" r="26" fill="none" stroke="rgb(241 235 223 / 0.15)" strokeWidth="5" />
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="var(--color-brass)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${(ring * pct) / 100} ${ring}`}
                  className="transition-[stroke-dasharray] duration-700 ease-out-expo"
                />
              </svg>
              <div aria-live="polite">
                <p className="serif text-[2.4rem] leading-none tabular-nums">
                  {count}
                  <span className="text-paper/40">/{items.length}</span>
                </p>
                <p className="mt-1 text-sm text-paper/70">{complete ? "All checked. You’re ready." : "must-knows checked"}</p>
              </div>
            </div>
            <ol className="mt-6 flex gap-1.5" aria-hidden>
              {items.map((c) => (
                <li key={c.slug} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${done(c.slug) ? "bg-brass" : "bg-paper/15"}`} />
              ))}
            </ol>
            {complete ? (
              <div className="mt-6">
                <p className="text-[0.98rem] text-paper/80">Now see a Disha home with these questions in hand.</p>
                <Link href="/contact#book" className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-paper font-semibold text-ink hover:bg-white">
                  Book a site visit
                </Link>
              </div>
            ) : (
              <p className="mt-6 text-sm leading-relaxed text-paper/65">Open each one, read it, and tick the points as you understand them. Your progress stays in this browser.</p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(summary)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-2 px-3 py-3 text-sm font-medium hover:border-ink/25"
            >
              <Share2 aria-hidden className="size-4 text-[#1f8f4e]" /> Send to myself
              <span className="sr-only">on WhatsApp (opens in a new tab)</span>
            </a>
            <button type="button" onClick={() => window.print()} className="card flex items-center gap-2 px-3 py-3 text-left text-sm font-medium hover:border-ink/25">
              <Printer aria-hidden className="size-4" /> Print or save PDF
            </button>
            <button
              type="button"
              onClick={() => openComposer({ channel: "whatsapp", topic: "Something else" })}
              className="card flex items-center gap-2 px-3 py-3 text-left text-sm font-medium hover:border-ink/25"
            >
              <MessageCircle aria-hidden className="size-4" /> Ask Disha
            </button>
            <button type="button" onClick={() => write({})} disabled={raw === "{}"} className="card flex items-center gap-2 px-3 py-3 text-left text-sm font-medium hover:border-ink/25 disabled:opacity-40">
              <RotateCcw aria-hidden className="size-4" /> Start over
            </button>
          </div>
        </div>
      </div>

      {/* The list */}
      <ol className="min-w-0 space-y-3 lg:col-span-8">
        {items.map((c, i) => {
          const isOpen = open === c.slug;
          const d = done(c.slug);
          const panel = `${uid}-${c.slug}`;
          return (
            <li
              key={c.slug}
              className={`overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow] duration-300 ${
                d ? "border-forest/30 bg-[#eef0e6]" : "border-ink/10 bg-white/60"
              } ${isOpen ? "shadow-[0_30px_60px_-40px_rgb(21_26_23/0.45)]" : ""}`}
              style={{ "--i": i } as CSSProperties}
            >
              <div className="flex items-center gap-4 p-4 md:p-5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={d}
                  aria-label={`${c.title}: ${d ? "checked" : "not checked"}`}
                  onClick={() => toggle(c.slug)}
                  className={`relative inline-flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-[background-color,border-color,transform] duration-300 active:scale-90 ${
                    d ? "border-forest bg-forest text-paper" : "border-ink/25 hover:border-forest"
                  }`}
                >
                  <Check aria-hidden className={`size-4 transition-[opacity,transform] duration-300 ${d ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} strokeWidth={3} />
                </button>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => setOpen(isOpen ? null : c.slug)}
                  className="flex min-w-0 flex-1 items-center gap-4 text-left"
                >
                  <span className="relative hidden aspect-square w-14 shrink-0 overflow-hidden rounded-xl sm:block">
                    <Image src={c.image} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-xs tabular-nums text-mute">Must-know {i + 1}</span>
                    <span className={`serif block text-[1.45rem] leading-tight md:text-[1.65rem] ${d ? "text-ink/70 line-through decoration-forest/40" : ""}`}>{c.title}</span>
                    <span className="block truncate text-sm text-mute">{c.summary}</span>
                  </span>
                  <ChevronDown aria-hidden className={`size-5 shrink-0 text-mute transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              <div id={panel} className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} print:grid-rows-[1fr]`} inert={!isOpen}>
                <div className="overflow-hidden">
                  <div className="grid gap-6 border-t border-ink/10 p-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:p-6">
                    <div className="space-y-3 text-[1rem] leading-relaxed text-ink/80">
                      {c.body.map((t) => (
                        <p key={t}>{t}</p>
                      ))}
                      <Link href={`/checklist/${c.slug}`} className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-forest print:hidden">
                        Read the full guide <ArrowUpRight aria-hidden className="size-4" />
                      </Link>
                    </div>
                    {c.checks && (
                      <div className="rounded-xl border border-ink/10 bg-paper p-4">
                        <p className="text-sm font-semibold">Before you buy, check</p>
                        <ul className="mt-3 space-y-2">
                          {c.checks.map((q, k) => {
                            const on = Boolean(state[`${c.slug}:${k}`]);
                            return (
                              <li key={q}>
                                <label className="flex cursor-pointer gap-3 rounded-lg p-1.5 text-[0.95rem] leading-snug hover:bg-ink/5">
                                  <input
                                    type="checkbox"
                                    checked={on}
                                    onChange={() => toggleCheck(c.slug, k, c.checks!.length)}
                                    className="mt-0.5 size-[1.1rem] shrink-0 accent-[var(--color-forest)]"
                                  />
                                  <span className={on ? "text-mute line-through decoration-ink/30" : ""}>{q}</span>
                                </label>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 px-5 pb-5 md:px-6 print:hidden">
                    {!d && (
                      <button
                        type="button"
                        onClick={() => {
                          toggle(c.slug);
                          const nextItem = items.find((x, k) => k > i && !done(x.slug));
                          setOpen(nextItem?.slug ?? null);
                        }}
                        className="inline-flex h-11 items-center gap-2 rounded-lg bg-forest px-5 text-sm font-semibold text-paper hover:bg-forest-2"
                      >
                        <Check aria-hidden className="size-4" /> Got it, next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
