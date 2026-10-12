"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { elements } from "@/lib/elements";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/*
 * A day at a Disha community. The headline sits inside the sun's arc; drag the sun (or use the
 * time control, or arrow keys) and the photograph moves through the day — every one a real
 * Disha community. When the intro hands over, the sun rises from dawn to the hour it is now in
 * Bengaluru, once, so the interaction shows itself. Reduced motion: no sweep.
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
    tint: "linear-gradient(180deg, rgb(255 190 140 / 0.28), transparent 55%)",
  },
  {
    from: 10,
    name: "Midday",
    src: "/images/courtyard/pool-court.jpg",
    alt: "The pool court at Disha Courtyard, framed by terracotta and white blocks",
    caption: "The pool court · Disha Courtyard",
    position: "50% 60%",
    tint: "linear-gradient(180deg, rgb(180 220 255 / 0.12), transparent 50%)",
  },
  {
    from: 14,
    name: "Afternoon",
    src: "/images/pursuit-of-sunshine/sundial.webp",
    alt: "A large stone sundial set into a circular plaza at Disha Pursuit of Sunshine",
    caption: "The sundial · Disha Pursuit of Sunshine",
    position: "50% 55%",
    tint: "linear-gradient(180deg, rgb(255 200 110 / 0.22), transparent 60%)",
  },
  {
    from: 17,
    name: "Dusk",
    src: "/images/central-park/clubhouse-dusk.jpg",
    alt: "The glass clubhouse at Disha Central Park lit up at dusk above the pool",
    caption: "The clubhouse at dusk · Disha Central Park",
    position: "56% 55%",
    tint: "linear-gradient(180deg, rgb(120 70 140 / 0.25), transparent 60%)",
  },
  {
    from: 19,
    name: "Night",
    src: "/images/central-park/clubhouse-night.jpg",
    alt: "The Disha Central Park clubhouse and pool lit up after dark",
    caption: "After dark · Disha Central Park",
    position: "50% 50%",
    tint: "linear-gradient(180deg, rgb(20 40 90 / 0.35), transparent 60%)",
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
const CY = 520;
const R = 470;
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

export function Hero() {
  const [hour, setHour] = useState(17.5);
  const [touched, setTouched] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const raf = useRef(0);

  const phase = phaseIndex(hour);
  const sun = sunAt(hour);

  /* The sunrise sweep, once the intro has handed over. */
  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = bengaluruHour();
    const sweep = () => {
      if (reduce) {
        raf.current = requestAnimationFrame(() => setHour(target));
        return;
      }
      const t0 = performance.now() + 500;
      const dur = 2600;
      const step = (now: number) => {
        const k = Math.min(1, Math.max(0, (now - t0) / dur));
        const e = 1 - Math.pow(1 - k, 3);
        setHour(DAY.start + (target - DAY.start) * e);
        if (k < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    };
    const mo = new MutationObserver(() => {
      if (html.dataset.intro !== "on") {
        mo.disconnect();
        sweep();
      }
    });
    if (html.dataset.intro === "on") mo.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
    else sweep();
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const takeOver = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setTouched(true);
  }, []);

  /* Dragging the sun: the pointer's angle around the arc's centre becomes the hour. */
  const fromPointer = (e: PointerEvent<SVGSVGElement>) => {
    const el = svg.current;
    const m = el?.getScreenCTM();
    if (!el || !m) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    if (pt.y > CY) {
      setHour(pt.x < CX ? DAY.start : DAY.max);
      return;
    }
    const a = Math.atan2(CY - pt.y, pt.x - CX);
    const p = 1 - Math.min(Math.PI, Math.max(0, a)) / Math.PI;
    setHour(DAY.start + p * (DAY.end - DAY.start));
  };

  return (
    <section
      data-tone="dark"
      aria-labelledby="hero-title"
      className="hero-stage relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest-deep text-paper"
    >
      {/* The day, in photographs */}
      <div aria-hidden className="anim-develop absolute inset-0 -z-10">
        {phases.map((p, i) => (
          <Image
            key={p.src}
            src={p.src}
            alt=""
            fill
            sizes="100vw"
            priority={i === 3}
            className={`object-cover transition-opacity duration-[1200ms] ease-out ${i === phase ? "opacity-100" : "opacity-0"}`}
            style={{ objectPosition: p.position }}
          />
        ))}
        {phases.map((p, i) => (
          <div
            key={p.name}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ${i === phase ? "opacity-100" : "opacity-0"}`}
            style={{ background: p.tint }}
          />
        ))}
        <div className="absolute inset-0 bg-forest-deep/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_58%,rgb(8_22_15/0.55),transparent_75%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-forest-deep/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-forest-deep/85 to-transparent" />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-end px-5 pb-8 pt-28 text-center md:pt-32">
        {/* The arc and the sun */}
        <div className="relative w-full max-w-[68rem]">
          <svg
            ref={svg}
            viewBox={`0 0 ${W} ${CY + 10}`}
            className="anim-fade block h-auto w-full touch-none select-none"
            style={d(500)}
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
              <radialGradient id="sun-glow">
                <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.9" />
                <stop offset="0.35" stopColor="#f5a34a" stopOpacity="0.35" />
                <stop offset="1" stopColor="#f5a34a" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* the path of the day, and the part already travelled */}
            <path d={`M${CX - R},${CY} A${R},${R} 0 0 1 ${CX + R},${CY}`} fill="none" stroke="rgb(241 235 223 / 0.28)" strokeWidth="1.2" strokeDasharray="2 7" />
            {sun.up && (
              <path
                d={`M${CX - R},${CY} A${R},${R} 0 0 1 ${sun.x.toFixed(1)},${sun.y.toFixed(1)}`}
                fill="none"
                stroke="rgb(241 235 223 / 0.75)"
                strokeWidth="1.4"
              />
            )}
            <line x1={CX - R - 30} x2={CX + R + 30} y1={CY} y2={CY} stroke="rgb(241 235 223 / 0.35)" strokeWidth="1" />
            {[6, 12, 18].map((h) => {
              const s = sunAt(h);
              return <circle key={h} cx={s.x} cy={s.y} r="3" fill="rgb(241 235 223 / 0.6)" />;
            })}
            {sun.up ? (
              <g style={{ cursor: "grab" }}>
                <circle cx={sun.x} cy={sun.y} r="70" fill="url(#sun-glow)" />
                <circle cx={sun.x} cy={sun.y} r="17" fill="#ffcf8a" />
                <circle cx={sun.x} cy={sun.y} r="30" fill="transparent" />
              </g>
            ) : (
              <g transform={`translate(${CX + R * 0.62} ${CY - R * 0.74})`}>
                <circle r="16" fill="#e9e4d6" />
                <circle cx="7" cy="-5" r="14" fill="rgb(8 22 15 / 0.85)" />
              </g>
            )}
          </svg>

          {/* The headline, inside the arc */}
          <div className="-mt-[22%] flex flex-col items-center sm:pointer-events-none sm:absolute sm:inset-x-0 sm:bottom-[6%] sm:mt-0 sm:px-4">
            <p className="anim-fade text-[0.95rem] text-paper/80" style={d(300)}>
              Disha Habitat · East Bengaluru · since 2014
            </p>
            <h1
              id="hero-title"
              className="serif anim-rise mt-4 max-w-[15ch] text-[clamp(2.7rem,7vw,6.6rem)] leading-[0.98] [text-shadow:0_2px_30px_rgb(0_0_0/0.25)]"
              style={d(350)}
            >
              Come home to <em>mindful</em> living spaces.
            </h1>
            <p className="anim-fade-up mt-5 max-w-xl text-[1.05rem] leading-relaxed text-paper/85 md:text-[1.15rem]" style={d(550)}>
              Apartments and villas in East Bengaluru, built by people who were once homebuyers themselves.
            </p>
            <div className="anim-fade-up pointer-events-auto mt-7 flex flex-col gap-3 sm:flex-row" style={d(700)}>
              <ButtonLink href="#explore" variant="paper">
                Explore the homes
              </ButtonLink>
              <ButtonLink href="/story" variant="outline-light">
                Our story
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* The time control: the hour, where you are, and a way to change it */}
        <div className="anim-fade-up mt-6 w-full max-w-xl" style={d(900)}>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="tabular-nums text-paper">
              <span className="font-semibold">{clock(hour)}</span>
              <span className="text-paper/60"> · {phases[phase].name}</span>
            </span>
            <span className="truncate text-paper/70">{phases[phase].caption}</span>
          </div>
          <label className="sr-only" htmlFor="hero-hour">
            Time of day
          </label>
          <span
            className="mt-2 block text-paper"
            style={{ "--fill": `${(((hour - DAY.start) / (DAY.max - DAY.start)) * 100).toFixed(2)}%`, "--thumb": "#ffcf8a" } as CSSProperties}
          >
            <input
              id="hero-hour"
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
          <p className={`mt-1 text-xs text-paper/55 transition-opacity duration-700 ${touched ? "opacity-0" : "opacity-100"}`}>
            Drag the sun, or this line, to spend a day at a Disha community.
          </p>
        </div>

        <Link
          href={elements.href}
          className="anim-fade-up group card-dark mt-6 inline-flex items-center gap-3 !rounded-full py-2 pl-2 pr-4 text-left text-sm"
          style={d(1050)}
        >
          <span className="relative block size-9 overflow-hidden rounded-full">
            <Image src={elements.cover.src} alt="" fill sizes="36px" className="object-cover" />
          </span>
          <span>
            <span className="text-paper/65">Now selling · </span>
            <span className="font-medium">{elements.shortName}, Gunjur</span>
          </span>
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
        </Link>
      </div>
    </section>
  );
}
