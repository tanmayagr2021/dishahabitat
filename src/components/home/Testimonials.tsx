"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { homeowners } from "@/lib/site";

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
      className="bg-linen py-24 md:py-32 lg:py-40"
    >
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div data-reveal className="lg:col-span-4">
          <p className="eyebrow flex items-center gap-3 text-ink-mute">
            <span aria-hidden className="h-px w-8 bg-current opacity-40" />
            Homeowners
          </p>
          <h2 id="homeowners-title" className="display mt-6 text-[2.9rem] sm:text-[3.6rem] xl:text-[4.2rem]">
            What a home <em className="text-olive">means</em>…
          </h2>
          <p className="mt-6 max-w-xs leading-relaxed text-ink-soft">
            In their own words: families from across India who have made a Disha Habitat community their home.
          </p>

          <div className="mt-10 hidden lg:block" role="group" aria-label="Choose a homeowner">
            <ol className="space-y-1">
              {homeowners.map((item, i) => (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={i === active ? "true" : undefined}
                    className="group flex min-h-11 w-full items-center gap-4 text-left text-sm text-ink-mute transition-colors hover:text-ink aria-[current=true]:text-ink"
                  >
                    <span className="w-6 text-xs tabular-nums">0{i + 1}</span>
                    <span
                      aria-hidden
                      className="h-px w-6 bg-current transition-all duration-500 group-aria-[current=true]:w-12"
                    />
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div data-reveal className="lg:col-span-7 lg:col-start-6">
          <div
            role="group"
            aria-roledescription="slide"
            aria-label={`${active + 1} of ${count}`}
            aria-live="polite"
            className="relative flex min-h-[26rem] flex-col justify-between border-t border-ink/20 pt-10 sm:min-h-[24rem]"
          >
            <blockquote key={h.name} className="hero-rise">
              <p className="display max-w-3xl text-[1.95rem] leading-[1.12] text-ink sm:text-[2.6rem] xl:text-[3.2rem]">
                “{h.quote}”
              </p>
              <footer className="mt-10 flex flex-col gap-1 text-sm">
                <cite className="not-italic font-semibold tracking-wide text-ink">{h.name}</cite>
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

          <div className="mt-10 flex items-center justify-between border-t border-ink/15 pt-6">
            <p className="text-xs tabular-nums tracking-[0.14em] text-ink-mute">
              <span className="text-ink">0{active + 1}</span> / 0{count}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(active - 1)}
                className="inline-flex size-12 items-center justify-center border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-paper"
                aria-label="Previous homeowner"
              >
                <ArrowLeft className="size-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                className="inline-flex size-12 items-center justify-center border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-paper"
                aria-label="Next homeowner"
              >
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
