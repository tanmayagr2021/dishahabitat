import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { buttonClass, ButtonInner, Reveal } from "@/components/ui";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Our homes",
  description:
    "Five Disha Habitat communities across East Bengaluru — Pursuit of Sunshine, Courtyard, Central Park, Park West and Windsor Gardens.",
};

const value = (p: (typeof projects)[number], label: string) => p.facts.find((f) => f.label === label)?.value;

export default function HomesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our homes"
        title={
          <>
            Five communities.
            <br />
            <em className="text-brass-light">Over a thousand</em> homes.
          </>
        }
        intro="Every Disha Habitat community, from our first 92 homes on Panathur–Varthur Road to Pursuit of Sunshine on Budigere Road. All figures are as published by Disha Habitat."
        image={{
          src: "/images/pursuit-of-sunshine/entrance-aerial.webp",
          alt: "",
          caption: "Disha Pursuit of Sunshine · the entrance plaza from above",
          kind: "photo",
        }}
      />

      <section aria-label="All communities" className="bg-ivory py-20 md:py-32">
        <div className="shell">
          <ol className="space-y-24 md:space-y-40">
            {projects.map((p, i) => {
              const flip = i % 2 === 1;
              return (
                <li key={p.slug}>
                  <article className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
                    <div className={`relative lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""}`}>
                      <Reveal variant="image" className="relative">
                        <Link
                          href={`/homes/${p.slug}`}
                          tabIndex={-1}
                          aria-hidden
                          className="img-zoom relative block aspect-[4/3] overflow-hidden bg-forest-900 lg:aspect-[16/11]"
                        >
                          <Image
                            src={p.cover.src}
                            alt=""
                            fill
                            priority={i === 0}
                            sizes="(min-width: 1024px) 58vw, 100vw"
                            className="object-cover"
                          />
                        </Link>
                      </Reveal>
                      <span
                        aria-hidden
                        className={`display pointer-events-none absolute -top-10 text-[6rem] leading-none text-brass/70 md:-top-16 md:text-[9rem] ${
                          flip ? "right-2 lg:-right-6" : "left-2 lg:-left-6"
                        }`}
                      >
                        {p.index}
                      </span>
                    </div>
                    <Reveal
                      delay={150}
                      className={`lg:col-span-4 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}
                    >
                      <p className="eyebrow flex items-center gap-2 text-ink-mute">
                        <MapPin aria-hidden className="size-3.5 text-brass-deep" strokeWidth={1.5} />
                        {p.locality}
                      </p>
                      <h2 className="display mt-4 text-[2.9rem] leading-[0.92] sm:text-[3.6rem] xl:text-[4.2rem]">
                        <Link href={`/homes/${p.slug}`} className="transition-colors hover:text-brass-deep">
                          {p.name}
                        </Link>
                      </h2>
                      <p className="mt-5 leading-relaxed text-ink-soft">{p.intro}</p>
                      <dl className="mt-8 grid grid-cols-3 border-y border-ink/15">
                        {[
                          ["Homes", value(p, "Homes")],
                          ["Size", value(p, "Project size")],
                          ["Handover", p.timeline.handover],
                        ].map(([k, v]) => (
                          <div key={k} className="border-l border-ink/15 py-4 pl-3 first:border-l-0 first:pl-0">
                            <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink-mute">
                              {k}
                            </dt>
                            <dd className="display mt-1 text-[1.35rem] leading-tight text-ink">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <Link href={`/homes/${p.slug}`} className={buttonClass("dark", "mt-8")}>
                        <ButtonInner>Explore {p.shortName}</ButtonInner>
                      </Link>
                    </Reveal>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* At-a-glance comparison */}
      <section
        data-tone="dark"
        aria-labelledby="glance-title"
        className="topo bg-ink py-20 text-ivory [--topo-opacity:0.18] md:py-28"
      >
        <div className="shell">
          <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="glance-title" className="display text-[2.8rem] sm:text-[3.8rem]">
              At a <em className="text-brass-light">glance</em>
            </h2>
            <p className="max-w-md text-sm text-ivory/60">
              Completion dates are as per each project’s occupancy certificate (OC), as published by Disha Habitat.
            </p>
          </Reveal>
          <Reveal className="mt-10 overflow-x-auto" delay={100}>
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <caption className="sr-only">Comparison of the five Disha Habitat communities</caption>
              <thead>
                <tr className="border-b border-ivory/30 text-[0.64rem] uppercase tracking-[0.18em] text-ivory/55">
                  <th scope="col" className="py-4 pr-4 font-semibold">
                    Community
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Size
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Homes
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Built-up area
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Start
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Completion (OC)
                  </th>
                  <th scope="col" className="py-4 pl-4 font-semibold">
                    Months
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.slug} className="border-b border-ivory/10 transition-colors hover:bg-ivory/[0.03]">
                    <th scope="row" className="py-5 pr-4 font-normal">
                      <Link
                        href={`/homes/${p.slug}`}
                        className="display text-[1.5rem] text-ivory hover:text-brass-light"
                      >
                        {p.name}
                      </Link>
                    </th>
                    <td className="px-4 py-5 text-ivory/75">{value(p, "Project size")}</td>
                    <td className="px-4 py-5 tabular-nums text-ivory/75">{value(p, "Homes")}</td>
                    <td className="px-4 py-5 tabular-nums text-ivory/75">{value(p, "Built-up area")}</td>
                    <td className="px-4 py-5 text-ivory/75">{p.timeline.start}</td>
                    <td className="px-4 py-5 text-ivory/75">{p.timeline.completion}</td>
                    <td className="py-5 pl-4 tabular-nums text-brass-light">{p.timeline.months}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>
    </>
  );
}
