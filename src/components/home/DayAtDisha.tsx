"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Pause, Play } from "lucide-react";
import { ButtonLink, Lines, Reveal } from "@/components/ui";

/*
 * A day at a Disha community. Drag the sun across the sky (or use the time line, or arrow keys)
 * and the photograph moves through the day, every one a real Disha community. When the section
 * comes into view the sun rises once from dawn to the hour it is now in Bengaluru, so the
 * interaction shows itself. Reduced motion: no sweep.
 */
type Phase = {
  from: number;
  name: string;
  src: string;
  alt: string;
  caption: string;
  line: string;
  href: string;
  community: string;
  position: string;
  tint: string;
};
const phases: Phase[] = [
  {
    from: 6,
    name: "Morning",
    src: "/images/courtyard/yoga-lawn.jpg",
    alt: "Residents practising yoga on the lawn at Disha Courtyard as a man walks past",
    caption: "Yoga on the lawn",
    line: "Residents begin the day with yoga on the central lawn.",
    href: "/homes/disha-courtyard",
    community: "Disha Courtyard",
    position: "50% 55%",
    tint: "linear-gradient(180deg, rgb(255 190 140 / 0.3), transparent 55%)",
  },
  {
    from: 10,
    name: "Midday",
    src: "/images/pursuit-of-sunshine/pool-aerial.webp",
    alt: "Overhead view of a swimmer in the turquoise pool at Disha Pursuit of Sunshine",
    caption: "The pool",
    line: "Lengths in the pool, with the clubhouse a few steps away.",
    href: "/homes/disha-pursuit-of-sunshine",
    community: "Disha Pursuit of Sunshine",
    position: "50% 50%",
    tint: "linear-gradient(180deg, rgb(180 220 255 / 0.12), transparent 50%)",
  },
  {
    from: 14,
    name: "Afternoon",
    src: "/images/pursuit-of-sunshine/sundial.webp",
    alt: "A large stone sundial set into a circular plaza at Disha Pursuit of Sunshine",
    caption: "The sundial",
    line: "The Vrihat Samrat Yantra, the community’s own sundial, keeps the afternoon’s time.",
    href: "/homes/disha-pursuit-of-sunshine",
    community: "Disha Pursuit of Sunshine",
    position: "50% 55%",
    tint: "linear-gradient(180deg, rgb(255 200 110 / 0.24), transparent 60%)",
  },
  {
    from: 17,
    name: "Dusk",
    src: "/images/pursuit-of-sunshine/treehouse.webp",
    alt: "A wooden treehouse play structure lit warmly at dusk at Disha Pursuit of Sunshine",
    caption: "The treehouse",
    line: "The treehouse lights up for an evening of play.",
    href: "/homes/disha-pursuit-of-sunshine",
    community: "Disha Pursuit of Sunshine",
    position: "50% 50%",
    tint: "linear-gradient(180deg, rgb(120 70 140 / 0.28), transparent 60%)",
  },
  {
    from: 19,
    name: "Night",
    src: "/images/central-park/clubhouse-night.jpg",
    alt: "The Disha Central Park clubhouse and pool lit up after dark",
    caption: "The clubhouse after dark",
    line: "The glass clubhouse glows over the pool long after sunset.",
    href: "/homes/disha-central-park",
    community: "Disha Central Park",
    position: "50% 50%",
    tint: "linear-gradient(180deg, rgb(20 40 90 / 0.4), transparent 60%)",
  },
];
const DAY = { start: 6, end: 18.75, max: 22 };
const phaseIndex = (h: number) => phases.reduce((i, p, n) => (h >= p.from ? n : i), 0);

const clock = (h: number) => {
  const q = Math.round(h * 4) / 4;
  const hh = Math.floor(q);
  const mm = Math.round((q - hh) * 60);
  return new Date(2000, 0, 1, hh, mm).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
};

/* Arc geometry, in the SVG's own units. */
const W = 1000;
const CX = 500;
const CY = 560;
const R = 440;
const sunAt = (h: number) => {
  const p = Math.min(1, Math.max(0, (h - DAY.start) / (DAY.end - DAY.start)));
  const a = Math.PI * (1 - p);
  return { x: CX + R * Math.cos(a), y: CY - R * Math.sin(a), up: h < DAY.end };
};

function bengaluruHour() {
  const parts = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", hourCycle: "h23", timeZone: "Asia/Kolkata" }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 17) + Number(parts.find((p) => p.type === "minute")?.value ?? 0) / 60;
  return h < DAY.start ? DAY.max : Math.min(h, DAY.max);
}

