import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AmbientFilm } from "@/components/AmbientFilm";
import { PageHero } from "@/components/PageHero";
import { CoreBand } from "@/components/home/Origins";
import { ArrowLink, Label, Lines, Reveal } from "@/components/ui";
import { Hammer, Megaphone, Scale } from "lucide-react";
import { CountUp } from "@/components/CountUp";
import { EventsLineup } from "@/components/story/EventsLineup";
import { company, dishaFamily, homemakerProfiles, homemakers, stats } from "@/lib/site";
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
const familyGroups = [
  { kind: "Homeowners", line: "The families who live in our homes.", photos: dishaFamily.filter((f) => f.kind === "Homeowners") },
  { kind: "The team", line: "The people who build them.", photos: dishaFamily.filter((f) => f.kind === "The team") },
];
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
      <section data-tone="light" aria-labelledby="journey-title" className="surface-ivory py-16 md:py-24">
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
                developers and builders, it has been the most fulfilling learning curve.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p>
                It’s been quite a journey since, and a growing community of over 1,000 proud homeowners. We are one big
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
      <section data-tone="dark" aria-labelledby="builds-title" className="surface-forest grain relative py-16 md:py-24">
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
                          className="absolute inset-y-1 "
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

      <CoreBand full />

      {/* This is us */}
      <section id="this-is-us" data-tone="dark" aria-labelledby="us-title" className="layer surface-deep grain py-16 md:py-24">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-paper/65">This is us</p>
              <Lines id="us-title" className="serif mt-5 text-[clamp(2.3rem,3.8vw,3.6rem)] leading-[1.04]" lines={["Our homes are truly", <em key="e">where our hearts are.</em>]} />
            </div>
            <ul className="grid gap-5 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
              {[
                { Icon: Megaphone, title: "Sold on word of mouth", text: "Our first four properties sold out without any concentrated brand marketing. Our home buyers have been our ambassadors." },
                { Icon: Hammer, title: "Built with care", text: "Build quality and mindfulness are our biggest strengths, and our resident community of 1,000-plus grows with every project." },
                { Icon: Scale, title: "Priced mindfully", text: "From studio homes to independent villas, every home is created, and priced, with the same care." },
              ].map(({ Icon, title, text }, i) => (
                <Reveal as="li" key={title} delay={i * 90} className="card-dark p-5">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-paper/10">
                    <Icon aria-hidden className="size-5 text-brass" strokeWidth={1.6} />
                  </span>
                  <p className="mt-4 font-semibold">{title}</p>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-paper/70">{text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-5">
            {stats.map((st, i) => (
              <Reveal key={st.label} delay={i * 70} className="flex flex-col-reverse bg-forest-deep/80 p-6">
                <dt className="mt-2 text-sm text-paper/60">{st.label}</dt>
                <dd className="serif text-[clamp(1.8rem,2.8vw,2.6rem)] leading-none tabular-nums">
                  <CountUp value={st.value} suffix={st.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Events and collaborations */}
      <section data-tone="light" aria-labelledby="events-title" className="layer surface-stone py-16 [--poster-h:19rem] md:py-24 md:[--poster-h:23rem]">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-mute">Events and collaborations</p>
              <Lines id="events-title" className="serif mt-5 text-[clamp(2.3rem,3.8vw,3.6rem)] leading-[1.04]" lines={["Evenings the whole", <em key="e">community remembers.</em>]} />
            </div>
            <p className="max-w-md leading-relaxed text-mute lg:col-span-4 lg:col-start-9">
              Some of India’s best-loved artists, on stage in Bengaluru with Disha Habitat. A home is also the evenings you spend
              with your neighbours.
            </p>
          </div>

          <div className="mt-12">
            <EventsLineup />
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <Reveal className="surface-forest overflow-hidden rounded-2xl lg:col-span-7">
              <div className="p-6 md:p-8">
                <p className="label text-brass">Recognition</p>
                <p className="serif mt-3 text-[clamp(1.7rem,2.4vw,2.2rem)] leading-tight">
                  ET Business Awards 2025, <em>Certificate of Excellence.</em>
                </p>
                <p className="mt-3 max-w-lg leading-relaxed text-paper/75">
                  Disha Pursuit of the Elements was named Innovation Real Estate Project of the Year.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 px-6 pb-6 md:px-8 md:pb-8">
                <div className="relative aspect-[16/11] overflow-hidden rounded-lg bg-ink">
                  <Image src="/images/events/et-award-certificate.webp" alt="ET Business Awards 2025 Certificate of Excellence for Disha Pursuit of the Elements" fill sizes="(min-width: 1024px) 22rem, 45vw" className="object-cover" />
                </div>
                <div className="relative aspect-[16/11] overflow-hidden rounded-lg bg-ink">
                  <Image src="/images/events/et-award-stage.webp" alt="Receiving the ET Business Award on stage" fill sizes="(min-width: 1024px) 22rem, 45vw" className="object-cover object-[65%_50%]" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="flex flex-col lg:col-span-5">
              <p className="label text-mute">Backstage with the artists</p>
              <ul className="mt-4 grid flex-1 grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="group relative aspect-[4/3] overflow-hidden rounded-lg lg:aspect-auto">
                    <Image src={`/images/events/backstage-${n}.webp`} alt="The Disha Habitat team with a visiting artist, backstage" fill sizes="(min-width: 1024px) 16rem, 45vw" className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105" />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Homemakers */}
      <section id="homemakers" data-tone="light" aria-labelledby="homemakers-title" className="layer surface-ivory py-16 md:py-24">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-mute">Our homemakers</p>
              <Lines id="homemakers-title" className="serif mt-5 text-[clamp(2.3rem,3.8vw,3.6rem)] leading-[1.04]" lines={["Come along,", <em key="e">meet the homemakers.</em>]} />
            </div>
            <p className="leading-relaxed text-mute lg:col-span-4 lg:col-start-9">
              A home well managed is all credit to the homemaker who nurtures it, with utmost care and consideration. Every thought
              invested in a Disha Habitat home comes from much the same sincerity and compassion.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {homemakers.map((h, i) => (
              <Reveal as="article" key={h.name} delay={i * 120} className="card overflow-hidden">
                <div className="grid sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
                  <div className="relative aspect-[4/5] sm:aspect-auto">
                    <Image src={h.portrait} alt={`Portrait of ${h.name}`} fill sizes="(min-width: 768px) 22vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex flex-col p-6 md:p-7">
                    <p className="text-sm text-mute">{h.role}</p>
                    <h3 className="serif mt-1 text-[2rem] leading-tight">{h.name}</h3>
                    <blockquote className="serif mt-4 text-[1.3rem] leading-snug text-earth">
                      <em>{h.signature}</em>
                    </blockquote>
                    <p className="mt-4 text-[0.98rem] leading-relaxed text-ink/75">{h.bio[0]}</p>
                  </div>
                </div>
                <details className="group border-t border-ink/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-[0.95rem] font-semibold text-forest [&::-webkit-details-marker]:hidden md:px-7">
                    Read {h.short}’s story
                    <span aria-hidden className="text-lg transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="space-y-4 px-6 pb-6 text-[0.98rem] leading-relaxed text-ink/75 md:px-7">
                    {homemakerProfiles[h.name].map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Disha family */}
      <section data-tone="dark" aria-labelledby="family-title" className="layer surface-forest grain py-16 md:py-24">
        <div className="shell">
          <p className="eyebrow text-paper/65">Our homemakers · The Disha family</p>
          <Lines id="family-title" className="serif mt-5 text-[clamp(2.3rem,3.8vw,3.6rem)] leading-[1.04]" lines={["One big family,", <em key="e">close-knit and mindful.</em>]} />

          <div className="mt-12 space-y-14 md:mt-16 md:space-y-20">
            {familyGroups.map((g, gi) => (
              <div key={g.kind}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-paper/15 pt-5">
                  <h3 className="serif text-[clamp(1.6rem,2.2vw,2rem)]">{g.kind}</h3>
                  <p className="text-paper/65">{g.line}</p>
                </div>
                <ul className="mt-6 grid grid-cols-2 gap-3 md:h-[clamp(28rem,42vw,38rem)] md:grid-cols-4 md:grid-rows-2 md:gap-4">
                  {g.photos.map((f, i) => (
                    <Reveal
                      as="li"
                      key={f.src}
                      variant="mask"
                      delay={i * 90}
                      className={`group relative overflow-hidden rounded-xl md:aspect-auto ${
                        i === 0
                          ? `col-span-2 aspect-[4/3] md:row-span-2 ${gi % 2 ? "md:col-start-3 md:row-start-1" : ""}`
                          : i === 1
                            ? "col-span-2 aspect-[2/1]"
                            : "aspect-[4/3]"
                      }`}
                    >
                      <Image
                        src={f.src}
                        alt={f.alt}
                        fill
                        sizes={i === 0 ? "(min-width: 768px) 45vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                        className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
                      />
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Film */}
      <section data-tone="light" aria-labelledby="film-title" className="surface-stone py-16 md:py-24">
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
          <Reveal variant="bloom" className="relative aspect-video overflow-hidden bg-ink lg:col-span-8">
            <AmbientFilm label="Disha Habitat brand film, playing silently" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
