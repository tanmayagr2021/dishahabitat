"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/*
 * The concerts Disha has brought to Bengaluru, as a row of posters with a ticket stub under each.
 * Dates and venues are only those printed on the posters themselves.
 */
const shows = [
  { src: "/images/events/shankar-ehsaan-loy.webp", w: 306, h: 490, artist: "Shankar Ehsaan Loy", billing: "A Red Live concert", when: "21 December 2024", where: "New Horizon College of Engineering, Bellandur" },
  { src: "/images/events/shreya-ghoshal.webp", w: 285, h: 467, artist: "Shreya Ghoshal", billing: "All Hearts Tour", when: "11 May 2024", where: "New Horizon College of Engineering, Bellandur" },
  { src: "/images/events/armaan-malik.webp", w: 308, h: 499, artist: "Armaan Malik", billing: "Live in Bengaluru", when: "13 September", where: "Phoenix Marketcity, Whitefield" },
  { src: "/images/events/ks-chithra.webp", w: 372, h: 167, artist: "K S Chithra", billing: "Live in concert, multilingual" },
  { src: "/images/events/piyush-mishra.webp", w: 216, h: 435, artist: "Piyush Mishra", billing: "Ballimaaraan, live in concert" },
  { src: "/images/events/sunil-grover.webp", w: 220, h: 334, artist: "Sunil Grover", billing: "Live", when: "2 December 2023", where: "Phoenix Marketcity" },
];

export function EventsLineup() {
  const rail = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="label text-mute">
          On stage · <span className="tabular-nums">{shows.length}</span> shows
        </p>
        <div className="flex gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => go(dir)}
              disabled={dir === -1 ? edge.start : edge.end}
              aria-label={dir === -1 ? "Previous shows" : "More shows"}
              aria-controls="events-rail"
              className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
            >
              {dir === -1 ? <ArrowLeft aria-hidden className="size-4" /> : <ArrowRight aria-hidden className="size-4" />}
            </button>
          ))}
        </div>
      </div>

      <ul
        id="events-rail"
        ref={rail}
        aria-label="Concerts presented with Disha Habitat"
        className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:gap-6"
      >
        {shows.map((s) => (
          <li key={s.artist} className="group flex shrink-0 snap-start flex-col" style={{ width: `min(85vw, calc(var(--poster-h) * ${(s.w / s.h).toFixed(3)}))` }}>
            <div className="relative shrink-0 overflow-hidden rounded-t-xl bg-ink shadow-[0_30px_60px_-36px_rgb(21_26_23/0.7)]" style={{ height: "var(--poster-h)" }}>
              <Image
                src={s.src}
                alt={`Poster: ${s.artist}, ${s.billing}`}
                fill
                sizes="(min-width: 768px) 20rem, 60vw"
                className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]"
              />
            </div>
            {/* Ticket stub: the perforation and the two punched notches. */}
            <div className="relative flex-1 rounded-b-xl border-t-2 border-dashed border-ink/20 bg-paper px-4 pb-4 pt-3.5">
              <span aria-hidden className="absolute -left-2 -top-2 size-4 rounded-full bg-paper-2" />
              <span aria-hidden className="absolute -right-2 -top-2 size-4 rounded-full bg-paper-2" />
              <p className="label text-[0.68rem] text-brass-ink">{s.billing}</p>
              <p className="serif mt-1 text-[1.35rem] leading-tight">{s.artist}</p>
              {s.when ? (
                <p className="mt-1.5 text-[0.82rem] leading-snug text-mute">
                  <span className="tabular-nums">{s.when}</span>
                  <br />
                  {s.where}
                </p>
              ) : (
                <p className="mt-1.5 text-[0.82rem] leading-snug text-mute">Presented with Disha Habitat</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
