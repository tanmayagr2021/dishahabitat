import { AffordabilityExplorer } from "@/components/AffordabilityExplorer";
import { ArrowLink, Reveal, SectionMark } from "@/components/ui";

export function PlanSection() {
  return (
    <section id="plan" aria-labelledby="plan-title" className="bg-stone py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionMark n="06" label="Plan your home" />
            <h2 id="plan-title" className="display mt-8 text-[2.6rem] text-ink sm:text-[3.8rem] xl:text-[5rem]">
              Begin with the numbers, <em className="text-brass-deep">calmly.</em>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <p className="leading-relaxed text-ink-soft">
              A home affordability explorer to help you plan before you visit. Enter your own figures — the example
              values are illustrative and are not Disha Habitat prices.
            </p>
            <ArrowLink href="/plan" className="mt-4 text-ink">
              Open the full planner
            </ArrowLink>
          </Reveal>
        </div>
        <div className="mt-14 lg:mt-20">
          <AffordabilityExplorer />
        </div>
      </div>
    </section>
  );
}
