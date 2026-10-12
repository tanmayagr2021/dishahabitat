"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui";
import { homeowners } from "@/lib/site";
import { getProject } from "@/lib/projects";

/*
 * "From across India, to a place called home." Each homeowner's home town is plotted at its
 * real latitude and longitude, and an arc carries them to Bengaluru. Choosing a story washes
 * the section in the colour of the community they now live in.
 * Positions are approximate town centres; no national borders are drawn.
 */
const photos = [
  { src: "/images/courtyard/facade.jpg", alt: "A Disha Courtyard block with terracotta panels and white lattice screens" },
  { src: "/images/park-west/entrance.jpg", alt: "The Disha Park West entrance arch" },
  { src: "/images/windsor-gardens/play-area.jpg", alt: "The children’s play area at Disha Windsor Gardens" },
  { src: "/images/central-park/living-room.jpg", alt: "A warmly lit living room inside a home at Disha Central Park" },
  { src: "/images/courtyard/giant-chess.jpg", alt: "A young boy among giant chess pieces in the Disha Courtyard" },
];

/* [longitude, latitude] of each home town, in the same order as `homeowners`. */
const towns: [number, number][] = [
  [85.85, 20.45], // Govindapur, Odisha
  [79.75, 15.6], // Gundlapalli, Andhra Pradesh
  [76.04, 10.59], // Guruvayur, Kerala
  [81.8, 16.41], // Malkipuram, Andhra Pradesh
  [84.83, 24.94], // Tekari, Bihar
];
const bengaluru: [number, number] = [77.59, 12.97];

/* Equirectangular projection over the part of India the stories span. */
const W = 640;
const H = 600;
const bounds = { west: 74, east: 88.5, south: 9, north: 26.2 };
const kx = Math.cos((18 * Math.PI) / 180);
const spanX = (bounds.east - bounds.west) * kx;
const spanY = bounds.north - bounds.south;
const scale = Math.min(W / spanX, H / spanY);
const project = ([lon, lat]: [number, number]) => ({
  x: (lon - bounds.west) * kx * scale + (W - spanX * scale) / 2,
  y: (bounds.north - lat) * scale + (H - spanY * scale) / 2,
});
const home = project(bengaluru);

/* Great-circle distance, rounded to the nearest 50 km. */
function distanceKm([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]) {
  const r = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2;
  return Math.round((6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) / 50) * 50;
}

const stories = homeowners.map((h, i) => {
  const from = project(towns[i]);
  // A gentle arc, bowed to one side of the straight line.
  const mx = (from.x + home.x) / 2;
  const my = (from.y + home.y) / 2;
  const dx = home.x - from.x;
  const dy = home.y - from.y;
  const bow = 0.22;
  const cx = mx - dy * bow;
  const cy = my + dx * bow;
  return {
    ...h,
    town: h.native.split(",")[0],
    state: h.native.split(",")[1]?.trim(),
    from,
    path: `M${from.x.toFixed(1)},${from.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${home.x.toFixed(1)},${home.y.toFixed(1)}`,
    km: distanceKm(towns[i], bengaluru),
    hue: getProject(h.slug)!.hue,
    photo: photos[i],
  };
});

/* Faint dot field behind the map. */
const field: { x: number; y: number }[] = [];
for (let y = 14; y < H; y += 22) for (let x = 14; x < W; x += 22) field.push({ x, y });

