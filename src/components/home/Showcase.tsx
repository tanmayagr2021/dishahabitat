"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { SectionMark, buttonClass, ButtonInner } from "@/components/ui";
import { projects, type Media } from "@/lib/projects";

/* One photograph per community for the stage; chosen so none repeats elsewhere on the homepage. */
const stage: Record<string, string> = {
  "disha-pursuit-of-sunshine": "/images/pursuit-of-sunshine/towers.webp",
  "disha-courtyard": "/images/courtyard/facade-pool.jpg",
  "disha-central-park": "/images/central-park/clubhouse-night.jpg",
  "disha-park-west": "/images/park-west/facade.jpg",
  "disha-windsor-gardens": "/images/windsor-gardens/aerial.jpg",
};

const slides = projects.map((p) => {
  const media = [p.cover, ...p.gallery].find((m) => m.src === stage[p.slug]) as Media;
  const fact = (label: string) => p.facts.find((f) => f.label === label)?.value;
  return { p, media, homes: fact("Homes"), size: fact("Project size") };
});

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Showcase() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchX = useRef<number | null>(null);
  const count = slides.length;
  const go = (i: number) => setActive((i + count) % count);
  const { p, media, homes, size } = slides[active];

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: count - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + count) % count;
    go(next);
    tabs.current[next]?.focus();
  };

  return (
    <section
      data-tone="dark"
      aria-label="Signature homes"
      aria-roledescription="carousel"
      className="relative overflow-hidden bg-ink text-ivory"
    >
      <div className="grid lg:min-h-[100svh] lg:grid-cols-12">
        {/* Stage */}
        <div
          className="grain relative aspect-[4/5] overflow-hidden bg-forest-950 sm:aspect-[16/11] lg:col-span-7 lg:aspect-auto"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
            touchX.current = null;
          }}
        >
          {slides.map((s, i) => (
            <div
              key={s.p.slug}
              aria-hidden={i !== active}
              className={`absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-out-soft ${
                i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
              }`}
            >
              <Image
                src={s.media.src}
                alt={i === active ? s.media.alt : ""}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/30 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink/60" />
          <span
            aria-hidden
            key={`n-${active}`}
            className="display anim-fade pointer-events-none absolute -bottom-6 left-4 text-[9rem] leading-none text-ivory/10 md:text-[15rem] lg:-bottom-10 lg:left-8 lg:text-[20rem]"
          >
            {p.index}
          </span>
          <p className="absolute bottom-4 right-4 max-w-[60%] text-right text-[0.68rem] uppercase tracking-[0.16em] text-ivory/60 lg:bottom-8 lg:right-8">
            {media.caption}
          </p>
        </div>

        {/* Panel */}
        <div className="topo flex flex-col justify-between gap-12 px-5 py-12 [--topo-opacity:0.16] md:px-10 md:py-16 lg:col-span-5 lg:px-12 lg:py-28 xl:px-16">
          <div className="flex items-center justify-between">
            <SectionMark n="02" label="Signature homes" tone="dark" />
            <p className="font-display text-lg italic text-ivory/60" aria-hidden>
              <span className="text-brass-light">{String(active + 1).padStart(2, "0")}</span> /{" "}
              {String(count).padStart(2, "0")}
            </p>
          </div>

          <div
            role="tabpanel"
            id="showcase-panel"
            aria-labelledby={`showcase-tab-${active}`}
            aria-live="polite"
            key={p.slug}
          >
            <p className="eyebrow anim-rise flex items-center gap-2 text-brass-light" style={d(0)}>
              <MapPin aria-hidden className="size-3.5" strokeWidth={1.5} />
              {p.locality}
            </p>
            <h2
              className="display anim-rise mt-5 text-[3rem] leading-[0.9] sm:text-[4rem] xl:text-[5rem]"
              style={d(80)}
            >
              {p.name.replace(/^Disha /, "")}
            </h2>
            <p className="anim-rise mt-6 max-w-md leading-relaxed text-ivory/70" style={d(160)}>
              {p.intro}
            </p>
            <dl className="anim-rise mt-10 grid grid-cols-3 border-y border-ivory/15" style={d(240)}>
              {[
                ["Homes", homes],
                ["Size", size],
                ["Handover", p.timeline.handover],
              ].map(([k, v]) => (
                <div key={k} className="border-l border-ivory/15 py-5 pl-4 first:border-l-0 first:pl-0">
                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ivory/50">{k}</dt>
                  <dd className="display mt-2 text-[1.5rem] leading-tight sm:text-[1.9rem]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <Link href={`/homes/${p.slug}`} className={buttonClass("brass")}>
              <ButtonInner>Explore {p.shortName}</ButtonInner>
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(active - 1)}
                className="inline-flex size-13 items-center justify-center border border-ivory/25 transition-colors hover:border-brass-light hover:bg-brass-light hover:text-ink"
                aria-label="Previous community"
              >
                <ArrowLeft className="size-5" strokeWidth={1.25} />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                className="inline-flex size-13 items-center justify-center border border-ivory/25 transition-colors hover:border-brass-light hover:bg-brass-light hover:text-ink"
                aria-label="Next community"
              >
                <ArrowRight className="size-5" strokeWidth={1.25} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rail */}
      <div className="border-t border-ivory/12 bg-ink">
        <div className="shell">
          <div
            role="tablist"
            aria-label="Choose a community"
            className="-mx-5 flex overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:px-0"
          >
            {slides.map((s, i) => (
              <button
                key={s.p.slug}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`showcase-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls="showcase-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => go(i)}
                onKeyDown={(e) => onTabKey(e, i)}
                className="group relative min-w-[11rem] shrink-0 py-6 pr-6 text-left md:min-w-0"
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-px origin-left bg-brass-light transition-transform duration-700 ease-out-soft ${
                    i === active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  }`}
                />
                <span className="font-display text-sm italic text-brass">{s.p.index}</span>
                <span
                  className={`display mt-1 block text-[1.45rem] leading-tight transition-colors ${
                    i === active ? "text-ivory" : "text-ivory/45 group-hover:text-ivory/80"
                  }`}
                >
                  {s.p.shortName}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
