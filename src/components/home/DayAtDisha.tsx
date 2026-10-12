"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { SectionHead } from "@/components/ui";

/*
 * A day at a Disha community. Drag the sun across the sky (or use the time line, or arrow keys)
 * and the photograph moves through the day — every one a real Disha community. When the section
 * comes into view the sun rises once from dawn to the hour it is now in Bengaluru, so the
 * interaction shows itself. Reduced motion: no sweep.
 */
type Phase = { from: number; name: string; src: string; alt: string; caption: string; position: string; tint: string };
const phases: Phase[] = [
  {
    from: 6,
    name: "Morning",
    src: "/images/courtyard/yoga-lawn.jpg",
    alt: "Residents practising yoga on the lawn at Disha Courtyard as a man walks past",
    caption: "Yoga on the lawn · Disha Courtyard",
    position: "50% 55%",
    tint: "linear-gradient(180deg, rgb(255 190 140 / 0.3), transparent 55%)",
  },
  {
    from: 10,
    name: "Midday",
    src: "/images/pursuit-of-sunshine/pool-aerial.webp",
    alt: "Overhead view of a swimmer in the turquoise pool at Disha Pursuit of Sunshine",
    caption: "The pool · Disha Pursuit of Sunshine",
    position: "50% 50%",
    tint: "linear-gradient(180deg, rgb(180 220 255 / 0.12), transparent 50%)",
  },
  {
    from: 14,
    name: "Afternoon",
    src: "/images/pursuit-of-sunshine/sundial.webp",
    alt: "A large stone sundial set into a circular plaza at Disha Pursuit of Sunshine",
    caption: "The sundial · Disha Pursuit of Sunshine",
    position: "50% 55%",
    tint: "linear-gradient(180deg, rgb(255 200 110 / 0.24), transparent 60%)",
  },
  {
    from: 17,
    name: "Dusk",
    src: "/images/pursuit-of-sunshine/treehouse.webp",
    alt: "A wooden treehouse play structure lit warmly at dusk at Disha Pursuit of Sunshine",
    caption: "The treehouse at dusk · Disha Pursuit of Sunshine",
    position: "50% 50%",
    tint: "linear-gradient(180deg, rgb(120 70 140 / 0.28), transparent 60%)",
  },
  {
    from: 19,
    name: "Night",
    src: "/images/central-park/clubhouse-night.jpg",
    alt: "The Disha Central Park clubhouse and pool lit up after dark",
    caption: "After dark · Disha Central Park",
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
  const [hour, setHour] = useState(8);
  const [touched, setTouched] = useState(false);
  const section = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const raf = useRef(0);

  const phase = phaseIndex(hour);
  const sun = sunAt(hour);

  /* The sunrise sweep, once, when the section comes into view. */
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const target = bengaluruHour();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          raf.current = requestAnimationFrame(() => setHour(target));
          return;
        }
        const t0 = performance.now() + 300;
        const from = DAY.start;
        const step = (now: number) => {
          const k = Math.min(1, Math.max(0, (now - t0) / 2800));
          setHour(from + (target - from) * (1 - Math.pow(1 - k, 3)));
          if (k < 1) raf.current = requestAnimationFrame(step);
        };
        raf.current = requestAnimationFrame(step);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const takeOver = useCallback(() => {
    cancelAnimationFrame(raf.current);
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
    <section ref={section} data-tone="light" aria-labelledby="day-title" className="surface-stone py-24 md:py-32">
      <div className="shell">
        <SectionHead
          id="day-title"
          eyebrow="A day at Disha"
          title={["Spend a day", <em key="e">with us.</em>]}
          intro="Move the sun across the sky to see a Disha community from morning yoga to the lights coming on after dark. Every photograph is from a community we have built."
        />

        <div className="relative mx-auto mt-12 aspect-[4/5] max-w-6xl overflow-hidden rounded-2xl bg-forest-deep text-paper shadow-[0_40px_90px_-50px_rgb(21_26_23/0.6)] sm:aspect-[16/10] lg:aspect-[16/9]">
          {phases.map((p, i) => (
            <Image
              key={p.src}
              src={p.src}
              alt={i === phase ? p.alt : ""}
              aria-hidden={i !== phase}
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className={`object-cover transition-[opacity,scale] duration-[1200ms] ease-out ${i === phase ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"}`}
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
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/10 to-forest-deep/20" />

          {/* The sky: the sun's path, and the sun itself, which can be dragged */}
          <div className="absolute inset-x-0 bottom-[5.5rem] top-6 sm:bottom-24">
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
            {sun.up && (
              <path d={`M${CX - R},${CY} A${R},${R} 0 0 1 ${sun.x.toFixed(1)},${sun.y.toFixed(1)}`} fill="none" stroke="rgb(241 235 223 / 0.7)" strokeWidth="1.4" />
            )}
            {sun.up ? (
              <g style={{ cursor: "grab" }}>
                <circle cx={sun.x} cy={sun.y} r="80" fill="url(#day-sun-glow)" />
                <circle cx={sun.x} cy={sun.y} r="19" fill="#ffcf8a" />
                <circle cx={sun.x} cy={sun.y} r="40" fill="transparent" />
              </g>
            ) : (
              <g transform={`translate(${CX + R * 0.6} ${CY - R * 0.78})`}>
                <circle r="18" fill="#e9e4d6" />
                <circle cx="8" cy="-6" r="16" fill="rgb(8 22 15 / 0.85)" />
              </g>
            )}
          </svg>
          </div>

          {/* The time line */}
          <div className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
            <div className="card-dark px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                <span className="tabular-nums">
                  <span className="font-semibold">{clock(hour)}</span>
                  <span className="text-paper/65"> · {phases[phase].name}</span>
                </span>
                <span className="text-paper/80">{phases[phase].caption}</span>
              </div>
              <label className="sr-only" htmlFor="day-hour">
                Time of day
              </label>
              <span
                className="mt-1 block text-paper"
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
                  aria-valuetext={`${clock(hour)}, ${phases[phase].name}: ${phases[phase].caption}`}
                  className="range"
                />
              </span>
            </div>
          </div>
        </div>
        <p className={`mt-4 text-center text-sm text-mute transition-opacity duration-700 ${touched ? "opacity-0" : "opacity-100"}`}>
          Drag the sun, or the line beneath the photograph.
        </p>
      </div>
    </section>
  );
}
