import Image from "next/image";
import { ArrowLink, Eyebrow, Reveal } from "@/components/ui";

export function StorySection() {
  return (
    <section data-tone="dark" aria-labelledby="story-title" className="overflow-hidden bg-ink py-24 text-paper md:py-32 lg:py-40">
      <div className="shell">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="text-paper/55">Our core</Eyebrow>
              <h2 id="story-title" className="display mt-8 text-[2.8rem] leading-[1] sm:text-[4rem] xl:text-[5.4rem]">
                Our promises are inked in <span className="italic">Black</span>.
                <span className="mt-2 block text-paper/55">
                  Our approach is clear <span className="italic text-paper">White</span>.
                </span>
              </h2>
            </Reveal>

            <Reveal delay={120} className="mt-12 grid gap-8 text-[1.02rem] leading-relaxed text-paper/75 md:grid-cols-2 lg:mt-16">
              <p>
                Life is colourful, every hue open to its own interpretation. Your turmeric yellow could be someone’s
                mustard. But black is never to be doubted, and white is invariably spotless. We are Disha Habitat. We
                have no coloured cover-ups.
              </p>
              <p>
                We began our journey from exactly where you are right now — looking for a house that would become a
                home. From prospective homebuyers to developers and builders, every stumble opened a new window of
                understanding. <span className="text-paper">Bring in your own colours.</span>
              </p>
            </Reveal>

            <Reveal delay={200} className="mt-10">
              <ArrowLink href="/story" className="text-paper">
                Read our story
              </ArrowLink>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5">
            <Reveal as="figure" delay={150}>
              <div className="relative ml-auto aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11] lg:aspect-[4/5] lg:w-[86%]">
                <Image
                  src="/images/community/leadership-team.jpg"
                  alt="Members of the Disha Habitat team reviewing plans together in an office, one wearing a hard hat"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-[60%_50%] grayscale"
                />
              </div>
              <figcaption className="ml-auto mt-4 flex items-baseline justify-between gap-4 text-xs text-paper/55 lg:w-[86%]">
                <span>The Disha Habitat team</span>
                <span className="tabular-nums">Est. 2014</span>
              </figcaption>
            </Reveal>
            <Reveal
              as="figure"
              delay={300}
              className="relative -mt-24 ml-auto w-[58%] border-[6px] border-ink sm:-mt-32 lg:-mt-48 lg:ml-0 lg:w-[56%]"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src="/images/community/gardening.jpg"
                  alt="Children planting saplings with a gardener in a Disha Habitat community"
                  fill
                  sizes="(min-width: 1024px) 22vw, 55vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
