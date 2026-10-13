"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { Label, MediaBadge } from "@/components/ui";

/*
 * A day at Disha Pursuit of Sunshine, told in five photographs. Choosing a time of day moves
 * the sun along its arc. The phase names are an editorial device; every place shown is in the
 * published gallery.
 */
const phases = [
  {
    name: "Morning",
    line: "Keep time by the Vrihat Samrat Yantra, a working sundial in the central plaza.",
    src: "/images/pursuit-of-sunshine/sundial.webp",
    alt: "A large stone sundial set into a circular plaza, with a pergola behind it",
    kind: "photo" as const,
  },
  {
    name: "Noon",
    line: "Lengths of the temperature-controlled pool at the clubhouse.",
    src: "/images/pursuit-of-sunshine/pool-aerial.webp",
    alt: "Overhead view of a swimmer in the turquoise pool",
    kind: "photo" as const,
  },
  {
    name: "Afternoon",
    line: "Coffee and conversation at the clubhouse café.",
    src: "/images/pursuit-of-sunshine/cafe.webp",
    alt: "A café with sage-green tiles, timber ceiling slats and fresh flowers on the counter",
    kind: "photo" as const,
  },
  {
    name: "Dusk",
    line: "The treehouse, lit up for an evening of play.",
    src: "/images/pursuit-of-sunshine/treehouse.webp",
    alt: "A wooden treehouse play structure lit warmly at dusk",
    kind: "photo" as const,
  },
  {
    name: "Night",
    line: "Stars from your own 8 ft × 12 ft sundeck, every home has one.",
    src: "/images/pursuit-of-sunshine/render-sundeck.jpg",
    alt: "Artist’s impression of a sundeck at night with lounge chair, plants and a telescope",
    kind: "render" as const,
  },
];

export function DayInTheSun() {
  const [phase, setPhase] = useState(0);
  const current = phases[phase];
  const t = phase / (phases.length - 2); // the sun sets at Dusk; at Night it is gone

  return (
    <section data-tone="light" aria-labelledby="sun-title" className="surface-ivory py-16 md:py-24">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-5">
          <Label n="03" className="text-mute">
            A day here
          </Label>
          <h2 id="sun-title" className="serif mt-5 text-[clamp(2.4rem,4.6vw,4.4rem)]">
            A step closer <em>to the Sun.</em>
          </h2>

          {/* The sun's path across the sky. */}
          <div aria-hidden className="relative mt-10 aspect-[2.4/1] w-full max-w-sm">
            <svg viewBox="0 0 240 100" className="absolute inset-0 size-full overflow-visible" fill="none">
              <path d="M10 100 A110 110 0 0 1 230 100" stroke="currentColor" strokeOpacity=".25" strokeDasharray="2 5" />
              <line x1="0" y1="100" x2="240" y2="100" stroke="currentColor" strokeOpacity=".35" />
            </svg>
            <span
              className="absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sunshine shadow-[0_0_30px_8px_rgb(245_154_44/0.4)] transition-[left,top,opacity] duration-700 ease-out-expo"
              style={
                {
                  left: `calc(50% - ${Math.cos(Math.min(t, 1) * Math.PI) * 45.8}%)`,
                  top: `calc(100% - ${Math.sin(Math.min(t, 1) * Math.PI) * 100}%)`,
                  opacity: phase === phases.length - 1 ? 0 : 1,
                } as CSSProperties
              }
            />
          </div>

          <div role="tablist" aria-label="Time of day" className="mt-6 flex flex-wrap gap-2">
            {phases.map((ph, i) => (
              <button
                key={ph.name}
                type="button"
                role="tab"
                id={`sun-tab-${i}`}
                aria-selected={i === phase}
                aria-controls="sun-panel"
                onClick={() => setPhase(i)}
                className={`h-10 px-4 text-[0.92rem] transition-colors ${
                  i === phase ? "bg-ink text-paper" : "border border-ink/15 hover:bg-ink/5"
                }`}
              >
                {ph.name}
              </button>
            ))}
          </div>
          <p className="mt-6 min-h-[3.4em] max-w-sm text-[1.08rem] leading-snug text-ink/80">{current.line}</p>
        </div>

        <figure
          id="sun-panel"
          role="tabpanel"
          aria-labelledby={`sun-tab-${phase}`}
          className="relative aspect-[4/3] overflow-hidden bg-paper-3 lg:col-span-7"
        >
          {phases.map((ph, i) => (
            <div
              key={ph.src}
              aria-hidden={i !== phase}
              className={`absolute inset-0 transition-opacity duration-700 ${i === phase ? "opacity-100" : "opacity-0"}`}
            >
              <Image src={ph.src} alt={i === phase ? ph.alt : ""} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
              <MediaBadge kind={ph.kind} className="left-auto right-4 top-4" />
            </div>
          ))}
        </figure>
      </div>
    </section>
  );
}
