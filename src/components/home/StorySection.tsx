import Image from "next/image";
import { ArrowLink, Reveal, SectionMark } from "@/components/ui";
import { homemakers } from "@/lib/site";

export function StorySection() {
  return (
    <section
      data-tone="dark"
      aria-labelledby="story-title"
      className="topo relative overflow-hidden bg-ink py-24 text-ivory [--topo-opacity:0.22] md:py-36"
    >
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionMark n="07" label="Our core" tone="dark" />
          </div>
          <Reveal className="lg:col-span-9">
            <h2 id="story-title" className="display text-[2.8rem] leading-[0.98] sm:text-[4.4rem] xl:text-[6.2rem]">
              Our promises are inked in <em>Black.</em>
              <span className="block text-ivory/40">
                Our approach is clear <em className="text-ivory">White.</em>
              </span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          {/* Layered photographs: the team at work over a quieter site photograph. */}
          <div className="relative lg:col-span-6">
            <Reveal variant="image" className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/12] lg:w-[88%]">
              <Image
                src="/images/community/leadership-team.jpg"
                alt="Members of the Disha Habitat team reviewing plans together, one wearing a hard hat"
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover object-[60%_50%]"
              />
            </Reveal>
            <Reveal
              variant="image"
              delay={250}
              className="relative -mt-20 ml-auto aspect-[4/3] w-[58%] overflow-hidden border-[6px] border-ink sm:-mt-28 lg:-mt-40 lg:w-[52%]"
            >
              <Image
                src="/images/community/site-team.jpg"
                alt="The Disha Habitat site and engineering team gathered on a landscaped lawn"
                fill
                sizes="(min-width: 1024px) 24vw, 56vw"
                className="object-cover"
              />
            </Reveal>
            <p className="mt-4 text-[0.65rem] uppercase tracking-[0.18em] text-ivory/50">The Disha Habitat family</p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <p className="text-[1.1rem] leading-relaxed text-ivory/75">
                We began as prospective homebuyers ourselves — then invested in a home, then took the plunge into realty.
                Every stumble opened a new window of understanding. That humble beginning was in 2014.
              </p>
            </Reveal>
            <ul className="mt-12 space-y-10">
              {homemakers.map((h, i) => (
                <Reveal as="li" key={h.name} delay={i * 120} className="border-t border-ivory/15 pt-8">
                  <p className="display text-[1.7rem] italic leading-snug text-brass-light sm:text-[2rem]">{h.signature}</p>
                  <p className="mt-5 text-sm">
                    <span className="font-semibold text-ivory">{h.name}</span>
                    <span className="text-ivory/55"> · {h.role}</span>
                  </p>
                </Reveal>
              ))}
            </ul>
            <Reveal className="mt-12">
              <ArrowLink href="/story" className="text-ivory">
                Read our story
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
