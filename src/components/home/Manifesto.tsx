import Image from "next/image";
import { ArrowLink, Label, Reveal } from "@/components/ui";

/* The founding line is Disha Habitat's own, from dishahabitat.com/our-journey. */
export function Manifesto() {
  return (
    <section data-tone="light" aria-labelledby="manifesto-title" className="relative bg-paper py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 lg:pt-4">
            <Label n="02" className="text-mute">
              Where we began
            </Label>
          </div>

          <div className="lg:col-span-9">
            <Reveal as="h2" className="serif text-[clamp(2.3rem,4.8vw,4.8rem)] leading-[1.04] text-ink">
              <span id="manifesto-title">
                We began exactly where you are right now. Looking for a house that would become a <em>home.</em>
              </span>
            </Reveal>

            <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-9 md:gap-8">
              <Reveal variant="bloom" className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-paper-3 md:col-span-5">
                <Image
                  src="/images/community/leadership-team.jpg"
                  alt="Members of the Disha Habitat team reviewing plans together, one wearing a hard hat"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover object-[60%_50%]"
                />
              </Reveal>
              <Reveal delay={150} className="flex flex-col justify-end md:col-span-4">
                <p className="text-[1.05rem] leading-relaxed text-mute">
                  Homebuyers first, then investors, then builders. Every stumble opened a new window of understanding — and
                  every Disha home since 2014 has been planned by people who remember what it was like to be looking.
                </p>
                <ArrowLink href="/story" className="mt-6 text-ink">
                  Read our story
                </ArrowLink>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
