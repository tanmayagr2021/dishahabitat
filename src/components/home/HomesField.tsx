"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { RotateCcw } from "lucide-react";
import { Label } from "@/components/ui";
import { projectsByHandover } from "@/lib/projects";
import { formatIndian, stats } from "@/lib/site";

/*
 * Every home Disha Habitat has built, drawn as one dot. When the section comes into view the
 * years play forward once and each community lights up in its own colour, in order of handover.
 * Homes per community are the published figures in lib/projects.ts.
 */
const groups = projectsByHandover.map((p) => ({
  slug: p.slug,
  name: p.shortName,
  hue: p.hue,
  year: p.handoverYear,
  homes: Number(p.facts.find((f) => f.label === "Homes")?.value ?? 0),
}));
const total = groups.reduce((n, g) => n + g.homes, 0);

export function HomesField() {
  const ref = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(groups.length);
  const [focus, setFocus] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Plays the years forward, one community at a time. */
  const play = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setStage(groups.length);
    setStage(0);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setStage(n);
      if (n >= groups.length && timer.current) clearInterval(timer.current);
    }, 900);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        play();
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer.current) clearInterval(timer.current);
    };
  }, [play]);

  const lit = groups.slice(0, stage);
  const homesLit = lit.reduce((n, g) => n + g.homes, 0);
  const current = focus ? groups.find((g) => g.slug === focus)! : stage > 0 ? groups[stage - 1] : null;
  const year = current ? current.year : 2014;

  return (
    <section
      ref={ref}
      data-tone="dark"
      aria-labelledby="field-title"
      className="relative bg-ink text-paper"
    >
      <div className="py-24 md:py-32">
        <div className="shell grid w-full gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Narrative column */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-4 lg:gap-8">
            <div>
              <Label n="04" className="text-paper/60">
                Every dot is a home
              </Label>
              <h2 id="field-title" className="sr-only">
                {formatIndian(total)} homes across five communities, built between 2014 and {groups.at(-1)?.year}
              </h2>
              <div aria-hidden className="mt-5 flex items-end gap-5 lg:mt-6 lg:block">
                <p className="serif text-[clamp(4rem,9vw,8.5rem)] leading-[0.85] tabular-nums">{year}</p>
                <p className="min-h-[2.6em] max-w-xs pb-1 text-[0.95rem] leading-snug text-paper/70 lg:mt-4 lg:min-h-[3.2em] lg:pb-0 lg:text-[1.05rem]">
                  {current ? (
                    <>
                      <span className="text-paper">{current.name}</span> — {current.homes} homes handed over.
                    </>
                  ) : (
                    <>Ground is broken at Windsor Gardens, on Panathur–Varthur Road.</>
                  )}
                </p>
              </div>
            </div>

            <ul className="flex flex-col gap-1.5" aria-label="Highlight a community">
              {groups.map((g, i) => {
                const on = focus === g.slug;
                return (
                  <li key={g.slug}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setStage(groups.length);
                        setFocus(on ? null : g.slug);
                      }}
                      onMouseEnter={() => stage >= groups.length && setFocus(g.slug)}
                      onMouseLeave={() => setFocus(null)}
                      className={`flex w-full items-center justify-between gap-4 rounded-full border px-4 py-2.5 text-left text-[0.95rem] transition-[opacity,background-color,border-color,color] duration-500 ${
                        i < stage ? "opacity-100" : "opacity-35"
                      } ${on ? "border-transparent text-ink" : "border-paper/15 hover:border-paper/40"}`}
                      style={on ? { background: g.hue } : undefined}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="size-2.5 rounded-full" style={{ background: on ? "var(--color-ink)" : g.hue }} />
                        {g.name}
                      </span>
                      <span className="tabular-nums opacity-70">
                        {g.homes} homes · {g.year}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* The field */}
          <div className="lg:col-span-8 lg:pl-6">
            <div
              aria-hidden
              className="grid gap-[3px] [grid-template-columns:repeat(34,minmax(0,1fr))] sm:gap-1 md:[grid-template-columns:repeat(38,minmax(0,1fr))] xl:[grid-template-columns:repeat(46,minmax(0,1fr))]"
            >
              {groups.map((g, gi) => {
                const on = gi < stage;
                const dim = focus !== null && focus !== g.slug;
                return Array.from({ length: g.homes }, (_, k) => (
                  <span
                    key={`${g.slug}-${k}`}
                    className="aspect-square rounded-full transition-[background-color,transform,opacity] duration-500 ease-out"
                    style={
                      {
                        background: on ? g.hue : "rgb(243 241 236 / 0.1)",
                        opacity: dim ? 0.18 : 1,
                        transform: on ? (focus === g.slug ? "scale(1.15)" : "scale(1)") : "scale(0.6)",
                        transitionDelay: on && !focus ? `${Math.round((k / g.homes) * 500)}ms` : "0ms",
                      } as CSSProperties
                    }
                  />
                ));
              })}
            </div>

            <div className="mt-6 flex items-baseline justify-between gap-6 border-t border-paper/15 pt-4 md:mt-8 md:pt-5">
              <div className="flex items-center gap-4">
                <p className="label text-paper/60">Homes handed over</p>
                <button
                  type="button"
                  onClick={play}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-paper/20 px-3 text-xs text-paper/80 hover:bg-paper/10"
                >
                  <RotateCcw aria-hidden className="size-3" strokeWidth={1.8} />
                  Replay
                </button>
              </div>
              <p aria-hidden className="serif text-[1.8rem] leading-none tabular-nums md:text-[2.4rem]">
                {formatIndian(homesLit)}
                <span className="text-paper/35"> / {formatIndian(total)}</span>
              </p>
            </div>

            <dl className="mt-8 hidden grid-cols-3 gap-4 md:grid">
              {stats.slice(1, 5).filter((s) => s.label !== "Walk-ins").map((s) => (
                <div key={s.label}>
                  <dt className="label text-paper/55">{s.label}</dt>
                  <dd className="serif mt-2 text-[1.5rem] leading-none sm:text-[2rem]">
                    {formatIndian(s.value)}
                    {s.suffix}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
