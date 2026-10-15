"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Lines, Reveal } from "@/components/ui";
import { homeowners } from "@/lib/site";

/*
 * Homeowners in their own words (published on dishahabitat.com), each beside a photograph of the
 * community they live in. Names, home towns and communities are as published.
 */
const photos = [
  { src: "/images/courtyard/facade.jpg", alt: "A Disha Courtyard block with terracotta panels and white lattice screens" },
  { src: "/images/park-west/entrance.jpg", alt: "The Disha Park West entrance arch" },
  { src: "/images/windsor-gardens/play-area.jpg", alt: "The children’s play area at Disha Windsor Gardens" },
  { src: "/images/central-park/clubhouse-night.jpg", alt: "The Disha Central Park clubhouse lit up after dark" },
  { src: "/images/courtyard/giant-chess.jpg", alt: "A young boy among giant chess pieces at Disha Courtyard" },
];

export function HomeownersSpeak() {
  const [i, setI] = useState(0);
  const n = homeowners.length;
  const h = homeowners[i];
  const go = (d: number) => setI((v) => (v + d + n) % n);

  return (
    <section data-tone="light" aria-labelledby="speak-title" className="layer surface-ivory py-16 md:py-24">
      <div className="shell grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-3">
          <Reveal as="p" className="eyebrow text-mute">
            Real stories
          </Reveal>
          <Lines id="speak-title" className="serif mt-5 t-section leading-[1.04]" lines={["What home means", <em key="e">to the people in ours.</em>]} />
          <p className="mt-5 text-[1.02rem] leading-relaxed text-mute">From across India, to a place called home, in their own words.</p>
          <div className="mt-8 flex items-center gap-3">
            <button type="button" onClick={() => go(-1)} aria-label="Previous story" className="inline-flex size-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper">
              <ArrowLeft aria-hidden className="size-4" strokeWidth={1.6} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next story" className="inline-flex size-12 items-center justify-center rounded-full bg-ink text-paper transition-transform hover:scale-105">
              <ArrowRight aria-hidden className="size-4" strokeWidth={1.6} />
            </button>
            <span className="ml-2 text-sm tabular-nums text-mute" aria-live="polite">
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-4 lg:aspect-[4/5]">
          {photos.map((p, k) => (
            <Image
              key={p.src}
              src={p.src}
              alt={k === i ? p.alt : ""}
              aria-hidden={k !== i}
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className={`object-cover transition-[opacity,scale] duration-[1100ms] ease-out-expo ${k === i ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`}
            />
          ))}
        </div>

        <figure key={i} className="swap-in card relative p-7 md:p-10 lg:col-span-5">
          <Quote aria-hidden className="size-8 text-brass" strokeWidth={1.4} />
          <blockquote className="serif mt-5 text-[clamp(1.6rem,2.4vw,2.3rem)] leading-[1.2]">“{h.quote}”</blockquote>
          <figcaption className="mt-8 border-t border-ink/10 pt-5">
            <p className="font-medium text-ink">{h.name}</p>
            <p className="mt-0.5 text-sm text-mute">
              From {h.native} · Resident,{" "}
              <Link href={`/homes/${h.slug}`} className="underline decoration-ink/25 underline-offset-4 hover:text-ink hover:decoration-ink">
                {h.resident}
              </Link>
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
