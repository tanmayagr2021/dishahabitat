"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Building2, HeartHandshake, Home, Ruler } from "lucide-react";
import { ArrowLink, Lines, Reveal } from "@/components/ui";
import { projects } from "@/lib/projects";
import { formatIndian, poem, stats } from "@/lib/site";

/*
 * Our approach, after the reference layout: a short statement on the left, a layered collage of
 * real community photographs in the middle (with a hand-written card quoting the company's own
 * poem), and the record on the right. Every figure is published (lib/site.ts, lib/projects.ts).
 */
const homes = projects.reduce((n, p) => n + Number(p.facts.find((f) => f.label === "Homes")?.value ?? 0), 0);
const sqft = stats.find((s) => s.label === "Sq ft delivered")!.value;
const families = stats.find((s) => s.label === "Happy families")!.value;

const record = [
  { Icon: Home, value: homes, suffix: "", label: "Homes handed over", note: "Across five communities in East Bengaluru" },
  { Icon: Building2, value: 5, suffix: "", label: "Communities delivered", note: "From Windsor Gardens (2015) to Pursuit of Sunshine (2025)" },
  { Icon: HeartHandshake, value: families, suffix: "+", label: "Families at home", note: "And a sixth community rising in Gunjur" },
  { Icon: Ruler, value: sqft, suffix: "+", label: "Sq ft delivered", note: "With 32,00,000+ sq ft in the making" },
];

function Count({ to, suffix, run }: { to: number; suffix: string; run: boolean }) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!run || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1600);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return (
    <>
      <span aria-hidden>
        {formatIndian(n)}
        {suffix}
      </span>
      <span className="sr-only">
        {formatIndian(to)}
        {suffix}
      </span>
    </>
  );
}

export function Approach() {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setRun(true), io.disconnect()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="approach" data-tone="light" aria-labelledby="approach-title" className="surface-ivory overflow-hidden py-24 md:py-32">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Statement */}
        <div className="lg:col-span-4">
          <Reveal as="p" className="eyebrow text-mute">
            Our approach
          </Reveal>
          <Lines id="approach-title" className="serif mt-5 text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.04]" lines={["Homes, planned by", <em key="e">homebuyers.</em>]} />
          <Reveal delay={150}>
            <p className="mt-6 max-w-sm text-[1.05rem] leading-relaxed text-ink/75">
              We began exactly where you are right now: looking for a house that would become a home. Homebuyers first, then
              investors, then builders. Every Disha home since 2014 has been planned by people who remember what it was like to
              be looking.
            </p>
            <ArrowLink href="/story" className="mt-6 text-ink">
              Discover our story
            </ArrowLink>
          </Reveal>
        </div>

        {/* Collage */}
        <div className="relative mx-auto h-[30rem] w-full max-w-md sm:h-[34rem] lg:col-span-4">
          <div className="depth-slow absolute left-0 top-10 w-[38%]">
            <Reveal variant="mask">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image src="/images/courtyard/giant-chess.jpg" alt="A young boy among giant chess pieces at Disha Courtyard" fill sizes="180px" className="object-cover" />
              </div>
            </Reveal>
          </div>
          <div className="absolute inset-x-[16%] top-0 z-10 rounded-2xl bg-paper p-2.5 shadow-[0_40px_80px_-40px_rgb(21_26_23/0.5)]">
            <Reveal variant="mask">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image
                  src="/images/central-park/staircase.jpg"
                  alt="An open white staircase rising beside a reflecting pool at Disha Central Park"
                  fill
                  sizes="(min-width: 1024px) 22vw, 70vw"
                  className="object-cover object-[32%_50%]"
                />
              </div>
            </Reveal>
          </div>
          <div className="depth-fast absolute bottom-6 right-0 z-20 w-[36%]">
            <Reveal variant="mask" delay={200}>
              <div className="relative aspect-square overflow-hidden rounded-xl border-4 border-paper">
                <Image src="/images/community/gardening.jpg" alt="Children planting seedlings in a Disha community garden" fill sizes="170px" className="object-cover" />
              </div>
            </Reveal>
          </div>
          <Reveal
            delay={350}
            className="absolute -bottom-2 left-[8%] z-20 w-[52%] -rotate-3 rounded-lg bg-[#f7f1e4] px-5 py-4 shadow-[0_20px_40px_-20px_rgb(21_26_23/0.45)]"
          >
            <p className="font-[family-name:var(--font-caveat)] text-[1.45rem] leading-[1.15] text-ink/85">{poem.closing}</p>
            <p className="mt-1 text-[0.72rem] text-mute">From the Disha Habitat poem</p>
          </Reveal>
        </div>

        {/* The record */}
        <ul className="divide-y divide-ink/10 lg:col-span-4">
          {record.map(({ Icon, value, suffix, label, note }, i) => (
            <Reveal as="li" key={label} delay={i * 90} className="flex gap-4 py-5 first:pt-0 last:pb-0">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/12 bg-white/50 text-forest">
                <Icon aria-hidden className="size-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="serif text-[2rem] leading-none tabular-nums">
                  <Count to={value} suffix={suffix} run={run} />
                </p>
                <p className="mt-1.5 font-medium text-ink">{label}</p>
                <p className="mt-0.5 text-sm text-mute">{note}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
