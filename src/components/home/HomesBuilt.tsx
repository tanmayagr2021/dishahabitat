"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { RotateCcw } from "lucide-react";
import { projectsByHandover } from "@/lib/projects";
import { formatIndian } from "@/lib/site";

/*
 * Every home Disha has handed over, drawn as a small house. When the block comes into view the
 * years play forward and each community's homes fill with its colour, in order of handover. The
 * timeline beside it shows how long each one took to build (published start-to-completion months).
 * Choose a community to light only its homes.
 */
const groups = projectsByHandover.map((p) => ({
  slug: p.slug,
  name: p.shortName,
  hue: p.hue,
  year: p.handoverYear,
  months: p.timeline.months,
  homes: Number(p.facts.find((f) => f.label === "Homes")?.value ?? 0),
}));
const total = groups.reduce((n, g) => n + g.homes, 0);
const longest = Math.max(...groups.map((g) => g.months));
const STAGE_MS = 850;

export function HomesBuilt() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [focus, setFocus] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const play = () => {
    if (timer.current) clearInterval(timer.current);
    setFocus(null);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setStage(groups.length);
    setStage(0);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setStage(n);
      if (n >= groups.length && timer.current) clearInterval(timer.current);
    }, STAGE_MS);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        play();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const lit = groups.slice(0, stage).reduce((n, g) => n + g.homes, 0);
  const current = focus ? groups.find((g) => g.slug === focus)! : stage > 0 ? groups[stage - 1] : null;

  return (
    <div ref={ref} className="surface-forest grain mt-8 grid gap-8 overflow-hidden rounded-[1.75rem] p-6 md:mt-10 md:p-9 lg:grid-cols-12 lg:gap-10">
      {/* Timeline */}
      <div className="lg:col-span-4">
        <h3 className="serif text-[1.6rem] leading-tight">Timelines in the open</h3>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-paper/75">
          Construction start, completion and handover are published for every community we have built. Choose one to see its homes.
        </p>
        <ul className="mt-6 space-y-1" aria-label="Months from construction start to completion">
          {groups.map((g, i) => {
            const on = i < stage;
            const picked = focus === g.slug;
            return (
              <li key={g.slug}>
                <button
                  type="button"
                  aria-pressed={picked}
                  onClick={() => {
                    setStage(groups.length);
                    setFocus(picked ? null : g.slug);
                  }}
                  className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${picked ? "bg-paper/10" : "hover:bg-paper/[0.05]"}`}
                >
                  <span className="flex justify-between text-sm">
                    <span className={on ? "text-paper" : "text-paper/65"}>
                      {g.name} <span className="text-paper/65">· {g.year}</span>
                    </span>
                    <span className="tabular-nums text-paper/80">{on ? `${g.months} months` : ""}</span>
                  </span>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-paper/10">
                    <span
                      className="block h-full rounded-full transition-[width] duration-[900ms] ease-out-expo"
                      style={{ width: on ? `${(g.months / longest) * 100}%` : "0%", background: g.hue }}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Homes */}
      <div className="lg:col-span-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="text-[0.98rem] text-paper/75">
            Every block is a home we have handed over.
            <span className="mt-1 block min-h-[1.5em] text-sm text-paper/55" aria-live="polite">
              {current ? `${current.name}: ${current.homes} homes, ${current.year}` : "2014: ground is broken at Windsor Gardens"}
            </span>
          </p>
          <div className="flex items-center gap-4">
            <p className="serif text-[2.2rem] leading-none tabular-nums">
              {formatIndian(focus ? current!.homes : lit)}
              <span className="text-paper/60"> / {formatIndian(total)}</span>
            </p>
            <button
              type="button"
              onClick={play}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-paper/20 px-3 text-xs text-paper/80 hover:border-paper/50"
            >
              <RotateCcw aria-hidden className="size-3" /> Replay
            </button>
          </div>
        </div>
        <div
          aria-hidden
          className="mt-5 grid gap-[3px] [grid-template-columns:repeat(29,minmax(0,1fr))] sm:[grid-template-columns:repeat(38,minmax(0,1fr))] lg:[grid-template-columns:repeat(46,minmax(0,1fr))]"
        >
          {groups.map((g, gi) => {
            const on = gi < stage;
            const dim = focus !== null && focus !== g.slug;
            return Array.from({ length: g.homes }, (_, k) => (
              <span
                key={`${g.slug}-${k}`}
                className="house aspect-[5/6] transition-[background-color,opacity,transform] duration-500 ease-out"
                style={
                  {
                    background: on ? g.hue : "rgb(241 235 223 / 0.12)",
                    opacity: dim ? 0.15 : 1,
                    transform: on ? "none" : "scale(0.8)",
                    transitionDelay: on && !focus ? `${Math.round((k / g.homes) * 600)}ms` : "0ms",
                  } as CSSProperties
                }
              />
            ));
          })}
        </div>
        <p className="sr-only">
          {formatIndian(total)} homes handed over across five communities:{" "}
          {groups.map((g) => `${g.name}, ${g.homes} homes in ${g.year}, built in ${g.months} months`).join("; ")}.
        </p>
      </div>
    </div>
  );
}