export function Journeys() {
  const [active, setActive] = useState(0);
  const s = stories[active];
  const go = (d: number) => setActive((a) => (a + d + stories.length) % stories.length);

  return (
    <section
      id="homeowners"
      data-tone="dark"
      aria-labelledby="journeys-title"
      className="surface-earth grain relative overflow-hidden py-24 md:py-36"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label n="06" className="text-paper/70">
              Homeowners
            </Label>
            <h2 id="journeys-title" className="serif mt-8 text-[clamp(2.3rem,4.4vw,4.4rem)] leading-[1.02]">
              From across India,
              <br />
              <em>to a place called home.</em>
            </h2>
          </div>
          <p className="max-w-xs text-[1rem] leading-relaxed text-paper/80">
            Choose a home town to follow a family’s journey to Bengaluru.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          {/* The map */}
          <div className="relative min-w-0 lg:col-span-6">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
              <g aria-hidden>
                {field.map((d) => (
                  <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={1.3} className="fill-paper/20" />
                ))}
                {[10, 15, 20, 25].map((lat) => {
                  const y = project([bounds.west, lat]).y;
                  return (
                    <g key={lat}>
                      <line x1={0} x2={W} y1={y} y2={y} className="stroke-paper/20" strokeDasharray="2 5" />
                      <text x={4} y={y - 8} className="fill-paper/55 text-[13px] tabular-nums">
                        {lat}°N
                      </text>
                    </g>
                  );
                })}
                {stories.map((st, i) => (
                  <path
                    key={st.name}
                    d={st.path}
                    fill="none"
                    className="stroke-paper/35"
                    strokeWidth={1.2}
                    strokeDasharray="3 6"
                    opacity={i === active ? 0 : 1}
                  />
                ))}
                {/* The chosen journey draws itself in. */}
                <path
                  key={`arc-${active}`}
                  d={s.path}
                  fill="none"
                  className="journey-arc stroke-paper"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  pathLength={1}
                />
                <circle key={`dot-${active}`} r={6} className="journey-traveller fill-cyan">
                  <animateMotion dur="1.4s" begin="0s" fill="freeze" path={s.path} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.16 1 0.3 1" />
                </circle>
                {/* Bengaluru */}
                <circle cx={home.x} cy={home.y} r={26} className="journey-pulse fill-cyan/25" />
                {/* Home is the roof of the Disha mark. */}
                <g transform={`translate(${home.x - 22} ${home.y - 26}) scale(1.8)`} className="fill-cyan">
                  <path d="M43.64,8.93l-1.46-.57s-.06-.03-.08-.04l-9.42-3.73V1.18c0-.46-.37-.83-.83-.83s-.83.37-.83.83v3.42l-10.94,4.33c-.2.08-.37.24-.45.45-.08.2-.09.43,0,.64.13.32.43.52.77.52.11,0,.2-.02.3-.06l.37-.14v3.31c0,.89.73,1.62,1.62,1.62h8.39c.89,0,1.62-.73,1.62-1.62v-7.26l8.32,3.29v4.76c0,.46.37.83.83.83s.83-.37.83-.83v-4.1l.37.15c.42.17.9-.04,1.07-.47s-.04-.9-.47-1.07M31.02,6.38v7.22h-8.32v-3.93s8.32-3.29,8.32-3.29Z" transform="translate(-20.5 0)" />
                </g>
                <text x={home.x + 26} y={home.y + 40} className="serif fill-paper text-[30px]">
                  Bengaluru
                </text>
              </g>

              {stories.map((st, i) => {
                const on = i === active;
                const right = st.from.x < W - 170;
                return (
                  <g
                    key={st.name}
                    onClick={() => setActive(i)}
                    className="cursor-pointer"
                  >
                    <circle cx={st.from.x} cy={st.from.y} r={20} fill="transparent" />
                    <circle
                      cx={st.from.x}
                      cy={st.from.y}
                      r={on ? 8 : 5.5}
                      className={`transition-all duration-500 ${on ? "fill-paper" : "fill-transparent stroke-paper"}`}
                      strokeWidth={1.5}
                    />
                    <text
                      x={st.from.x + (right ? 16 : -16)}
                      y={st.from.y + 6}
                      textAnchor={right ? "start" : "end"}
                      className={`text-[17px] transition-opacity duration-500 ${on ? "fill-paper font-semibold" : "fill-paper/65"}`}
                    >
                      {st.town}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* The story */}
          <div className="flex min-w-0 flex-col lg:col-span-6">
            <div role="tablist" aria-label="Home towns" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {stories.map((st, i) => (
                <button
                  key={st.name}
                  type="button"
                  role="tab"
                  id={`journey-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="journey-panel"
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const n = (i + (e.key === "ArrowRight" ? 1 : -1) + stories.length) % stories.length;
                      setActive(n);
                      document.getElementById(`journey-tab-${n}`)?.focus();
                    }
                  }}
                  tabIndex={i === active ? 0 : -1}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[0.92rem] transition-colors ${
                    i === active ? "border-paper bg-paper text-ink" : "border-paper/30 bg-white/[0.04] hover:border-paper"
                  }`}
                >
                  {st.town}
                </button>
              ))}
            </div>

            <div
              id="journey-panel"
              role="tabpanel"
              aria-labelledby={`journey-tab-${active}`}
              key={active}
              className="journey-card card-dark mt-6 flex flex-1 flex-col overflow-hidden text-paper"
            >
              <div className="grid flex-1 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="relative m-3 aspect-[4/3] overflow-hidden rounded-xl sm:mr-0 sm:aspect-auto sm:min-h-[22rem]">
                  <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
                </div>
                <blockquote className="flex flex-col justify-between gap-8 p-6 md:p-8">
                  <div>
                    <p className="flex items-center gap-2 text-sm text-paper/65">
                      <span className="whitespace-nowrap tabular-nums text-paper">≈ {s.km.toLocaleString("en-IN")} km</span>
                      <span aria-hidden className="h-px w-5 bg-current opacity-40" />
                      from {s.town} to Bengaluru
                    </p>
                    <p className="serif mt-5 text-[clamp(1.5rem,2.2vw,2.1rem)] leading-[1.15]">“{s.quote}”</p>
                  </div>
                  <footer className="text-[0.95rem]">
                    <cite className="block font-medium not-italic">{s.name}</cite>
                    <span className="mt-1 block text-paper/65">
                      From {s.native} · now at{" "}
                      <Link
                        href={`/homes/${s.slug}`}
                        className="text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
                      >
                        {s.resident}
                      </Link>
                    </span>
                  </footer>
                </blockquote>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-sm tabular-nums text-paper/70">
                {String(active + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous story"
                  className="inline-flex size-12 items-center justify-center rounded-full border border-paper/35 transition-colors hover:bg-paper hover:text-ink"
                >
                  <ArrowLeft aria-hidden className="size-4" strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next story"
                  className="inline-flex size-12 items-center justify-center rounded-full bg-paper text-ink transition-colors hover:bg-white"
                >
                  <ArrowRight aria-hidden className="size-4" strokeWidth={1.6} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-paper/60">Home towns are plotted at approximate positions; distances are as the crow flies.</p>
      </div>
    </section>
  );
}
