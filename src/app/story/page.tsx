import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AmbientFilm } from "@/components/AmbientFilm";
import { PageHero } from "@/components/PageHero";
import { CoreBand } from "@/components/home/Origins";
import { ArrowLink, Label, Lines, Reveal } from "@/components/ui";
import { Hammer, Megaphone, Scale } from "lucide-react";
import { CountUp } from "@/components/CountUp";
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
      <section data-tone="light" aria-labelledby="events-title" className="layer surface-stone py-16 md:py-24">
        <div className="shell grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-mute">Events and collaborations</p>
            <Lines id="events-title" className="serif mt-5 text-[clamp(2.3rem,3.8vw,3.6rem)] leading-[1.04]" lines={["Evenings the whole", <em key="e">community remembers.</em>]} />
            <p className="mt-5 max-w-md leading-relaxed text-mute">
              Concerts, celebrations and collaborations that bring Disha residents together, as featured on dishahabitat.com.
            </p>
          </div>
          <Reveal variant="mask" className="lg:col-span-6 lg:col-start-7">
            <div className="relative mx-auto aspect-[1084/1456] max-w-md overflow-hidden rounded-2xl shadow-[0_40px_80px_-40px_rgb(21_26_23/0.5)]">
              <Image src="/images/people/events.webp" alt="A collage of event posters and photographs from Disha Habitat community concerts and celebrations" fill sizes="(min-width: 1024px) 28rem, 100vw" className="object-cover" />
            </div>
          </Reveal>
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
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-paper/65">Our homemakers · The Disha family</p>
              <Lines id="family-title" className="serif mt-5 text-[clamp(2.3rem,3.8vw,3.6rem)] leading-[1.04]" lines={["One big family,", <em key="e">close-knit and mindful.</em>]} />
            </div>
            <p className="max-w-sm text-paper/70">The families who live in our homes, and the people who build them.</p>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {dishaFamily.map((f, i) => (
              <Reveal as="li" key={f.src} variant="mask" delay={(i % 4) * 80} className={i === 0 || i === 5 ? "col-span-2 row-span-2" : ""}>
                <figure className="group relative h-full overflow-hidden rounded-xl">
                  <div className={`relative ${i === 0 || i === 5 ? "aspect-square" : "aspect-[4/3]"}`}>
                    <Image src={f.src} alt={f.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105" />
                  </div>
                  <figcaption className="absolute bottom-3 left-3 rounded-full bg-forest-deep/65 px-3 py-1 text-xs backdrop-blur-sm">{f.kind}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
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
