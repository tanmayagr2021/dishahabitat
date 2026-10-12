"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ButtonLink, Label } from "@/components/ui";
import { elements } from "@/lib/elements";

/*
 * The project on sale now, in its own colour. A viewer lets the visitor walk through the
 * renders (towers, clubhouse, lawns, homes) without leaving the page.
 */
const views = [
  { tab: "Towers", media: elements.cover },
  ...(
    [
      ["Clubhouse", "clubhouse"],
      ["Play lawn", "play-lawn"],
      ["Amphitheatre", "amphitheatre"],
      ["Villas", "villas"],
      ["Living room", "living"],
      ["Outdoor café", "outdoor-cafe"],
    ] as const
  ).map(([tab, file]) => ({ tab, media: elements.gallery.find((g) => g.src.includes(`/${file}.`))! })),
];

export function NowSelling() {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((n) => (n + d + views.length) % views.length);

  return (
    <section data-tone="light" aria-labelledby="now-title" className="relative overflow-hidden bg-elements py-24 text-ink md:py-32">
      {/* Five elements, set large behind the section. */}
      <p
        aria-hidden
        className="serif pointer-events-none absolute -right-[4vw] top-10 hidden select-none whitespace-nowrap text-[12vw] italic leading-none text-ink/[0.06] lg:block"
      >
        Space · Fire · Air · Water · Earth
      </p>

      <div className="shell relative">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <Label n="01" className="text-ink/70">
              Now selling in Gunjur, East Bengaluru
            </Label>
            <h2 id="now-title" className="serif mt-5 text-[clamp(2.8rem,6vw,6rem)]">
              {elements.shortName}.
              <br />
              <em>{elements.tagline}</em>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <p className="inline-flex items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-[0.92rem] text-paper">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-elements opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-elements" />
              </span>
              {elements.offer}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Viewer */}
          <div className="min-w-0 lg:col-span-8">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-ink shadow-[0_50px_100px_-50px_rgb(20_10_60/0.7)]">
              {views.map((v, n) => (
                <Image
                  key={v.media.src}
                  src={v.media.src}
                  alt={v.media.alt}
                  fill
                  sizes="(min-width: 1024px) 64vw, 100vw"
                  aria-hidden={n !== i}
                  className={`object-cover transition-[opacity,transform] duration-[900ms] ease-out-expo ${
                    n === i ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                  }`}
                />
              ))}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="label absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 text-[0.6rem] text-paper backdrop-blur-sm">
                Artist’s impression
              </span>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-paper md:inset-x-6 md:bottom-5">
                <p aria-live="polite" className="text-[0.95rem]">
                  <span className="tabular-nums text-paper/60">
                    {String(i + 1).padStart(2, "0")}/{String(views.length).padStart(2, "0")}
                  </span>{" "}
                  {views[i].media.caption}
                </p>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                    className="inline-flex size-11 items-center justify-center rounded-full bg-paper/15 backdrop-blur-md transition-colors hover:bg-paper hover:text-ink"
                  >
                    <ArrowLeft aria-hidden className="size-4" strokeWidth={1.6} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next image"
                    className="inline-flex size-11 items-center justify-center rounded-full bg-paper text-ink transition-transform hover:scale-105"
                  >
                    <ArrowRight aria-hidden className="size-4" strokeWidth={1.6} />
                  </button>
                </div>
              </div>
            </div>

            <div role="group" aria-label="Choose a view" className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
              {views.map((v, n) => (
                <button
                  key={v.tab}
                  type="button"
                  aria-pressed={n === i}
                  onClick={() => setI(n)}
                  className={`group flex shrink-0 items-center gap-2.5 rounded-full p-1 pr-4 text-[0.88rem] transition-colors ${
                    n === i ? "bg-ink text-paper" : "bg-paper/35 hover:bg-paper/70"
                  }`}
                >
                  <span className="relative block size-8 overflow-hidden rounded-full">
                    <Image src={v.media.src} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                  {v.tab}
                </button>
              ))}
            </div>
          </div>

          {/* Facts and actions */}
          <div className="flex min-w-0 flex-col gap-7 lg:col-span-4">
            <p className="text-[1.08rem] leading-relaxed">{elements.intro}</p>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[8px] bg-ink/15">
              {elements.facts.map((f) => (
                <div key={f.label} className="bg-paper/45 p-4">
                  <dt className="label text-ink/65">{f.label}</dt>
                  <dd className="serif mt-1.5 text-[1.45rem] leading-tight">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={elements.href}>Explore the project</ButtonLink>
              <ButtonLink href={`${elements.href}#enquire`} variant="outline-dark">
                Book a site visit
              </ButtonLink>
            </div>
            <p className="text-xs leading-relaxed text-ink/65">
              {elements.offer}, as announced by Disha Habitat. RERA:{" "}
              {elements.rera.map((r) => `${r.phase} ${r.no}`).join(" · ")}. All images are artist’s impressions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
