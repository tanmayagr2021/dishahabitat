"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { Label, Lines } from "@/components/ui";
import { homeowners } from "@/lib/site";
import { getProject } from "@/lib/projects";

/* A photograph of each homeowner's own community (the last is a general community photograph). */
const photos = [
  { src: "/images/courtyard/facade.jpg", alt: "A Disha Courtyard block with terracotta panels and white lattice screens" },
  { src: "/images/park-west/entrance.jpg", alt: "The Disha Park West entrance arch" },
  { src: "/images/windsor-gardens/play-area.jpg", alt: "The children’s play area at Disha Windsor Gardens" },
  { src: "/images/central-park/living-room.jpg", alt: "A warmly lit living room inside a home at Disha Central Park" },
  { src: "/images/courtyard/giant-chess.jpg", alt: "A young boy among giant chess pieces in the Disha Courtyard" },
];

export function Journeys() {
  const [open, setOpen] = useState(0);
  const uid = useId();

  return (
    <section
      id="homeowners"
      data-tone="light"
      aria-labelledby="journeys-title"
      className="relative bg-paper py-28 md:py-40"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 lg:pt-4">
            <Label n="05" className="text-mute">
              Homeowners
            </Label>
          </div>
          <div className="lg:col-span-9">
            <Lines
              id="journeys-title"
              className="serif text-[clamp(2.8rem,6.4vw,6.6rem)]"
              lines={["From across India,", <em key="e">to a place called home.</em>]}
            />
          </div>
        </div>

        <ul className="mt-16 border-b border-ink/15 md:mt-24">
          {homeowners.map((h, i) => {
            const on = open === i;
            const p = getProject(h.slug)!;
            const panel = `${uid}-panel-${i}`;
            return (
              <li key={h.name} className="border-t border-ink/15">
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={panel}
                    onClick={() => setOpen(on ? -1 : i)}
                    className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-6 text-left md:grid-cols-[1fr_minmax(0,7rem)_1fr_auto] md:py-8"
                  >
                    <span className="serif text-[clamp(1.7rem,3.2vw,3rem)] leading-none transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                      {h.native}
                    </span>
                    {/* The journey: a line drawn from one place to the other. */}
                    <span aria-hidden className="relative hidden h-px w-full md:block">
                      <span className="absolute inset-0 bg-ink/20" />
                      <span
                        className={`absolute inset-y-0 left-0 bg-ink transition-[width] duration-1000 ease-out-expo ${on ? "w-full" : "w-0 group-hover:w-1/3"}`}
                      />
                      <span
                        className="absolute -top-[3px] right-0 size-[7px] rounded-full transition-transform duration-700"
                        style={{ background: p.hue, transform: on ? "scale(1.4)" : "scale(1)" }}
                      />
                    </span>
                    <span className="col-start-1 row-start-2 flex items-center gap-2 text-[0.95rem] text-mute md:col-start-auto md:row-start-auto md:text-[1.15rem] md:text-ink">
                      <span aria-hidden className="md:hidden">→</span>
                      {h.resident}
                    </span>
                    <span
                      aria-hidden
                      className={`col-start-2 row-span-2 row-start-1 inline-flex size-10 items-center justify-center rounded-full border border-ink/20 transition-[transform,background-color,color] duration-500 md:col-start-auto md:row-span-1 md:row-start-auto ${
                        on ? "rotate-45 bg-ink text-paper" : "group-hover:bg-ink group-hover:text-paper"
                      }`}
                    >
                      <span className="relative block size-3">
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                      </span>
                    </span>
                  </button>
                </h3>

                <div
                  id={panel}
                  role="region"
                  aria-label={`${h.name}, ${h.resident}`}
                  className={`grid transition-[grid-template-rows] duration-700 ease-out-expo ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  inert={!on}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-8 pb-10 md:grid-cols-12 md:gap-8 md:pb-14">
                      <figure className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-paper-3 md:col-span-4">
                        <Image
                          src={photos[i].src}
                          alt={photos[i].alt}
                          fill
                          sizes="(min-width: 768px) 30vw, 100vw"
                          className={`object-cover transition-[filter,transform] delay-200 duration-[1600ms] ease-out-expo ${on ? "scale-100 grayscale-0" : "scale-110 grayscale"}`}
                        />
                      </figure>
                      <blockquote className="flex flex-col justify-between gap-8 md:col-span-7 md:col-start-6">
                        <p className="serif text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.05]">“{h.quote}”</p>
                        <footer className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-mute">
                          <cite className="not-italic font-medium text-ink">{h.name}</cite>
                          <span>Native of {h.native}</span>
                          <Link
                            href={`/homes/${h.slug}`}
                            className="underline decoration-ink/25 underline-offset-4 hover:text-ink hover:decoration-ink"
                          >
                            Resident, {h.resident}
                          </Link>
                        </footer>
                      </blockquote>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
