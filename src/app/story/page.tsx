import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AmbientFilm } from "@/components/AmbientFilm";
import { PageHero } from "@/components/PageHero";
import { BlackWhite } from "@/components/home/BlackWhite";
import { ArrowLink, Label, Lines, Reveal } from "@/components/ui";
import { company, homemakers } from "@/lib/site";
import { projectsByHandover } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "From homebuyers to homebuilders: how Disha Habitat began in 2014, the founders behind it, and the five communities built since.",
};

/* "January 2014" → fractional year, for placing builds on the 2014–2026 axis. */
const toYear = (s: string) => {
  const d = new Date(`1 ${s}`);
  return d.getFullYear() + d.getMonth() / 12;
};
const AXIS = { from: 2014, to: 2026 };
const pct = (y: number) => ((y - AXIS.from) / (AXIS.to - AXIS.from)) * 100;
const axisYears = Array.from({ length: AXIS.to - AXIS.from + 1 }, (_, i) => AXIS.from + i);

export default function StoryPage() {
  return (
    <>
      <PageHero
        label="Our story"
        title={
          <>
            We began where <em>you are now.</em>
          </>
        }
        intro="Looking for a house that would become a home. That humble beginning was in 2014."
        image={{
          src: "/images/community/site-team.jpg",
          alt: "The Disha Habitat site and engineering team gathered on a landscaped lawn",
          caption: "The Disha Habitat family",
          kind: "photo",
        }}
        imagePosition="50% 35%"
      />

      {/* Journey */}
      <section data-tone="light" aria-labelledby="journey-title" className="bg-paper py-28 md:py-40">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Label n="01" className="text-mute">
              Since 2014
            </Label>
            <Lines
              id="journey-title"
              className="serif mt-6 text-[clamp(2.4rem,4.4vw,4.4rem)]"
              lines={["The most fulfilling", <em key="e">learning curve.</em>]}
            />
          </div>
          <div className="space-y-7 text-[1.15rem] leading-relaxed text-mute lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p>
                We realised what it was to keep promises and meet expectations. We learnt all of it coming from a place
                of not knowing. Every stumble opened a new window of understanding.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p>
                From being prospective homebuyers, to investing in a home, to taking the plunge into realty and becoming
                developers and builders — it has been the most fulfilling learning curve.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p>
                It’s been quite a journey since — and a growing community of over 1,000 proud homeowners. We are one big
                family now. Close-knit and mindfully conscious.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="serif pt-4 text-[2.4rem] leading-[1.05] text-ink">
                Thank you for looking us up. <em>You will find a home with us.</em>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Twelve years, five builds, drawn to scale */}
      <section data-tone="dark" aria-labelledby="builds-title" className="relative bg-ink py-28 text-paper md:py-40">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Label n="02" className="text-paper/60">
                Five communities
              </Label>
              <Lines
                id="builds-title"
                className="serif mt-6 text-[clamp(2.4rem,4.8vw,4.8rem)]"
                lines={["Built one at a time,", <em key="e">since 2014.</em>]}
              />
            </div>
            <p className="max-w-sm leading-relaxed text-paper/65 lg:col-span-4 lg:col-start-9">
              Each bar runs from construction start to completion as per the occupancy certificate, as published.
            </p>
          </div>

          <div className="mt-16 overflow-x-auto pb-2 md:mt-24">
            <div className="grid min-w-[46rem] grid-cols-[12rem_1fr] gap-x-6">
              <ol className="contents">
                {projectsByHandover.map((p, i) => {
                  const a = toYear(p.timeline.start);
                  const b = toYear(p.timeline.completion);
                  return (
                    <Reveal as="li" key={p.slug} delay={i * 120} className="col-span-2 grid grid-cols-subgrid items-center border-t border-paper/12 py-4">
                      <Link href={`/homes/${p.slug}`} className="group block">
                        <span className="serif block text-[1.7rem] leading-none group-hover:italic">{p.shortName}</span>
                        <span className="label mt-1.5 block text-paper/50">
                          {p.timeline.months} months · {p.facts.find((f) => f.label === "Homes")?.value} homes
                        </span>
                      </Link>
                      <span className="relative block h-10">
                        {axisYears.map((y) => (
                          <span key={y} aria-hidden className="absolute inset-y-[-1rem] w-px bg-paper/8" style={{ left: `${pct(y)}%` }} />
                        ))}
                        <span
                          aria-hidden
                          className="absolute inset-y-1 rounded-full"
                          style={{ left: `${pct(a)}%`, width: `${pct(b) - pct(a)}%`, background: p.hue }}
                        />
                        <span className="sr-only">
                          {p.timeline.start} to {p.timeline.completion}
                        </span>
                      </span>
                    </Reveal>
                  );
                })}
              </ol>
              <span aria-hidden />
              <div aria-hidden className="relative h-10 border-t border-paper/20">
                {axisYears.map((y) => (
                  <span
                    key={y}
                    className="label absolute top-3 -translate-x-1/2 tabular-nums text-paper/50"
                    style={{ left: `${pct(y)}%` }}
                  >
                    {y % 2 === 0 && y < AXIS.to ? y : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <BlackWhite n="03" full />

      {/* Homemakers */}
      <section data-tone="light" aria-labelledby="homemakers-title" className="bg-paper py-28 md:py-40">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Label n="04" className="text-mute">
                Our homemakers
              </Label>
              <Lines
                id="homemakers-title"
                className="serif mt-6 text-[clamp(2.4rem,4.8vw,4.8rem)]"
                lines={["The people who", <em key="e">nurture every home.</em>]}
              />
            </div>
            <p className="leading-relaxed text-mute lg:col-span-4 lg:col-start-9">
              A home well managed is all credit to the homemaker who nurtures it, with utmost care and consideration.
              Every thought invested in a Disha Habitat home comes from much the same sincerity.
            </p>
          </div>

          <div className="mt-20 grid gap-16 md:grid-cols-2 md:gap-10 lg:gap-16">
            {homemakers.map((h, i) => (
              <Reveal as="article" key={h.name} delay={i * 120} className="border-t border-ink pt-8">
                <p className="serif text-[clamp(2.2rem,3.4vw,3.2rem)] italic leading-[1.05]">{h.signature}</p>
                <h3 className="mt-10 text-[1.15rem] font-medium">{h.name}</h3>
                <p className="label mt-1 text-mute">{h.role}</p>
                <div className="mt-6 space-y-4 leading-relaxed text-mute">
                  {h.bio.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-24 grid gap-3 md:grid-cols-12">
            <Reveal variant="bloom" className="relative aspect-[16/11] overflow-hidden rounded-[3px] md:col-span-7">
              <Image
                src="/images/community/leadership-team.jpg"
                alt="Members of the Disha Habitat team reviewing plans together, one wearing a hard hat"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            </Reveal>
            <Reveal
              variant="bloom"
              delay={150}
              className="relative aspect-[16/11] overflow-hidden rounded-[3px] md:col-span-5 md:aspect-auto"
            >
              <Image
                src="/images/community/sales-team.jpg"
                alt="Members of the Disha Habitat team standing together outdoors in front of a gazebo"
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover object-[50%_35%]"
              />
            </Reveal>
          </div>
          <p className="label mt-4 text-mute">Members of the Disha Habitat team</p>
        </div>
      </section>

      {/* Film */}
      <section data-tone="light" aria-labelledby="film-title" className="bg-paper-2 py-24 md:py-32">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-4">
            <Label n="05" className="text-mute">
              Brand film
            </Label>
            <Lines
              id="film-title"
              className="serif mt-6 text-[clamp(2.6rem,4.4vw,4.4rem)]"
              lines={["Come home to", <em key="e">mindful living spaces.</em>]}
            />
            <p className="mt-6 max-w-sm leading-relaxed text-mute">
              Residents, gardens and everyday life in our communities. Playing silently here.
            </p>
            <ArrowLink href={company.brandFilm.youtubeUrl} external className="mt-6 text-ink">
              Watch with sound on YouTube
            </ArrowLink>
          </div>
          <Reveal variant="bloom" className="relative aspect-video overflow-hidden rounded-[3px] bg-ink lg:col-span-8">
            <AmbientFilm label="Disha Habitat brand film, playing silently" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
