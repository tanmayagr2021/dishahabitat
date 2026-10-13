import Image from "next/image";
import { ArrowLink, Reveal, SectionHead } from "@/components/ui";
import { HomesBuilt } from "@/components/home/HomesBuilt";
import { elements } from "@/lib/elements";
import { homemakers } from "@/lib/site";

/*
 * Why trust Disha, shown with facts, not adjectives. The headline is their own manifesto
 * (dishahabitat.com/the-core); every card rests on something published: the founding story,
 * each community's build time, the Elements construction updates and RERA numbers, and the
 * founder's own invitation.
 */

export function WhyDisha() {
  const guna = homemakers[0];
  return (
    <section data-tone="dark" aria-labelledby="why-title" className="surface-forest grain py-24 md:py-32">
      <div className="shell">
        <SectionHead
          id="why-title"
          tone="dark"
          eyebrow="Why Disha"
          title={["Our promises are inked in Black.", <em key="e">Our approach is clear White.</em>]}
          intro="We began exactly where you are right now: looking for a house that would become a home. Homebuyers first, then investors, then builders."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          <Reveal className="card-dark flex flex-col overflow-hidden">
            <div className="relative aspect-[16/10]">
              <Image
                src="/images/community/leadership-team.jpg"
                alt="Members of the Disha Habitat team reviewing plans together, one wearing a hard hat"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover object-[58%_45%]"
              />
            </div>
            <div className="p-6">
              <h3 className="serif text-[1.6rem] leading-tight">Built by former homebuyers</h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-paper/75">
                Every Disha home since 2014 has been planned by people who remember what it was like to be looking.
              </p>
            </div>
          </Reveal>

          <Reveal delay={90} className="card-dark flex flex-col p-6">
            <h3 className="serif text-[1.6rem] leading-tight">Progress you can check</h3>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-paper/75">
              {elements.shortName} publishes construction updates for every tower each quarter. The latest is {elements.latestUpdate}.
              Both phases are RERA-registered.
            </p>
            <ul className="mt-auto space-y-2 pt-6 text-xs text-paper/60">
              {elements.rera.map((r) => (
                <li key={r.no} className="rounded-lg border border-paper/10 px-3 py-2">
                  <span className="block text-paper/85">RERA · {r.phase}</span>
                  {r.no}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={180} className="card-dark flex flex-col p-6">
            <h3 className="serif text-[1.6rem] leading-tight">Founders you can meet</h3>
            <blockquote className="serif mt-4 text-[1.5rem] leading-snug text-brass">
              <em>{guna.signature}</em>
            </blockquote>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-paper/75">
              {guna.name}’s invitation: he’ll explain something properly, until you leave as informed as any engineer on the
              project.
            </p>
            <ArrowLink href="/story" className="mt-auto pt-6 text-paper">
              Read our story
            </ArrowLink>
          </Reveal>
        </div>
        <HomesBuilt />
      </div>
    </section>
  );
}
