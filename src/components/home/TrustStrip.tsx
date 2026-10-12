"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui";
import { projects, projectsByHandover } from "@/lib/projects";
import { formatIndian, stats } from "@/lib/site";

/*
 * Proof, straight after the opening: one hero number (homes handed over, summed from each
 * community's published figure) and four supporting figures from dishahabitat.com/the-core.
 * The numbers count up once as they come into view; reduced motion shows them at once.
 */
const homes = projects.reduce((n, p) => n + Number(p.facts.find((f) => f.label === "Homes")?.value ?? 0), 0);
const pick = (label: string) => stats.find((s) => s.label === label)!;
const supporting = [
  { value: 5, suffix: "", label: "communities delivered" },
  { value: pick("Happy families").value, suffix: "+", label: "families at home" },
  { value: pick("Sq ft delivered").value, suffix: "+", label: "sq ft delivered" },
  { value: pick("Sq ft in the making").value, suffix: "+", label: "sq ft in the making" },
];

function useCountUp(target: number, run: boolean, duration = 1600) {
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return n;
}

function Count({ value, suffix, run, className }: { value: number; suffix: string; run: boolean; className: string }) {
  const n = useCountUp(value, run);
  return (
    <span className={className}>
      <span aria-hidden>
        {formatIndian(n)}
        {suffix}
      </span>
      <span className="sr-only">
        {formatIndian(value)}
        {suffix}
      </span>
    </span>
  );
}

export function TrustStrip() {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="trust" data-tone="light" aria-labelledby="trust-title" className="surface-ivory py-20 md:py-28">
      <div className="shell text-center">
        <Reveal as="p" className="text-[0.95rem] text-mute">
          Since 2014, in East Bengaluru
        </Reveal>
        <h2 id="trust-title" className="mt-4">
          <Count value={homes} suffix="" run={run} className="serif block text-[clamp(4.5rem,12vw,10rem)] leading-none tabular-nums" />
          <span className="mt-3 block text-[1.15rem] text-ink/80">homes handed over to the families who live in them</span>
        </h2>

        <dl className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-y-10 border-t border-ink/12 pt-10 md:grid-cols-4">
          {supporting.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className={`flex flex-col-reverse px-4 ${i > 0 ? "md:border-l md:border-ink/12" : ""}`}>
              <dt className="mt-2 text-[0.95rem] text-mute">{s.label}</dt>
              <dd>
                <Count value={s.value} suffix={s.suffix} run={run} className="serif text-[clamp(2rem,3.4vw,3rem)] leading-none tabular-nums" />
              </dd>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={200} className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.95rem] text-ink/70">
          {projectsByHandover.map((p) => (
            <Link key={p.slug} href={`/homes/${p.slug}`} className="inline-flex items-center gap-2 transition-colors hover:text-ink">
              <span aria-hidden className="size-1.5 rounded-full" style={{ background: p.hue }} />
              {p.shortName}
              <span className="text-mute">{p.handoverYear}</span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
