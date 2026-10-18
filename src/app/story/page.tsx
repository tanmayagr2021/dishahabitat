import type { Metadata } from "next";
import { pageMeta } from "@/lib/launch";
import Image from "next/image";
import Link from "next/link";
import { AmbientFilm } from "@/components/AmbientFilm";
import { PageHero } from "@/components/PageHero";
import { ArrowLink, ButtonLink, Lines, Reveal } from "@/components/ui";
import { CountUp } from "@/components/CountUp";
import { FamilyStacks } from "@/components/story/FamilyStacks";
import { GigWall } from "@/components/story/GigWall";
import { ChapterRibbon } from "@/components/story/ChapterRibbon";
import { company, homemakerProfiles, homemakers, poem, stats } from "@/lib/site";
import { projects, projectsByHandover } from "@/lib/projects";

export const metadata: Metadata = pageMeta({
  title: "Our story",
  description:
    "The Disha Habitat story in the founders’ own words: how two homebuyers became builders, and the five communities handed over since 2014.",
  path: "/story",
});

/*
 * A memoir in seven short chapters, told by the two founders. People identify with a brand that
 * started small and kept going (Paharia et al. 2011), and a story that absorbs the reader shifts
 * belief more than claims do (Green & Brock 2000). See docs/RESEARCH-BRIEF.md.
 *
 * DRAFT FOR THE FOUNDERS' APPROVAL: the first-person passages are written from their published
 * profiles and Disha's own pages (dishahabitat.com/our-journey, /homemakers, /the-core). No event
 * is invented; the founders should read and approve the wording before launch.
 */
const toYear = (s: string) => {
  const d = new Date(`1 ${s}`);
  return d.getFullYear() + d.getMonth() / 12;
};
const AXIS = { from: 2014, to: 2026 };
const pct = (y: number) => ((y - AXIS.from) / (AXIS.to - AXIS.from)) * 100;
const axisYears = Array.from({ length: AXIS.to - AXIS.from + 1 }, (_, i) => AXIS.from + i);

const chapters = [
  { id: "ch-1", n: "One", title: "We were homebuyers first" },
  { id: "homemakers", n: "Two", title: "Two very different careers" },
  { id: "ch-3", n: "Three", title: "Ninety-two homes among the palms" },
  { id: "ch-4", n: "Four", title: "Five communities, start to finish" },
  { id: "ch-5", n: "Five", title: "What we promised ourselves" },
  { id: "this-is-us", n: "Six", title: "This is us" },
  { id: "ch-7", n: "Seven", title: "Come and have coffee" },
];

function ChapterHead({ i, tone = "light", id }: { i: number; tone?: "light" | "dark"; id: string }) {
  const c = chapters[i];
  return (
    <div>
      <p className={`font-[family-name:var(--font-caveat)] text-[1.7rem] leading-none ${tone === "dark" ? "text-brass" : "text-earth"}`}>
        Chapter {c.n.toLowerCase()}
      </p>
      <h2 id={id} className="serif mt-3 t-section leading-[1.04] text-balance">
        {c.title}
      </h2>
    </div>
  );
}

