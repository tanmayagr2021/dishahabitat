import Image from "next/image";
import { ArrowLink, Label, Lines, Reveal, RoofMark } from "@/components/ui";
import { homemakers } from "@/lib/site";

/*
 * Philosophy, shown rather than claimed. The founding line and "Our Core" are Disha Habitat's
 * own words (dishahabitat.com/our-journey, /the-core); the photographs are of their own team.
 */
export function Origins() {
  return (
    <>
      <section data-tone="light" aria-labelledby="origins-title" className="surface-ivory overflow-hidden py-24 md:py-36">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Label n="02" className="text-mute">
              Where we began
            </Label>
            <Lines
              id="origins-title"
              className="serif mt-8 text-[clamp(2.8rem,6.2vw,6.6rem)] leading-[0.92] tracking-[-0.025em]"
              lines={["We began exactly", "where you are", <em key="e">right now.</em>]}
            />
            <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-10">
              <Reveal>
                <p className="text-[1.15rem] leading-relaxed text-ink">
                  Looking for a house that would become a home. Homebuyers first, then investors, then builders.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p className="leading-relaxed text-ink/70">
                  Every stumble opened a new window of understanding — and every Disha home since 2014 has been planned by
                  people who remember what it was like to be looking.
                </p>
                <ArrowLink href="/story" className="mt-6 text-ink">
                  Read our story
                </ArrowLink>
              </Reveal>
            </div>

            <figure className="mt-16 max-w-xl border-l-2 border-cyan pl-6">
              <blockquote className="serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1]">{homemakers[0].signature}</blockquote>
              <figcaption className="label mt-4 text-mute">
                {homemakers[0].name} · {homemakers[0].role}
              </figcaption>
            </figure>
          </div>

          {/* Layered photographs: the team at work, and the people on site. */}
          <div className="relative lg:col-span-5 lg:pt-6">
            <Reveal variant="mask" className="parallax relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/community/leadership-team.jpg"
                alt="Members of the Disha Habitat team reviewing plans together, one wearing a hard hat"
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover object-[58%_50%]"
              />
            </Reveal>
            <Reveal
              variant="mask"
              delay={250}
              className="relative -mt-24 ml-auto w-[62%] border-[10px] border-paper md:-mt-32 lg:-ml-20 lg:mr-auto"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/community/site-team.jpg"
                  alt="The Disha Habitat site team seated together outdoors"
                  fill
                  sizes="(min-width: 1024px) 24vw, 60vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <p className="label mt-4 text-mute lg:pl-4">The people who build every Disha home</p>
          </div>
        </div>
      </section>

      <CoreBand />
    </>
  );
}

/* Our Core: the promise, set large on charcoal. Used on the home page and the story page. */
export function CoreBand({ full = false }: { full?: boolean }) {
  return (
    <section data-tone="dark" aria-labelledby="core-title" className="surface-charcoal grain overflow-hidden py-24 md:py-36">
      <div aria-hidden className="gridlines absolute inset-0 -z-10 text-paper" />
      <div className="shell">
        <div className="flex items-center gap-4 text-paper/60">
          <RoofMark className="h-4 w-auto text-cyan" />
          <p className="label">Our core</p>
        </div>
        <h2 id="core-title" className="serif mt-10 text-[clamp(2.8rem,7.4vw,8.4rem)] leading-[0.9] tracking-[-0.03em]">
          <Reveal as="span" className="block">
            Our promises are
          </Reveal>
          <Reveal as="span" delay={100} className="block">
            inked in <span className="text-paper">Black.</span>
          </Reveal>
          <Reveal as="span" delay={200} className="block text-paper/45">
            Our approach is
          </Reveal>
          <Reveal as="span" delay={300} className="block text-paper/45">
            clear <span className="text-brass">White.</span>
          </Reveal>
        </h2>
        <div className="mt-14 grid gap-8 border-t border-paper/15 pt-8 md:grid-cols-12">
          {full ? (
            <div className="space-y-4 text-[1.05rem] leading-relaxed text-paper/70 md:col-span-5">
              <p>Life is colourful. With every hue open to its own interpretation.</p>
              <p>
                Your turmeric yellow could be someone’s mustard, their sea-green could be your teal. You both could be right;
                you both could also be completely off the mark.
              </p>
              <p>
                Then there’s Black. And there’s White. Black is never to be doubted. White is invariably spotless. Both
                definitive. Both unrelenting.
              </p>
            </div>
          ) : (
            <p className="text-[1.05rem] leading-relaxed text-paper/70 md:col-span-5">
              Life is colourful, with every hue open to its own interpretation. Then there’s Black, and there’s White — both
              definitive, both unrelenting.
            </p>
          )}
          <p className="serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-tight md:col-span-6 md:col-start-7">
            Bring in your own colours. <span className="text-paper/50">We have no coloured cover-ups.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
