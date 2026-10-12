import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";
import { ButtonLink, Eyebrow, Reveal } from "@/components/ui";
import { company, homemakers } from "@/lib/site";
import { projectsByHandover } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "From homebuyers to homebuilders: how Disha Habitat began in 2014, the founders behind it, and the five communities built since.",
};

export default function StoryPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our journey"
        title={
          <>
            We began exactly <br className="hidden sm:block" />
            where <em className="text-olive">you are</em> now.
          </>
        }
      >
        Looking for a house that would become a home.
      </PageIntro>

      {/* Journey */}
      <section aria-label="How we began" className="pb-24 md:pb-32">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
          <Reveal as="figure" className="lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden bg-linen">
              <Image
                src="/images/community/site-team.jpg"
                alt="The Disha Habitat site and engineering team seated and standing together on a landscaped lawn"
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-ink-mute">The Disha Habitat family</figcaption>
          </Reveal>
          <Reveal delay={120} className="space-y-6 text-[1.05rem] leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9">
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
            <p className="display text-[1.8rem] leading-tight text-ink">
              Thank you for looking us up. You will find a home with us.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Our core */}
      <section data-tone="dark" aria-labelledby="core-title" className="bg-ink py-24 text-paper md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <Eyebrow className="text-paper/55">Our core</Eyebrow>
            <h2 id="core-title" className="display mt-8 text-[3rem] leading-none sm:text-[4rem]">
              Black <span className="text-paper/45">&amp;</span> <em>White</em>.
            </h2>
          </Reveal>
          <Reveal delay={120} className="display space-y-6 text-[1.7rem] leading-[1.25] text-paper/70 sm:text-[2.1rem] lg:col-span-7 lg:col-start-6">
            <p>Life is colourful. With every hue open to its own interpretation.</p>
            <p>
              Your turmeric yellow could be someone’s mustard, their sea-green could be your teal. You both could be
              right; you both could also be completely off the mark.
            </p>
            <p className="text-paper">
              Then there’s Black. And there’s White. Black is never to be doubted. White is invariably spotless. Both
              definitive. Both unrelenting.
            </p>
            <p>
              We are Disha Habitat. We have no coloured cover-ups. Our promises are inked in Black. Our approach is
              clear White.
            </p>
            <p className="text-paper italic">Bring in your own colours.</p>
          </Reveal>
        </div>
      </section>

      {/* Homemakers */}
      <section aria-labelledby="homemakers-title" className="py-24 md:py-36">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              <Eyebrow className="text-ink-mute">Our homemakers</Eyebrow>
              <h2 id="homemakers-title" className="display mt-6 text-[2.9rem] sm:text-[3.8rem] xl:text-[4.6rem]">
                The people who <em className="text-olive">nurture</em> every home.
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
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-mute">{h.role}</p>
                <h3 className="display mt-3 text-[2.6rem] leading-none">{h.name}</h3>
                <p className="display mt-8 text-[1.6rem] italic leading-snug text-olive">{h.signature}</p>
                <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
                  {h.bio.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal as="figure" className="mt-20">
            <div className="relative aspect-[16/10] overflow-hidden bg-linen md:aspect-[21/9]">
              <Image
                src="/images/community/sales-team.jpg"
                alt="Members of the Disha Habitat team standing together outdoors in front of a gazebo"
                fill
                sizes="100vw"
                className="object-cover object-[50%_35%]"
              />
            </div>
            <figcaption className="mt-3 text-xs text-ink-mute">Members of the Disha Habitat team</figcaption>
          </Reveal>
        </div>
      </section>

      {/* Timeline of communities */}
      <section aria-labelledby="timeline-title" className="bg-paper py-24 md:py-32">
        <div className="shell">
          <Reveal>
            <Eyebrow className="text-ink-mute">Since 2014</Eyebrow>
            <h2 id="timeline-title" className="display mt-6 text-[2.9rem] sm:text-[3.8rem]">
              Five communities, <em className="text-olive">in order</em>.
            </h2>
          </Reveal>
          <ol className="mt-14 border-l border-ink/20 md:grid md:grid-cols-5 md:border-l-0 md:border-t">
            {projectsByHandover.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 80} className="relative pb-10 pl-8 md:pb-0 md:pl-0 md:pr-6 md:pt-10">
                <span
                  aria-hidden
                  className="absolute -left-[5px] top-1.5 size-[9px] rounded-full bg-olive md:-top-[5px] md:left-0"
                />
                <p className="display text-[2.6rem] leading-none text-sun">{p.timeline.start.split(" ")[1]}</p>
                <p className="mt-1 text-[0.68rem] uppercase tracking-[0.14em] text-ink-mute">Construction began</p>
                <h3 className="display mt-4 text-[1.7rem] leading-tight">
                  <Link href={`/homes/${p.slug}`} className="hover:text-olive">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-ink-soft">
                  {p.facts.find((f) => f.label === "Homes")?.value} homes · handover {p.timeline.handover}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Film */}
      <section aria-labelledby="film-title" className="py-24 md:py-32">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <Reveal className="lg:col-span-5">
            <h2 id="film-title" className="display text-[2.9rem] sm:text-[3.6rem]">
              Come home to <em className="text-olive">mindful living spaces</em>.
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-ink-soft">
              Our brand film, with residents, gardens and the everyday life of our communities.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={company.brandFilm.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center justify-center gap-3 bg-ink px-6 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-paper hover:bg-olive-deep"
              >
                Watch on YouTube
                <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <ButtonLink href="/homes" variant="outline">
                Our homes
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
            <a
              href={company.brandFilm.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="img-zoom group relative block aspect-video overflow-hidden bg-linen"
            >
              <Image
                src="/media/brand-film-poster.jpg"
                alt="Still from the Disha Habitat brand film: a stepping-stone path through a tree-lined garden"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/35">
                <span className="inline-flex size-20 items-center justify-center rounded-full bg-paper/90 text-ink">
                  <svg aria-hidden viewBox="0 0 24 24" className="ml-1 size-7 fill-current">
                    <path d="M7 4.5v15l12-7.5z" />
                  </svg>
                </span>
              </span>
              <span className="sr-only">Watch the brand film on YouTube (opens in a new tab)</span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
