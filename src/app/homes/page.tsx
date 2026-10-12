import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/ui";
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
      <PageIntro
        eyebrow="Our homes"
        title={
          <>
            Five communities.
            <br />
            <em className="text-olive">Over a thousand</em> homes.
          </>
        }
      >
        Every Disha Habitat community, from our first 92 homes on Panathur–Varthur Road to Pursuit of Sunshine on
        Budigere Road. Figures are as published by Disha Habitat.
      </PageIntro>

      {/* Project index */}
      <section aria-label="All communities" className="pb-24 md:pb-32">
        <div className="shell">
          <ol className="space-y-24 md:space-y-36">
            {projects.map((p, i) => {
              const flip = i % 2 === 1;
              return (
                <Reveal as="li" key={p.slug}>
                  <article className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">
                    <Link
                      href={`/homes/${p.slug}`}
                      className={`img-zoom relative block overflow-hidden bg-linen ${
                        i === 0 ? "aspect-[4/3] lg:aspect-[16/10]" : "aspect-[4/3]"
                      } lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""}`}
                      tabIndex={-1}
                      aria-hidden
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
                    <div className={`lg:col-span-4 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}>
                      <p className="text-[0.7rem] tabular-nums uppercase tracking-[0.16em] text-ink-mute">
                        {p.index} · {p.locality}
                      </p>
                      <h2 className="display mt-4 text-[2.6rem] leading-none sm:text-[3.2rem] xl:text-[3.8rem]">
                        <Link href={`/homes/${p.slug}`} className="hover:text-olive">
                          {p.name}
                        </Link>
                      </h2>
                      <p className="mt-5 leading-relaxed text-ink-soft">{p.intro}</p>
                      <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-ink/15 py-5">
                        {[
                          ["Homes", value(p, "Homes")],
                          ["Size", value(p, "Project size")],
                          ["Handover", p.timeline.handover],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-ink-mute">{k}</dt>
                            <dd className="mt-1 text-sm font-medium text-ink">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <Link
                        href={`/homes/${p.slug}`}
                        className="group mt-8 inline-flex min-h-12 items-center gap-3 border border-ink/25 px-6 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-paper"
                      >
                        Explore {p.shortName}
                        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* At-a-glance comparison */}
      <section aria-labelledby="glance-title" className="bg-paper py-24 md:py-32">
        <div className="shell">
          <Reveal>
            <h2 id="glance-title" className="display text-[2.6rem] sm:text-[3.4rem]">
              At a glance
            </h2>
            <p className="mt-3 max-w-xl text-sm text-ink-mute">
              Completion dates are as per each project’s occupancy certificate (OC), as published by Disha Habitat.
            </p>
          </Reveal>
          <Reveal className="mt-10 overflow-x-auto" delay={100}>
            <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
              <caption className="sr-only">Comparison of the five Disha Habitat communities</caption>
              <thead>
                <tr className="border-b border-ink/30 text-[0.68rem] uppercase tracking-[0.16em] text-ink-mute">
                  <th scope="col" className="py-4 pr-4 font-semibold">Community</th>
                  <th scope="col" className="px-4 py-4 font-semibold">Size</th>
                  <th scope="col" className="px-4 py-4 font-semibold">Homes</th>
                  <th scope="col" className="px-4 py-4 font-semibold">Built-up area</th>
                  <th scope="col" className="px-4 py-4 font-semibold">Start</th>
                  <th scope="col" className="px-4 py-4 font-semibold">Completion (OC)</th>
                  <th scope="col" className="py-4 pl-4 font-semibold">Months</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.slug} className="border-b border-ink/10">
                    <th scope="row" className="py-4 pr-4 font-normal">
                      <Link href={`/homes/${p.slug}`} className="display text-[1.35rem] text-ink hover:text-olive">
                        {p.name}
                      </Link>
                    </th>
                    <td className="px-4 py-4 text-ink-soft">{value(p, "Project size")}</td>
                    <td className="px-4 py-4 tabular-nums text-ink-soft">{value(p, "Homes")}</td>
                    <td className="px-4 py-4 tabular-nums text-ink-soft">
                      {value(p, "Built-up area")}
                    </td>
                    <td className="px-4 py-4 text-ink-soft">{p.timeline.start}</td>
                    <td className="px-4 py-4 text-ink-soft">{p.timeline.completion}</td>
                    <td className="py-4 pl-4 tabular-nums text-ink-soft">{p.timeline.months}</td>
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
