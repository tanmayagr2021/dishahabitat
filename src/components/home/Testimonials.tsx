"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionMark } from "@/components/ui";
import { homeowners } from "@/lib/site";

/* A photograph of each homeowner's own community (the last is a general community photograph). */
const photos = [
  { src: "/images/courtyard/facade.jpg", alt: "A Disha Courtyard block with terracotta panels and white lattice screens", caption: "Disha Courtyard" },
  { src: "/images/park-west/entrance.jpg", alt: "The Disha Park West entrance arch", caption: "Disha Park West" },
  { src: "/images/windsor-gardens/play-area.jpg", alt: "The children’s play area at Disha Windsor Gardens", caption: "Disha Windsor Gardens" },
  { src: "/images/central-park/living-room.jpg", alt: "A warmly lit living room inside a home at Disha Central Park", caption: "Inside a home at Disha Central Park" },
  { src: "/images/community/gardening.jpg", alt: "Children planting saplings with a gardener in a Disha Habitat community", caption: "A Disha Habitat community" },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const count = homeowners.length;
  const go = (i: number) => setActive((i + count) % count);
  const h = homeowners[active];

  return (
    <section
      id="homeowners"
      aria-labelledby="homeowners-title"
      aria-roledescription="carousel"
      className="relative overflow-hidden bg-ivory py-24 md:py-36"
    >
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionMark n="05" label="Homeowners" />
          </div>
          <h2 id="homeowners-title" className="display text-[2.6rem] text-ink sm:text-[3.8rem] lg:col-span-9 xl:text-[5rem]">
            What a home <em className="text-brass-deep">means…</em>
          </h2>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          {/* Photograph of the homeowner's community */}
          <figure className="relative aspect-[4/5] overflow-hidden bg-forest-900 sm:aspect-[16/11] lg:col-span-5 lg:aspect-[4/5]">
            {photos.map((p, i) => (
              <div
                key={p.src}
                aria-hidden={i !== active}
                className={`absolute inset-0 transition-[opacity,transform] duration-[1200ms] ease-out-soft ${
                  i === active ? "scale-100 opacity-100" : "scale-[1.05] opacity-0"
                }`}
              >
                <Image src={p.src} alt={i === active ? p.alt : ""} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
            ))}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <figcaption className="absolute bottom-5 left-5 text-xs uppercase tracking-[0.18em] text-ivory/85">
              {photos[active].caption}
            </figcaption>
          </figure>

          <div className="flex flex-col justify-between gap-12 lg:col-span-6 lg:col-start-7">
            <div
              role="group"
              aria-roledescription="slide"
              aria-label={`${active + 1} of ${count}`}
              aria-live="polite"
              className="relative"
            >
              <span aria-hidden className="display block text-[7rem] leading-[0.6] text-brass md:text-[9rem]">
                “
              </span>
              <blockquote key={h.name}>
                <p
                  className="display anim-rise mt-4 text-[2.1rem] leading-[1.08] text-ink sm:text-[2.8rem] xl:text-[3.5rem]"
                  style={{ "--d": "0ms" } as CSSProperties}
                >
                  {h.quote}
                </p>
                <footer className="anim-rise mt-10 flex flex-col gap-1 border-t border-ink/15 pt-6 text-sm" style={{ "--d": "120ms" } as CSSProperties}>
                  <cite className="not-italic text-base font-semibold text-ink">{h.name}</cite>
                  <span className="text-ink-mute">Native of {h.native}</span>
                  <Link
                    href={`/homes/${h.slug}`}
                    className="mt-1 inline-flex min-h-10 w-fit items-center text-ink-soft underline decoration-ink/25 underline-offset-4 hover:text-ink hover:decoration-ink"
                  >
                    Resident, {h.resident}
                  </Link>
                </footer>
              </blockquote>
            </div>

            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2" role="group" aria-label="Choose a homeowner">
                {homeowners.map((item, i) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Show ${item.name}`}
                    aria-current={i === active ? "true" : undefined}
                    className="group flex h-11 items-center"
                  >
                    <span
                      className={`block h-px transition-all duration-700 ease-out-soft ${
                        i === active ? "w-12 bg-ink" : "w-6 bg-ink/25 group-hover:bg-ink/60"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(active - 1)}
                  className="inline-flex size-13 items-center justify-center border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-ivory"
                  aria-label="Previous homeowner"
                >
                  <ArrowLeft className="size-5" strokeWidth={1.25} />
                </button>
                <button
                  type="button"
                  onClick={() => go(active + 1)}
                  className="inline-flex size-13 items-center justify-center border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-ivory"
                  aria-label="Next homeowner"
                >
                  <ArrowRight className="size-5" strokeWidth={1.25} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
