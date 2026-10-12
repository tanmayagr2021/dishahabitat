import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AmbientFilm } from "@/components/AmbientFilm";
import { PageHero } from "@/components/PageHero";
import { ArrowLink, Reveal, SectionMark } from "@/components/ui";
import { company, homemakers } from "@/lib/site";
import { projectsByHandover } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "From homebuyers to homebuilders: how Disha Habitat began in 2014, the founders behind it, and the five communities built since.",
};

const core = [
  { text: "Life is colourful. With every hue open to its own interpretation.", tone: "text-ivory/45" },
  {
    text: "Your turmeric yellow could be someone’s mustard, their sea-green could be your teal. You both could be right; you both could also be completely off the mark.",
    tone: "text-ivory/45",
  },
  {
    text: "Then there’s Black. And there’s White. Black is never to be doubted. White is invariably spotless. Both definitive. Both unrelenting.",
    tone: "text-ivory",
  },
  {
    text: "We are Disha Habitat. We have no coloured cover-ups. Our promises are inked in Black. Our approach is clear White.",
    tone: "text-ivory/80",
  },
];

export default function StoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Our journey"
        title={
          <>
            We began exactly
            <br />
            where <em className="text-brass-light">you are</em> now.
          </>
        }
        intro="Looking for a house that would become a home."
        image={{
          src: "/images/community/site-team.jpg",
          alt: "The Disha Habitat site and engineering team gathered on a landscaped lawn",
          caption: "The Disha Habitat family",
          kind: "photo",
        }}
        imagePosition="50% 35%"
      />

      {/* Journey */}
      <section aria-labelledby="journey-title" className="bg-ivory py-20 md:py-32">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <SectionMark n="01" label="Since 2014" />
            <h2 id="journey-title" className="display mt-8 text-[2.8rem] sm:text-[3.6rem]">
              The most fulfilling <em className="text-brass-deep">learning curve.</em>
            </h2>
          </Reveal>
          <Reveal delay={120} className="space-y-6 text-[1.1rem] leading-relaxed text-ink-soft lg:col-span-6 lg:col-start-7">
            <p>
              We realised what it was to keep promises and meet expectations. We learnt all of it coming from a place
              of not knowing. Every stumble opened a new window of understanding.
            </p>
            <p>
              From being prospective homebuyers, to investing in a home, to taking the plunge into realty and becoming
              developers and builders, it has been the most fulfilling learning curve.
            </p>
            <p>
              That humble beginning was in the year 2014. It’s been quite a journey since — and a growing community of
              over 1,000 proud homeowners. We are one big family now. Close-knit and mindfully conscious.
            </p>
            <p className="display pt-4 text-[2rem] leading-tight text-ink">
              Thank you for looking us up. You will find a home with us.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Our core */}
      <section data-tone="dark" aria-labelledby="core-title" className="topo bg-ink py-24 text-ivory [--topo-opacity:0.2] md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <SectionMark n="02" label="Our core" tone="dark" />
            <h2 id="core-title" className="display mt-8 text-[3.6rem] leading-none sm:text-[5rem]">
              Black <span className="text-ivory/35">&amp;</span> <em>White.</em>
            </h2>
          </Reveal>
          <div className="space-y-8 lg:col-span-7 lg:col-start-6">
            {core.map((c, i) => (
              <Reveal key={i} delay={i * 80}>
                <p className={`display text-[1.8rem] leading-[1.2] sm:text-[2.3rem] ${c.tone}`}>{c.text}</p>
              </Reveal>
            ))}
            <Reveal delay={360}>
              <p className="display text-[2.6rem] italic leading-tight text-brass-light sm:text-[3.4rem]">
                Bring in your own colours.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Homemakers */}
      <section aria-labelledby="homemakers-title" className="bg-ivory py-24 md:py-36">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              <SectionMark n="03" label="Our homemakers" />
              <h2 id="homemakers-title" className="display mt-8 text-[2.8rem] sm:text-[4rem] xl:text-[4.8rem]">
                The people who <em className="text-brass-deep">nurture</em> every home.
              </h2>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-4 lg:col-start-9">
              <p className="leading-relaxed text-ink-soft">
                A home well managed is all credit to the homemaker who nurtures it, with utmost care and consideration.
                Every thought invested in a Disha Habitat home comes from much the same sincerity.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-10 lg:gap-16">
            {homemakers.map((h, i) => (
              <Reveal as="article" key={h.name} delay={i * 120} className="border-t border-ink/20 pt-8">
                <p className="eyebrow text-ink-mute">{h.role}</p>
                <h3 className="display mt-3 text-[2.8rem] leading-none">{h.name}</h3>
                <p className="display mt-8 text-[1.8rem] italic leading-snug text-brass-deep">{h.signature}</p>
                <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
                  {h.bio.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 grid gap-4 md:grid-cols-12">
            <Reveal variant="image" className="relative aspect-[16/11] overflow-hidden md:col-span-7">
              <Image
                src="/images/community/leadership-team.jpg"
                alt="Members of the Disha Habitat team reviewing plans together, one wearing a hard hat"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            </Reveal>
            <Reveal variant="image" delay={150} className="relative aspect-[16/11] overflow-hidden md:col-span-5 md:aspect-auto">
              <Image
                src="/images/community/sales-team.jpg"
                alt="Members of the Disha Habitat team standing together outdoors in front of a gazebo"
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover object-[50%_35%]"
              />
            </Reveal>
          </div>
          <p className="mt-3 text-xs text-ink-mute">Members of the Disha Habitat team</p>
        </div>
      </section>

      {/* Timeline */}
      <section data-tone="dark" aria-labelledby="timeline-title" className="topo bg-forest-900 py-24 text-ivory [--topo-opacity:0.35] md:py-32">
        <div className="shell">
          <Reveal>
            <SectionMark n="04" label="Five communities" tone="dark" />
            <h2 id="timeline-title" className="display mt-8 text-[2.8rem] sm:text-[4rem]">
              Built one at a time, <em className="text-brass-light">since 2014.</em>
            </h2>
          </Reveal>
          <ol className="mt-16 border-l border-ivory/20 md:grid md:grid-cols-5 md:border-l-0 md:border-t">
            {projectsByHandover.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 90} className="relative pb-12 pl-8 md:pb-0 md:pl-0 md:pr-6 md:pt-12">
                <span aria-hidden className="absolute -left-[5px] top-2 size-[9px] rounded-full bg-brass-light md:-top-[5px] md:left-0" />
                <p className="display text-[3.4rem] leading-none text-brass-light">{p.timeline.start.split(" ")[1]}</p>
                <p className="eyebrow mt-2 text-ivory/50">Construction began</p>
                <h3 className="display mt-5 text-[1.8rem] leading-tight">
                  <Link href={`/homes/${p.slug}`} className="hover:text-brass-light">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-ivory/65">
                  {p.facts.find((f) => f.label === "Homes")?.value} homes · handover {p.timeline.handover}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Film */}
      <section aria-labelledby="film-title" className="bg-stone py-24 md:py-32">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <Reveal className="lg:col-span-5">
            <SectionMark n="05" label="Brand film" />
            <h2 id="film-title" className="display mt-8 text-[2.8rem] sm:text-[3.8rem]">
              Come home to <em className="text-brass-deep">mindful living spaces.</em>
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-ink-soft">
              Residents, gardens and everyday life in our communities. Playing silently here; watch it with sound on
              YouTube.
            </p>
            <div className="mt-8">
              <ArrowLink href={company.brandFilm.youtubeUrl} external className="text-ink">
                Watch with sound
              </ArrowLink>
            </div>
          </Reveal>
          <Reveal variant="image" delay={120} className="relative aspect-video overflow-hidden bg-forest-900 lg:col-span-7">
            <AmbientFilm label="Disha Habitat brand film, playing silently" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
