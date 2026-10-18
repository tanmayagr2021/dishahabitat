"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Award, MapPin } from "lucide-react";
import { ButtonLink, Lines, Reveal } from "@/components/ui";
import { elements } from "@/lib/elements";
import { deliveredPortfolio } from "@/lib/portfolio";
import { award } from "@/lib/proof";

/*
 * Our developments, after the reference layout: the project on sale now as the large card, and
 * the delivered communities two at a time beside it, stepped through with the arrows. Facts are
 * the published ones (lib/portfolio.ts).
 */
export function Developments() {
  const [start, setStart] = useState(0);
  const n = deliveredPortfolio.length;
  const pair = [deliveredPortfolio[start % n], deliveredPortfolio[(start + 1) % n]];
  const step = (d: number) => setStart((s) => (s + d + n) % n);

  return (
    <section id="developments" data-tone="dark" aria-labelledby="dev-title" className="layer surface-forest grain py-16 md:py-24">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal as="p" className="eyebrow text-paper/65">
              Our developments
            </Reveal>
            <Lines id="dev-title" className="serif mt-5 t-section leading-[1.04]" lines={["One community selling now.", <em key="e">Five lived in, as proof.</em>]} />
          </div>
          <div className="flex items-center gap-2">
            <p className="mr-3 text-sm tabular-nums text-paper/60" aria-live="polite">
              {String((start % n) + 1).padStart(2, "0")}–{String(((start + 1) % n) + 1).padStart(2, "0")} of {String(n).padStart(2, "0")} delivered
            </p>
            <button type="button" onClick={() => step(-1)} aria-label="Previous communities" className="inline-flex size-12 items-center justify-center rounded-full border border-paper/30 transition-colors hover:bg-paper hover:text-ink">
              <ArrowLeft aria-hidden className="size-4" strokeWidth={1.6} />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next communities" className="inline-flex size-12 items-center justify-center rounded-full bg-paper text-ink transition-transform hover:scale-105">
              <ArrowRight aria-hidden className="size-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Featured: on sale now */}
          <Reveal variant="mask" className="lg:col-span-8">
            <Link href={elements.href} data-cursor="View" className="group relative block aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[34rem]">
              <Image
                src={elements.cover.src}
                alt={elements.cover.alt}
                fill
                sizes="(min-width: 1024px) 64vw, 100vw"
                className="object-cover transition-transform duration-[1600ms] ease-out-expo group-hover:scale-[1.04]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/55 via-45% to-transparent to-75%" />
              <div className="absolute left-5 top-5 flex gap-2 md:left-7 md:top-7">
                <span className="rounded-full bg-cyan px-3 py-1 text-xs font-semibold text-forest-deep">Now selling</span>
                <span className="rounded-full bg-forest-deep/60 px-3 py-1 text-xs font-medium backdrop-blur-sm">Artist’s impression</span>
                <span className="hidden items-center gap-1.5 rounded-full bg-brass px-3 py-1 text-xs font-semibold text-forest-deep sm:inline-flex">
                  <Award aria-hidden className="size-3.5" strokeWidth={2} /> {award.title}: {award.honour}
                </span>
              </div>
              <div className="absolute inset-x-5 bottom-5 md:inset-x-8 md:bottom-8">
                <p className="flex items-center gap-1.5 text-sm text-paper/80">
                  <MapPin aria-hidden className="size-4" strokeWidth={1.6} /> {elements.locality}
                </p>
                <h3 className="serif mt-2 text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.02]">{elements.name}</h3>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 sm:gap-10">
                    {[
                      ["2, 3 & 4 BHK", "Apartments"],
                      ["4 & 5 BHK", "Villas"],
                      ["20 acres", "Land"],
                      ["40+", "Amenities"],
                    ].map(([v, k]) => (
                      <div key={k} className="flex flex-col-reverse">
                        <dt className="mt-1 text-sm text-paper/65">{k}</dt>
                        <dd className="text-[1.05rem] font-medium sm:text-[1.2rem]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <span className="inline-flex size-14 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight aria-hidden className="size-5" strokeWidth={1.6} />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Delivered, two at a time */}
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:gap-6">
            {pair.map((p, k) => (
              <Link
                key={`${p.slug}-${start}`}
                href={p.href}
                data-cursor="View"
                className="swap-in group relative block aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[16.25rem]"
                style={{ animationDelay: `${k * 90}ms` }}
              >
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1600ms] ease-out-expo group-hover:scale-[1.05]"
                  style={{ objectPosition: p.image.position }}
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-forest-deep/60 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  Handed over {p.handoverYear} · lived in today
                </span>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="serif text-[1.8rem] leading-tight">{p.shortName}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-paper/75">
                      <MapPin aria-hidden className="size-3.5" strokeWidth={1.6} />
                      {p.locality.replace(", Bengaluru", "")} · {p.homes} homes
                    </p>
                  </div>
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.6} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-paper/12 pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-[1.02rem] text-paper/75">
            The last few 2, 3 and 4 BHK homes at Pursuit of the Elements are available now. Walk the site, ask us anything,
            and judge for yourself.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact#book" variant="paper" className="font-semibold">
              Book a site visit
            </ButtonLink>
            <ButtonLink href="/homes" variant="outline-light">
              Compare all communities
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
