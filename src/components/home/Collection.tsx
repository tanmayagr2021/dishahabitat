"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { Label, Lines, Reveal } from "@/components/ui";
import { projectsByHandover, type Project } from "@/lib/projects";

/* A tall-format photograph per community, for the panels. */
const panelImage: Record<string, { src: string; position: string; alt: string }> = {
  "disha-windsor-gardens": {
    src: "/images/windsor-gardens/aerial.jpg",
    position: "50% 50%",
    alt: "Aerial view of Disha Windsor Gardens among coconut palms",
  },
  "disha-central-park": {
    src: "/images/central-park/staircase.jpg",
    position: "40% 50%",
    alt: "An open white staircase beside a reflecting pool at Disha Central Park",
  },
  "disha-park-west": {
    src: "/images/park-west/facade.jpg",
    position: "38% 50%",
    alt: "Disha Park West’s mustard and white residential block",
  },
  "disha-courtyard": {
    src: "/images/courtyard/facade-pool.jpg",
    position: "50% 40%",
    alt: "A Disha Courtyard tower rising behind the pool deck and palms",
  },
  "disha-pursuit-of-sunshine": {
    src: "/images/pursuit-of-sunshine/towers.webp",
    position: "30% 50%",
    alt: "The two residential towers of Disha Pursuit of Sunshine",
  },
};

const fact = (p: Project, label: string) => p.facts.find((f) => f.label === label)?.value ?? "";

function Stats({ p }: { p: Project }) {
  return (
    <dl className="grid grid-cols-3 gap-4 border-t border-paper/20 pt-4">
      {[
        ["Homes", fact(p, "Homes")],
        ["Land", fact(p, "Project size")],
        ["Handover", String(p.handoverYear)],
      ].map(([k, v]) => (
        <div key={k}>
          <dt className="label text-paper/55">{k}</dt>
          <dd className="serif mt-1.5 text-[1.6rem] leading-none xl:text-[1.9rem]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Collection() {
  const items = projectsByHandover;
  const [active, setActive] = useState(items.length - 1);

  return (
    <section data-tone="dark" aria-labelledby="collection-title" className="grain relative bg-ink pb-6 pt-28 text-paper md:pt-40">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 lg:pt-4">
            <Label n="02" className="text-paper/60">
              The collection
            </Label>
          </div>
          <Lines
            id="collection-title"
            className="serif text-[clamp(2.8rem,6.4vw,6.6rem)] lg:col-span-9"
            lines={[
              "Five communities,",
              <em key="e" className="text-paper/55">
                built one at a time.
              </em>,
            ]}
          />
        </div>
      </div>

      {/* Desktop: an expanding row. The active panel opens and comes into colour. */}
      <div className="shell mt-16 hidden lg:block xl:mt-20">
        <ul className="flex h-[min(84svh,52rem)] gap-2">
          {items.map((p, i) => {
            const on = i === active;
            const img = panelImage[p.slug];
            return (
              <li
                key={p.slug}
                className="relative min-w-0 transition-[flex-grow] duration-[1100ms] ease-out-expo"
                style={{ flexGrow: on ? 7 : 1, flexBasis: 0 }}
              >
                <Link
                  href={`/homes/${p.slug}`}
                  data-active={on}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group absolute inset-0 block overflow-hidden rounded-[3px] bg-ink-3 outline-offset-4"
                  aria-label={`${p.name} — ${p.locality}, ${fact(p, "Homes")} homes, handover ${p.handoverYear}`}
                >
                  <ViewTransition name={`cover-${p.slug}`} share="morph" default="none">
                    <div className="mono-img absolute inset-0">
                      <Image
                        src={img.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 70vw, 100vw"
                        className={`object-cover transition-[transform,filter] duration-[1400ms] ease-out-expo ${on ? "scale-100" : "scale-110 brightness-75"}`}
                        style={{ objectPosition: img.position }}
                      />
                    </div>
                  </ViewTransition>
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />

                  {/* Collapsed: a vertical spine. */}
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-between py-6 transition-opacity duration-500 ${on ? "opacity-0" : "opacity-100 delay-300"}`}
                  >
                    <span className="label text-paper/70">{p.index}</span>
                    <span className="serif rotate-180 whitespace-nowrap text-[2rem] leading-none [writing-mode:vertical-rl]">
                      {p.shortName}
                    </span>
                    <span className="size-2 rounded-full" style={{ background: p.hue }} />
                  </span>

                  {/* Open: the story. */}
                  <span
                    className={`absolute inset-x-0 bottom-0 block p-8 transition-[opacity,transform] duration-700 ease-out-expo xl:p-10 ${
                      on ? "translate-y-0 opacity-100 delay-300" : "pointer-events-none translate-y-6 opacity-0"
                    }`}
                  >
                    <span className="flex items-end justify-between gap-8">
                      <span className="block min-w-0">
                        <span className="label flex items-center gap-3 text-paper/75">
                          <span className="h-[3px] w-10 rounded-full" style={{ background: p.hue }} />
                          {p.index} · {p.locality}
                        </span>
                        <span className="serif mt-4 block whitespace-nowrap text-[clamp(3.4rem,5.4vw,6rem)] leading-[0.9]">
                          {p.shortName}
                        </span>
                      </span>
                      <span className="mb-2 inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:rotate-45">
                        <ArrowUpRight className="size-5" strokeWidth={1.5} />
                      </span>
                    </span>
                    <span className="mt-6 block max-w-xl">
                      <Stats p={p} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile & tablet: a stack of cards that come into colour as they arrive. */}
      <ul className="shell mt-12 grid gap-3 sm:grid-cols-2 lg:hidden">
        {[...items].reverse().map((p, i) => {
          const img = panelImage[p.slug];
          return (
            <li key={p.slug} className={i === 0 ? "sm:col-span-2" : ""}>
              <Link href={`/homes/${p.slug}`} className="group block">
                <Reveal
                  variant="bloom"
                  className={`relative overflow-hidden rounded-[3px] bg-ink-3 ${i === 0 ? "aspect-[4/5] sm:aspect-[16/10]" : "aspect-[4/5]"}`}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: img.position }}
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 block p-5">
                    <span className="label flex items-center gap-2 text-paper/75">
                      <span className="h-[3px] w-6 rounded-full" style={{ background: p.hue }} />
                      {p.handoverYear} · {p.locality}
                    </span>
                    <span className="serif mt-2 block text-[2.6rem] leading-[0.95]">{p.shortName}</span>
                    <span className="mt-4 block">
                      <Stats p={p} />
                    </span>
                  </span>
                </Reveal>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
