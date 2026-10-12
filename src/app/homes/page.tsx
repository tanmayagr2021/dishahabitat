import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Label, Lines, Reveal } from "@/components/ui";
import { projects, projectsByHandover } from "@/lib/projects";
import { formatIndian } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our homes",
  description:
    "Five Disha Habitat communities across East Bengaluru — Pursuit of Sunshine, Courtyard, Central Park, Park West and Windsor Gardens.",
};

const value = (p: (typeof projects)[number], label: string) => p.facts.find((f) => f.label === label)?.value ?? "";
const totalHomes = projects.reduce((n, p) => n + Number(value(p, "Homes")), 0);
const maxMonths = Math.max(...projects.map((p) => p.timeline.months));

export default function HomesPage() {
  const newestFirst = [...projectsByHandover].reverse();
  return (
    <>
      <PageHero
        label="Our homes"
        title={
          <>
            Five communities.
            <br />
            <em className="text-paper/55">{formatIndian(totalHomes)} homes.</em>
          </>
        }
        intro="Every Disha Habitat community, from our first 92 homes on Panathur–Varthur Road to Pursuit of Sunshine on Budigere Road. All figures as published by Disha Habitat."
      />

      {/* The index */}
      <section data-tone="dark" aria-label="All communities" className="grain relative bg-ink pb-28 text-paper md:pb-40">
        <div className="shell">
          <ol className="border-b border-paper/15">
            {newestFirst.map((p, i) => (
              <li key={p.slug} className="border-t border-paper/15">
                <Link
                  href={`/homes/${p.slug}`}
                  className="bloom-on-hover group relative grid grid-cols-12 items-center gap-x-4 gap-y-5 py-8 md:py-10"
                >
                  {/* A line in the community's colour draws across on hover. */}
                  <span
                    aria-hidden
                    className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                    style={{ background: p.hue }}
                  />
                  <span className="label col-span-12 flex items-center gap-3 text-paper/55 md:col-span-1">
                    <span className="size-2 rounded-full" style={{ background: p.hue }} />
                    {p.index}
                  </span>
                  <span className="col-span-12 md:col-span-5">
                    <span className="serif block text-[clamp(2.8rem,5.6vw,5.6rem)] leading-[0.9] transition-transform duration-700 ease-out-expo group-hover:translate-x-3">
                      {p.shortName}
                    </span>
                    <span className="mt-3 block text-sm text-paper/60">{p.locality}</span>
                  </span>
                  <dl className="col-span-12 grid grid-cols-3 gap-4 md:col-span-3">
                    {[
                      ["Homes", value(p, "Homes")],
                      ["Land", value(p, "Project size")],
                      ["Handover", String(p.handoverYear)],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="label text-paper/50">{k}</dt>
                        <dd className="serif mt-1.5 text-[1.7rem] leading-none">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <span className="relative col-span-12 block aspect-[16/10] overflow-hidden rounded-[3px] bg-ink-3 md:col-span-3 md:aspect-[4/3]">
                    <ViewTransition name={`cover-${p.slug}`} share="morph" default="none">
                      <span className="absolute inset-0 block">
                        <Image
                          src={p.cover.src}
                          alt=""
                          fill
                          priority={i < 2}
                          sizes="(min-width: 768px) 25vw, 100vw"
                          className="mono-img object-cover transition-[filter,transform] duration-[1200ms] ease-out-expo group-hover:scale-105"
                        />
                      </span>
                    </ViewTransition>
                    <span className="absolute bottom-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-paper text-ink opacity-0 transition-[opacity,transform] duration-500 group-hover:rotate-45 group-hover:opacity-100">
                      <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Time to build */}
      <section data-tone="light" aria-labelledby="pace-title" className="bg-paper py-28 md:py-40">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Label n="01" className="text-mute">
              Built to a clear timeline
            </Label>
            <Lines
              id="pace-title"
              className="serif mt-6 text-[clamp(2.6rem,5vw,4.8rem)]"
              lines={["Ground broken", <em key="e">to keys handed.</em>]}
            />
            <p className="mt-6 max-w-sm leading-relaxed text-mute">
              Months from construction start to completion, as published for each community.
            </p>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {projectsByHandover.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 90} className="border-t border-ink/15 py-5 last:border-b">
                <div className="flex items-baseline justify-between gap-4">
                  <Link href={`/homes/${p.slug}`} className="serif text-[1.9rem] leading-none hover:italic">
                    {p.shortName}
                  </Link>
                  <span className="label text-mute">
                    {p.timeline.start} → {p.timeline.completion}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/8">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(p.timeline.months / maxMonths) * 100}%`, background: p.hue }}
                    />
                  </div>
                  <span className="serif w-24 text-right text-[1.6rem] leading-none tabular-nums">
                    {p.timeline.months}
                    <span className="ml-1 font-sans text-xs text-mute">mo</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* At a glance */}
      <section data-tone="light" aria-labelledby="glance-title" className="bg-paper-2 py-24 md:py-32">
        <div className="shell">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Label n="02" className="text-mute">
                At a glance
              </Label>
              <h2 id="glance-title" className="serif mt-6 text-[clamp(2.4rem,4.4vw,4rem)]">
                Side by side
              </h2>
            </div>
            <p className="max-w-md text-sm text-mute">
              Completion dates are as per each project’s occupancy certificate (OC), as published by Disha Habitat.
            </p>
          </div>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-left text-[0.95rem]">
              <caption className="sr-only">Comparison of the five Disha Habitat communities</caption>
              <thead>
                <tr className="border-b border-ink">
                  {["Community", "Land", "Homes", "Built-up area", "Start", "Completion (OC)", "Months"].map((h, i) => (
                    <th key={h} scope="col" className={`label py-4 font-normal text-mute ${i === 0 ? "pr-4" : "px-4"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projectsByHandover.map((p) => (
                  <tr key={p.slug} className="border-b border-ink/12 transition-colors hover:bg-paper">
                    <th scope="row" className="py-5 pr-4 font-normal">
                      <Link href={`/homes/${p.slug}`} className="flex items-center gap-3">
                        <span aria-hidden className="size-2 rounded-full" style={{ background: p.hue }} />
                        <span className="serif text-[1.6rem] leading-none">{p.shortName}</span>
                      </Link>
                    </th>
                    <td className="px-4 py-5">{value(p, "Project size")}</td>
                    <td className="px-4 py-5 tabular-nums">{value(p, "Homes")}</td>
                    <td className="px-4 py-5 tabular-nums">{value(p, "Built-up area")}</td>
                    <td className="px-4 py-5">{p.timeline.start}</td>
                    <td className="px-4 py-5">{p.timeline.completion}</td>
                    <td className="px-4 py-5 tabular-nums">{p.timeline.months}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