export function DayAtDisha() {
  const [hour, setHourState] = useState(8);
  const [touched, setTouched] = useState(false);
  const [playing, setPlaying] = useState(false);
  const section = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const raf = useRef(0);
  const hourRef = useRef(8);
  const setHour = useCallback((h: number) => {
    hourRef.current = h;
    setHourState(h);
  }, []);

  const phase = phaseIndex(hour);
  const sun = sunAt(hour);
  const ph = phases[phase];
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Glide the sun to an hour. */
  const glide = useCallback((to: number, ms = 1100) => {
    cancelAnimationFrame(raf.current);
    if (reduce()) {
      setHour(to);
      return;
    }
    const from = hourRef.current;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      setHour(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [setHour]);

  /* The sunrise sweep, once, when the section comes into view. */
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        hourRef.current = DAY.start;
        glide(bengaluruHour(), 2800);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [glide]);

  /* Play the whole day, morning to night, in about twelve seconds. */
  useEffect(() => {
    if (!playing) return;
    cancelAnimationFrame(raf.current);
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const next = hourRef.current + dt * 1.35;
      if (next >= DAY.max) {
        setHour(DAY.max);
        setPlaying(false);
        return;
      }
      setHour(next);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, setHour]);

  const takeOver = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setPlaying(false);
    setTouched(true);
  }, []);

  const fromPointer = (e: PointerEvent<SVGSVGElement>) => {
    const m = svg.current?.getScreenCTM();
    if (!m) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    if (pt.y > CY) {
      setHour(pt.x < CX ? DAY.start : DAY.max);
      return;
    }
    const a = Math.atan2(CY - pt.y, pt.x - CX);
    setHour(DAY.start + (1 - Math.min(Math.PI, Math.max(0, a)) / Math.PI) * (DAY.end - DAY.start));
  };

  return (
    <section ref={section} data-tone="dark" aria-labelledby="day-title" className="layer surface-forest grain py-16 md:py-24">
      <div className="shell grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* The photograph and the sky */}
        <div className="lg:col-span-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-forest-deep text-paper shadow-[0_40px_90px_-50px_rgb(0_0_0/0.7)] sm:aspect-[16/10]">
            {phases.map((p, i) => (
              <Image
                key={p.src}
                src={p.src}
                alt={i === phase ? p.alt : ""}
                aria-hidden={i !== phase}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className={`object-cover transition-[opacity,scale] duration-[1200ms] ease-out ${i === phase ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
                style={{ objectPosition: p.position }}
              />
            ))}
            {phases.map((p, i) => (
              <div
                key={p.name}
                aria-hidden
                className={`absolute inset-0 transition-opacity duration-[1200ms] ${i === phase ? "opacity-100" : "opacity-0"}`}
                style={{ background: p.tint }}
              />
            ))}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-forest-deep/25" />

            <div className="absolute inset-x-0 bottom-[5.5rem] top-6 sm:bottom-24" data-cursor="Drag">
              <svg
                ref={svg}
                viewBox={`0 0 ${W} ${CY + 10}`}
                preserveAspectRatio="xMidYMax meet"
                className="block h-full w-full touch-none select-none"
                onPointerDown={(e) => {
                  dragging.current = true;
                  takeOver();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  fromPointer(e);
                }}
                onPointerMove={(e) => dragging.current && fromPointer(e)}
                onPointerUp={() => (dragging.current = false)}
                onPointerCancel={() => (dragging.current = false)}
                aria-hidden
              >
                <defs>
                  <radialGradient id="day-sun-glow">
                    <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.95" />
                    <stop offset="0.35" stopColor="#f5a34a" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#f5a34a" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <path d={`M${CX - R},${CY} A${R},${R} 0 0 1 ${CX + R},${CY}`} fill="none" stroke="rgb(241 235 223 / 0.35)" strokeWidth="1.2" strokeDasharray="2 7" />
                {sun.up && <path d={`M${CX - R},${CY} A${R},${R} 0 0 1 ${sun.x.toFixed(1)},${sun.y.toFixed(1)}`} fill="none" stroke="rgb(241 235 223 / 0.7)" strokeWidth="1.4" />}
                {sun.up ? (
                  <g style={{ cursor: "grab" }}>
                    <circle cx={sun.x} cy={sun.y} r="80" fill="url(#day-sun-glow)" />
                    <circle cx={sun.x} cy={sun.y} r="19" fill="#ffcf8a" />
                    <circle cx={sun.x} cy={sun.y} r="44" fill="transparent" />
                  </g>
                ) : (
                  <g transform={`translate(${CX + R * 0.6} ${CY - R * 0.78})`}>
                    <circle r="18" fill="#e9e4d6" />
                    <circle cx="8" cy="-6" r="16" fill="rgb(8 22 15 / 0.85)" />
                  </g>
                )}
              </svg>
            </div>

            {/* Clock, play and the time line */}
            <div className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
              <div className="card-dark flex items-center gap-3 px-3 py-3 sm:px-4">
                <button
                  type="button"
                  onClick={() => {
                    setTouched(true);
                    if (!playing && hourRef.current >= DAY.max - 0.1) setHour(DAY.start);
                    setPlaying((v) => !v);
                  }}
                  aria-label={playing ? "Pause the day" : "Play the day"}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-transform hover:scale-105"
                >
                  {playing ? <Pause aria-hidden className="size-4" fill="currentColor" /> : <Play aria-hidden className="ml-0.5 size-4" fill="currentColor" />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="tabular-nums">
                      <span className="font-semibold">{clock(hour)}</span>
                      <span className="text-paper/65"> · {ph.name}</span>
                    </span>
                    <span className="truncate text-paper/75">{ph.community}</span>
                  </div>
                  <label className="sr-only" htmlFor="day-hour">
                    Time of day
                  </label>
                  <span
                    className="mt-0.5 block text-paper"
                    style={{ "--fill": `${(((hour - DAY.start) / (DAY.max - DAY.start)) * 100).toFixed(2)}%`, "--thumb": "#ffcf8a" } as CSSProperties}
                  >
                    <input
                      id="day-hour"
                      type="range"
                      min={DAY.start}
                      max={DAY.max}
                      step={0.25}
                      value={hour}
                      onChange={(e) => {
                        takeOver();
                        setHour(Number(e.target.value));
                      }}
                      aria-valuetext={`${clock(hour)}, ${ph.name}: ${ph.caption}, ${ph.community}`}
                      className="range"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Jump to a part of the day */}
          <div role="group" aria-label="Jump to a time of day" className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
            {phases.map((p, i) => (
              <button
                key={p.name}
                type="button"
                aria-pressed={i === phase}
                onClick={() => {
                  takeOver();
                  glide(p.from + (i === phases.length - 1 ? 1 : 1.25));
                }}
                className={`group overflow-hidden rounded-xl border text-left transition-colors ${i === phase ? "border-paper/60 bg-paper/10" : "border-paper/10 hover:border-paper/35"}`}
              >
                <span className="relative block aspect-[16/10]">
                  <Image src={p.src} alt="" fill sizes="(min-width: 1024px) 12vw, 20vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </span>
                <span className="block px-2 py-2 text-xs sm:px-3 sm:text-sm">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Words */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <Reveal as="p" className="eyebrow text-paper/65">
            A better way of living
          </Reveal>
          <Lines id="day-title" className="serif mt-5 text-[clamp(2.3rem,3.8vw,3.6rem)] leading-[1.04]" lines={["Spaces that bring", <em key="e">people closer.</em>]} />
          <p className="mt-6 text-[1.05rem] leading-relaxed text-paper/75">
            Spend a day at a Disha community. Press play, drag the sun or pick a time. Every photograph is from a community we have
            built.
          </p>

          <div key={phase} className="swap-in card-dark mt-8 p-5" aria-live="polite">
            <p className="text-sm text-brass">
              {clock(phases[phase].from)} onwards · {ph.name}
            </p>
            <p className="serif mt-2 text-[1.5rem] leading-tight">{ph.caption}</p>
            <p className="mt-2 text-[0.98rem] leading-relaxed text-paper/75">{ph.line}</p>
            <Link href={ph.href} className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-paper">
              Visit {ph.community}
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/contact#book" variant="paper">
              Book a site visit
            </ButtonLink>
            <button
              type="button"
              onClick={() => {
                takeOver();
                glide(bengaluruHour());
              }}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-paper/30 px-4 text-[0.95rem] font-medium text-paper/90 hover:border-paper/60"
            >
              <Clock aria-hidden className="size-4" /> Now in Bengaluru
            </button>
          </div>
          <p className={`mt-5 text-sm text-paper/55 transition-opacity duration-700 ${touched ? "opacity-0" : "opacity-100"}`}>
            Tip: the sun can be dragged across the sky.
          </p>
        </div>
      </div>
    </section>
  );
}
