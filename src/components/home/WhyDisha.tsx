import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { ArrowLink, ButtonLink, Lines, Reveal } from "@/components/ui";
import { HomesBuilt } from "@/components/home/HomesBuilt";
import { elements } from "@/lib/elements";
import { homemakers } from "@/lib/site";

/*
 * Why trust Disha, shown with facts, not adjectives. The promise stays pinned on the left while
 * three proof cards stack over one another on the right; the record of every home follows.
 * The headline is their own manifesto (dishahabitat.com/the-core); founders' words are verbatim.
 */
export function WhyDisha() {
  const [guna, raja] = homemakers;
  return (
    <section data-tone="light" aria-labelledby="why-title" className="layer surface-ivory py-16 md:py-24">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* The promise, pinned */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal as="p" className="eyebrow text-mute">
                Why Disha
              </Reveal>
              <Lines
                id="why-title"
                className="serif mt-5 text-[clamp(2.3rem,3.8vw,3.6rem)] leading-[1.04]"
                lines={["Our promises are inked in Black.", <em key="e">Our approach is clear White.</em>]}
              />
              <Reveal delay={150}>
                <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink/75">
                  We began exactly where you are right now: looking for a house that would become a home. Homebuyers first, then
                  investors, then builders. Here is what that means for you.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <ButtonLink href="/contact#book" className="font-semibold">
                    Book a site visit
                  </ButtonLink>
                  <ArrowLink href="/story" className="text-ink">
                    Read our story
                  </ArrowLink>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Proof, stacking */}
          <div className="space-y-6 lg:col-span-7">
            <article style={{ "--i": 0 } as CSSProperties} className="stack-card grid overflow-hidden rounded-[1.75rem] bg-forest text-paper shadow-[0_30px_70px_-35px_rgb(15_38_32/0.8)] sm:grid-cols-2">
              <div className="flex flex-col p-7 md:p-9">
                <p className="text-sm tabular-nums text-paper/50">01</p>
                <h3 className="serif mt-4 text-[clamp(1.7rem,2.4vw,2.2rem)] leading-tight">Built by former homebuyers</h3>
                <p className="mt-4 text-[1rem] leading-relaxed text-paper/75">
                  Every Disha home since 2014 has been planned by people who remember what it was like to be looking: the questions,
                  the paperwork, the waiting.
                </p>
                <p className="mt-auto pt-8 text-sm text-paper/55">Five communities delivered · 1,102 homes</p>
              </div>
              <div className="relative min-h-[16rem]">
                <Image src="/images/community/site-team.jpg" alt="The Disha Habitat site team seated together outdoors" fill sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
            </article>

            <article style={{ "--i": 1 } as CSSProperties} className="stack-card surface-earth overflow-hidden rounded-[1.75rem] p-7 shadow-[0_30px_70px_-35px_rgb(80_30_15/0.8)] md:p-9">
              <p className="text-sm tabular-nums text-paper/55">02</p>
              <div className="mt-4 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="serif text-[clamp(1.7rem,2.4vw,2.2rem)] leading-tight">Progress you can check</h3>
                  <p className="mt-4 text-[1rem] leading-relaxed text-paper/80">
                    {elements.shortName} publishes photo updates for every tower each quarter. The latest is {elements.latestUpdate}.
                  </p>
                  <a
                    href={elements.updates}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
                  >
                    See construction updates <ArrowUpRight aria-hidden className="size-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
                <ul className="space-y-3 self-end">
                  {elements.rera.map((r) => (
                    <li key={r.no} className="rounded-xl border border-paper/20 bg-black/10 px-4 py-3">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <ShieldCheck aria-hidden className="size-4" strokeWidth={1.7} /> RERA registered · {r.phase}
                      </span>
                      <span className="mt-1 block break-all text-xs text-paper/70">{r.no}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article style={{ "--i": 2 } as CSSProperties} className="stack-card grid overflow-hidden rounded-[1.75rem] bg-ink text-paper shadow-[0_30px_70px_-35px_rgb(0_0_0/0.8)] sm:grid-cols-2">
              <div className="grid min-h-[16rem] grid-cols-2 sm:order-2">
                {[guna, raja].map((h) => (
                  <div key={h.name} className="relative">
                    <Image src={h.portrait} alt={`Portrait of ${h.name}`} fill sizes="(min-width: 1024px) 14vw, 50vw" className="object-cover grayscale" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-xs backdrop-blur-sm">{h.short}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col p-7 md:p-9">
                <p className="text-sm tabular-nums text-paper/50">03</p>
                <h3 className="serif mt-4 text-[clamp(1.7rem,2.4vw,2.2rem)] leading-tight">Founders you can meet</h3>
                <figure className="mt-5">
                  <blockquote className="serif text-[1.45rem] leading-snug text-brass">
                    <em>{guna.signature}</em>
                  </blockquote>
                  <figcaption className="mt-2 text-sm text-paper/65">
                    {guna.name}, {guna.role}
                  </figcaption>
                </figure>
                <figure className="mt-5 border-t border-paper/12 pt-5">
                  <blockquote className="text-[0.98rem] leading-relaxed text-paper/80">{raja.signature}</blockquote>
                  <figcaption className="mt-2 text-sm text-paper/65">
                    {raja.name}, {raja.role}
                  </figcaption>
                </figure>
                <div className="mt-auto flex flex-wrap gap-x-6 pt-6">
                  <ArrowLink href="/contact#book" className="text-paper">
                    Meet them for coffee
                  </ArrowLink>
                  <ArrowLink href="/story#homemakers" className="text-paper/75">
                    Their stories
                  </ArrowLink>
                </div>
              </div>
            </article>
          </div>
        </div>

        <HomesBuilt />
      </div>
    </section>
  );
}
