"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionMark } from "@/components/ui";
import { useScrollProgress } from "@/lib/useScrollProgress";

/* Disha Habitat's own words, from dishahabitat.com/our-journey. */
const line =
  "We began our journey from exactly where you are right now. Looking for a house that would become a home.";

export function Manifesto() {
  const textRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  useScrollProgress(textRef, "enter", { end: 0.45 });
  useScrollProgress(frameRef, "enter", { end: 0.15 });

  const words = line.split(" ");

  return (
    <section aria-labelledby="manifesto-title" className="relative bg-ivory pt-24 md:pt-36">
      <div className="shell">
        <div ref={textRef} className="grid gap-10 [--p:1] lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionMark n="01" label="Where we began" />
          </div>
          <h2
            id="manifesto-title"
            className="display text-[2.5rem] leading-[1.02] text-ink sm:text-[3.6rem] lg:col-span-9 xl:text-[5rem]"
          >
            {words.map((w, i) => (
              <span
                key={i}
                className="transition-opacity duration-300"
                style={
                  {
                    opacity: `clamp(0.16, calc(var(--p) * ${words.length * 1.15} - ${i}), 1)`,
                  } as CSSProperties
                }
              >
                {w === "home." ? <em className="text-brass-deep">{w}</em> : w}{" "}
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* The frame opens from an inset window to (almost) full bleed. */}
      <div ref={frameRef} className="mt-16 [--p:1] md:mt-24">
        <figure
          className="relative mx-auto aspect-[4/5] overflow-hidden bg-forest-900 sm:aspect-[16/10] lg:aspect-[16/8]"
          style={{
            width: "calc(100% - (1 - var(--p)) * 22%)",
            clipPath: "inset(calc((1 - var(--p)) * 6%) 0)",
          }}
        >
          <Image
            src="/images/courtyard/pool-court.jpg"
            alt="Disha Courtyard’s white and terracotta blocks around a pool and landscaped lawn at dusk"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ transform: "scale(calc(1.16 - var(--p) * 0.16))" }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 text-ivory sm:flex-row sm:items-end sm:justify-between md:p-10">
            <span>
              <span className="eyebrow block text-brass-light">Disha Courtyard · Hagadur</span>
              <span className="display mt-2 block max-w-xl text-[1.9rem] leading-tight md:text-[2.6rem]">
                264 homes, gathered around a landscaped court.
              </span>
            </span>
            <Link
              href="/homes/disha-courtyard"
              className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-ivory"
            >
              Visit Courtyard
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
