"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ButtonLink, Label, MediaBadge } from "@/components/ui";
import { getProject } from "@/lib/projects";

/*
 * A day at Disha Pursuit of Sunshine, told in five photographs. Scrolling moves the sun
 * across the sky and the page itself from daylight into night. The phase names are an
 * editorial device; every place shown is in the published gallery.
 */
const phases = [
  {
    name: "Morning",
    line: "Keep time by the Vrihat Samrat Yantra — a working sundial in the central plaza.",
    src: "/images/pursuit-of-sunshine/sundial.webp",
    alt: "A large stone sundial set into a circular plaza, with a pergola behind it",
    kind: "photo" as const,
    bg: "#f3f1ec",
    dark: false,
  },
  {
    name: "Noon",
    line: "Lengths of the temperature-controlled pool at the clubhouse.",
    src: "/images/pursuit-of-sunshine/pool-aerial.webp",
    alt: "Overhead view of a swimmer in the turquoise pool",
    kind: "photo" as const,
    bg: "#efe7d8",
    dark: false,
  },
  {
    name: "Afternoon",
    line: "Coffee and conversation at the clubhouse café.",
    src: "/images/pursuit-of-sunshine/cafe.webp",
    alt: "A café with sage-green tiles, timber ceiling slats and fresh flowers on the counter",
    kind: "photo" as const,
    bg: "#e8d9bf",
    dark: false,
  },
  {
    name: "Dusk",
    line: "The treehouse, lit up for an evening of play.",
    src: "/images/pursuit-of-sunshine/treehouse.webp",
    alt: "A wooden treehouse play structure lit warmly at dusk",
    kind: "photo" as const,
    bg: "#2c211b",
    dark: true,
  },
  {
    name: "Night",
    line: "Stars from your own 8 ft × 12 ft sundeck — every home has one.",
    src: "/images/pursuit-of-sunshine/render-sundeck.jpg",
    alt: "Artist’s impression of a sundeck at night with lounge chair, plants and a telescope",
    kind: "render" as const,
    bg: "#0c0c0b",
    dark: true,
  },
];

const project = getProject("disha-pursuit-of-sunshine")!;
const fact = (label: string) => project.facts.find((f) => f.label === label)?.value;

export function DayInTheSun() {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduce.matches) {
        el.style.setProperty("--p", "0.5");
        return;
      }
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      el.style.setProperty("--p", p.toFixed(4));
      setPhase(Math.min(phases.length - 1, Math.floor(p * phases.length)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const current = phases[phase];
  const dark = current.dark;

  return (
    <section
      ref={ref}
      data-tone={dark ? "dark" : "light"}
      aria-labelledby="sun-title"
      className="relative transition-[background-color,color] duration-[1200ms] ease-out-expo motion-safe:h-[440svh] [--p:0]"
      style={{ backgroundColor: current.bg, color: dark ? "var(--color-paper)" : "var(--color-ink)" }}
    >
      <div className="sticky top-0 flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 motion-reduce:relative md:py-24">
        <div className="shell grid w-full gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-5">
            <Label n="03" className="opacity-70">
              Disha Pursuit of Sunshine
            </Label>
            <h2 id="sun-title" className="serif mt-4 text-[clamp(2.3rem,5vw,5rem)] md:mt-5">
              A step closer <em>to the Sun.</em>
            </h2>

            {/* The sun's path across the sky. */}
            <div aria-hidden className="relative mt-6 aspect-[2.4/1] w-full max-w-[16rem] sm:max-w-md md:mt-12">
              <svg viewBox="0 0 240 100" className="absolute inset-0 size-full overflow-visible" fill="none">
                <path d="M10 100 A110 110 0 0 1 230 100" stroke="currentColor" strokeOpacity=".25" strokeDasharray="2 5" />
                <line x1="0" y1="100" x2="240" y2="100" stroke="currentColor" strokeOpacity=".35" />
              </svg>
              <span
                className="absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sunshine shadow-[0_0_40px_12px_rgb(245_154_44/0.45)] transition-opacity duration-700"
                style={
                  {
                    "--t": "clamp(0, calc(var(--p) * 1.3), 1)",
                    left: "calc(50% - cos(var(--t) * 180deg) * 45.8%)",
                    top: "calc(100% - sin(var(--t) * 180deg) * 100%)",
                    opacity: phase === phases.length - 1 ? 0 : 1,
                  } as CSSProperties
                }
              />
              {/* Night: a few stars. */}
              {[
                [18, 22],
                [42, 8],
                [64, 30],
                [80, 12],
                [92, 40],
              ].map(([x, y]) => (
                <span
                  key={`${x}-${y}`}
                  className="absolute size-[3px] rounded-full bg-paper transition-opacity duration-1000"
                  style={{ left: `${x}%`, top: `${y}%`, opacity: phase === phases.length - 1 ? 0.9 : 0 }}
                />
              ))}
            </div>

            <ol className="mt-3 flex max-w-[16rem] justify-between gap-2 sm:max-w-md">
              {phases.map((ph, i) => (
                <li
                  key={ph.name}
                  className={`label text-[0.55rem] transition-opacity duration-500 sm:text-[0.6875rem] ${i === phase ? "opacity-100" : "opacity-35"}`}
                  aria-current={i === phase ? "step" : undefined}
                >
                  {ph.name}
                </li>
              ))}
            </ol>

            <div aria-live="polite" className="mt-5 min-h-[6.5rem] md:mt-12 md:min-h-[7.5rem]">
              <p key={current.name} className="serif anim-fade-up text-[clamp(2.2rem,3.6vw,3.4rem)] italic">
                {current.name}
              </p>
              <p key={`${current.name}-l`} className="anim-fade-up mt-3 max-w-sm text-[1.02rem] leading-snug opacity-75" style={{ "--d": "80ms" } as CSSProperties}>
                {current.line}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <figure className="relative aspect-[16/10] overflow-hidden rounded-[3px] bg-ink-3 sm:aspect-[4/3] lg:aspect-auto lg:h-[72svh]">
              {phases.map((ph, i) => (
                <div
                  key={ph.src}
                  aria-hidden={i !== phase}
                  className={`absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-out-expo ${
                    i === phase ? "scale-100 opacity-100" : i < phase ? "scale-105 opacity-0" : "scale-[1.12] opacity-0"
                  }`}
                >
                  <Image
                    src={ph.src}
                    alt={i === phase ? ph.alt : ""}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                  <MediaBadge kind={ph.kind} className="left-auto right-4 top-4" />
                </div>
              ))}
            </figure>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
              <dl className="flex gap-8">
                {[
                  ["Homes", fact("Homes")],
                  ["Land", fact("Project size")],
                  ["Sundeck", "8 × 12 ft"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="label opacity-60">{k}</dt>
                    <dd className="serif mt-1 text-[1.6rem] leading-none">{v}</dd>
                  </div>
                ))}
              </dl>
              <ButtonLink href={`/homes/${project.slug}`} variant={dark ? "paper" : "ink"} className="hidden sm:inline-flex">
                Explore Pursuit of Sunshine
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