export default function StoryPage() {
  const [guna, raja] = homemakers;
  const windsor = projects.find((p) => p.slug === "disha-windsor-gardens")!;

  return (
    <>
      <PageHero
        label="Our story, in the founders’ words"
        title={
          <>
            We began where <em>you are now.</em>
          </>
        }
        intro="Seven short chapters by Gunaranjan J and K Raja Sekhar: how two homebuyers became builders, and what we promised ourselves along the way."
        image={{
          src: "/images/community/site-team.jpg",
          alt: "The Disha Habitat site and engineering team gathered on a landscaped lawn",
          caption: "The Disha Habitat family",
          kind: "photo",
        }}
        imagePosition="50% 35%"
      />

      <ChapterRibbon chapters={chapters} />

      {/* Epigraph: the company's own poem */}
      <section aria-label="Our poem" className="surface-ivory pb-4 pt-16 md:pt-24">
        <div className="shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="serif text-[clamp(1.5rem,2.4vw,2rem)] italic leading-snug text-ink/80">
              {poem.opening.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              <span className="block text-ink/40">…</span>
              <span className="block text-ink">{poem.closing}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Chapter one */}
      <section id="ch-1" data-chapter="ch-1" data-tone="light" aria-labelledby="ch-1-title" className="surface-ivory scroll-mt-24 py-16 md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <ChapterHead i={0} id="ch-1-title" />
            <p className="mt-4 text-sm tabular-nums text-mute">Bengaluru, 2014</p>
          </div>
          <div className="memoir space-y-6 text-[1.15rem] leading-[1.75] text-ink/80 lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="drop-cap">
                We began where you are now: looking for a house that would become a home. We asked the questions every
                buyer asks.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p>
                So we became homebuyers first, then investors, and then, taking the plunge, developers and builders. We learnt
                all of it coming from a place of not knowing. Every stumble opened a new window of understanding, and we
                realised what it takes to keep a promise and meet an expectation.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p>
                That is why every home we plan starts from the buyer’s side of the table. We still remember what it felt like
                to be looking.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Chapter two: the founders */}
      <section id="homemakers" data-chapter="homemakers" data-tone="light" aria-labelledby="ch-2-title" className="layer surface-stone scroll-mt-24 py-16 md:py-24">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <ChapterHead i={1} id="ch-2-title" />
            </div>
            <p className="max-w-md leading-relaxed text-mute lg:col-span-4 lg:col-start-9">
              Neither of us started out in construction. We think that is exactly why we explain everything.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                h: guna,
                voice: [
                  "I spent a decade and a half as a software professional: ERP, SAP, data warehousing, project management, consulting for businesses in the USA. I am also a practising horticulturist, and you will find that in every garden we plant.",
                  "If I ask you to meet me for coffee, it means one of two things. An explanation is owed and I want to give it, or you have a concern and I am bringing a solution. Either way, I want you to leave as informed as any engineer, architect or site supervisor on the project.",
                ],
              },
              {
                h: raja,
                voice: [
                  "I built mobile-tower infrastructure for telecom companies such as Airtel, Vodafone, Idea and Reliance: turnkey civil, electrical, tower and generator commissioning. Then came a long association with HCL Technologies.",
                  "I am a man of few words until the talk turns to what it means to create a mindful living space. Precision is how I work. I will explain the structure plainly until the simple maths of the building is clear, and if you ask, I will tell you I am still learning.",
                ],
              },
            ].map(({ h, voice }, i) => (
              <Reveal as="article" key={h.name} delay={i * 120} className="card overflow-hidden">
                <div className="grid sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
                  <div className="relative aspect-[4/5] sm:aspect-auto">
                    <Image src={h.portrait} alt={`Portrait of ${h.name}`} fill sizes="(min-width: 768px) 22vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex flex-col p-6 md:p-7">
                    <p className="text-sm text-mute">{h.role}</p>
                    <h3 className="serif mt-1 text-[2rem] leading-tight">{h.name}</h3>
                    <blockquote className="serif mt-4 text-[1.25rem] leading-snug text-earth">
                      <em>{h.signature}</em>
                    </blockquote>
                    <div className="mt-4 space-y-3 text-[0.98rem] leading-relaxed text-ink/75">
                      {voice.map((t) => (
                        <p key={t}>{t}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <details className="group border-t border-ink/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-[0.95rem] font-semibold text-forest [&::-webkit-details-marker]:hidden md:px-7">
                    How the team describes {h.short}
                    <span aria-hidden className="text-lg transition-transform group-open:rotate-45">
                      +
                    </span>
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

      {/* The family, under the homemakers (as the revamp proposal asks) */}
      <section data-tone="dark" aria-labelledby="family-title" className="layer surface-forest grain overflow-x-clip py-16 md:py-24">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-4">
            <p className="eyebrow text-paper/65">Our homemakers · The Disha family</p>
            <Lines id="family-title" className="serif mt-5 t-section leading-[1.04]" lines={["One big family,", <em key="e">close-knit and mindful.</em>]} />
            <p className="mt-6 max-w-sm leading-relaxed text-paper/70">
              The families who live in our homes, and the people who build them. Pull up a chair and go through the album.
            </p>
            <p className="mt-6 font-[family-name:var(--font-caveat)] text-[1.6rem] leading-none text-brass">tap a photo for the next one →</p>
          </div>
          <div className="lg:col-span-8">
            <FamilyStacks />
          </div>
        </div>
      </section>

      {/* Chapter three: the first community */}
      <section id="ch-3" data-chapter="ch-3" data-tone="dark" aria-labelledby="ch-3-title" className="layer surface-forest grain scroll-mt-24 py-16 md:py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal variant="mask" className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-6">
            <Image src={windsor.cover.src} alt={windsor.cover.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            <ChapterHead i={2} tone="dark" id="ch-3-title" />
            <div className="mt-6 space-y-5 text-[1.1rem] leading-[1.75] text-paper/80">
              <p>
                Our first community was Windsor Gardens, on Panathur–Varthur Road: {windsor.facts.find((f) => f.label === "Homes")?.value} homes
                on 1.25 acres, among coconut palms.
              </p>
              <p>
                We broke ground in {windsor.timeline.start} and handed over the keys in {windsor.timeline.handover}. It is where everything
                we know began.
              </p>
            </div>
            <ArrowLink href={`/homes/${windsor.slug}`} className="mt-7 text-paper">
              See Windsor Gardens
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* Chapter four: built one at a time, drawn to scale */}
      <section id="ch-4" data-chapter="ch-4" data-tone="dark" aria-labelledby="ch-4-title" className="layer surface-deep grain scroll-mt-24 py-16 md:py-24">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <ChapterHead i={3} tone="dark" id="ch-4-title" />
            </div>
            <p className="max-w-md leading-relaxed text-paper/70 lg:col-span-4 lg:col-start-9">
              Our first four communities sold out without any concentrated
              brand marketing: our homebuyers told their friends. Each bar runs from construction start to completion, as
              published.
            </p>
          </div>

          <div className="mt-14 overflow-x-auto pb-2 md:mt-20">
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
                        <span aria-hidden className="absolute inset-y-1" style={{ left: `${pct(a)}%`, width: `${pct(b) - pct(a)}%`, background: p.hue }} />
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
                  <span key={y} className="label absolute top-3 -translate-x-1/2 tabular-nums text-paper/50" style={{ left: `${pct(y)}%` }}>
                    {y % 2 === 0 && y < AXIS.to ? y : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter five: the promises, as a letter from the founders */}
      <section id="ch-5" data-chapter="ch-5" data-tone="light" aria-labelledby="ch-5-title" className="layer surface-stone scroll-mt-24 py-16 md:py-24">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <ChapterHead i={4} id="ch-5-title" />
          </div>
          <Reveal className="mx-auto mt-10 max-w-3xl">
            <article className="letter relative px-6 pb-10 pt-12 md:px-14 md:pb-14 md:pt-16">
              <span aria-hidden className="letter-tape" />
              <p className="font-[family-name:var(--font-caveat)] text-[1.7rem] leading-none text-ink/80">Dear future neighbour,</p>
              <p className="mt-5 text-[1.08rem] leading-[1.9] text-ink/80">
                Everyone who builds homes makes promises. We wanted ours to be few and plain. So these are the three we
                made ourselves, and still hold ourselves to:
              </p>
              <ol className="mt-6 space-y-5">
                {[
                  ["Explain everything.", "No question is too small. If something needs explaining, we sit down and explain it, over coffee if we can."],
                  ["Build it properly.", "Build quality has always been our biggest strength, and our residents are the ones who tell people so."],
                  ["Price it mindfully.", "Every home, from an apartment to an independent villa, is created, and priced, with the same care."],
                ].map(([t, d], i) => (
                  <li key={t} className="grid grid-cols-[2.2rem_1fr] gap-x-3">
                    <span className="serif text-[2rem] leading-none text-earth">{i + 1}.</span>
                    <span>
                      <span className="serif block text-[1.55rem] leading-tight text-ink">{t}</span>
                      <span className="mt-1 block text-[1rem] leading-[1.8] text-ink/70">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 text-[1.08rem] leading-[1.9] text-ink/80">
                Life is colourful, and every colour is open to interpretation. Your turmeric yellow could be someone’s mustard.
                That is why, when it comes to promises, we only deal in two:
              </p>
              <p className="serif mt-4 text-[clamp(1.6rem,2.6vw,2.1rem)] leading-snug text-ink">
                Our promises are inked in <span className="font-semibold">Black</span>. Our approach is clear White.
              </p>
              <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-dashed border-ink/20 pt-6">
                <div>
                  <p className="text-sm text-mute">With warm regards,</p>
                  <p className="mt-1 font-[family-name:var(--font-caveat)] text-[2.3rem] leading-none text-forest">Guna &amp; Raja</p>
                  <p className="mt-2 text-sm text-mute">Gunaranjan J and K Raja Sekhar, founders</p>
                </div>
                <div className="flex -space-x-3">
                  {homemakers.map((h) => (
                    <span key={h.name} className="relative inline-block size-16 overflow-hidden rounded-full ring-4 ring-[#fbf8f1]">
                      <Image src={h.portrait} alt={`Portrait of ${h.name}`} fill sizes="64px" className="object-cover" />
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* Chapter six: the people */}
      <section id="this-is-us" data-chapter="this-is-us" data-tone="dark" aria-labelledby="ch-6-title" className="layer surface-deep grain scroll-mt-24 py-16 md:py-24">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <ChapterHead i={5} tone="dark" id="ch-6-title" />
            </div>
            <p className="max-w-md leading-relaxed text-paper/70 lg:col-span-4 lg:col-start-9">
              Our homebuyers have been our brand ambassadors from the start. Today more than a thousand families live in Disha
              homes, and the community grows with every project.
            </p>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-5">
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

      {/* The evenings (part of chapter six) */}
      <section data-tone="light" aria-labelledby="events-title" className="layer surface-stone overflow-x-clip py-16 md:py-24">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-mute">Events and collaborations</p>
              <Lines id="events-title" className="serif mt-5 t-section leading-[1.04]" lines={["Evenings the whole", <em key="e">community remembers.</em>]} />
            </div>
            <p className="max-w-md leading-relaxed text-mute lg:col-span-4 lg:col-start-9">
              A home is also the evenings you spend with your neighbours. Some of India’s best-loved artists have been on stage in
              Bengaluru with us.
            </p>
          </div>
          <div className="mt-12">
            <GigWall />
          </div>
        </div>
      </section>

      {/* Chapter seven: the invitation */}
      <section id="ch-7" data-chapter="ch-7" data-tone="light" aria-labelledby="ch-7-title" className="layer surface-ivory scroll-mt-24 py-16 md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-5">
            <ChapterHead i={6} id="ch-7-title" />
            <div className="mt-6 space-y-5 text-[1.12rem] leading-[1.75] text-ink/80">
              <p>
                Thank you for reading this far. If you are looking for a home, we would like to meet you, at Pursuit of the
                Elements in Gunjur or at our office on Whitefield Main Road.
              </p>
              <p className="serif text-[1.8rem] leading-snug text-ink">
                Bring every question. <em>You will find a home with us.</em>
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact#book" className="font-semibold">
                Book a site visit
              </ButtonLink>
              <ArrowLink href="/homes" className="text-ink">
                See our homes
              </ArrowLink>
            </div>
            <p className="mt-3 text-sm text-mute">Gunaranjan J and K Raja Sekhar, founders</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal variant="bloom" className="relative aspect-video overflow-hidden rounded-2xl bg-ink">
              <AmbientFilm label="Disha Habitat brand film, playing silently" />
            </Reveal>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-mute">
              <p>Our brand film: residents, gardens and everyday life, playing silently.</p>
              <ArrowLink href={company.brandFilm.youtubeUrl} external className="text-ink">
                Watch with sound
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
