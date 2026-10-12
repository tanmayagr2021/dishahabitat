import { ButtonLink, SectionHead } from "@/components/ui";
import { InteractiveProjectCard } from "@/components/ProjectCards";
import { getPortfolioItem } from "@/lib/portfolio";

/* The five delivered communities: a calm grid, newest first — two large, then three. */
export function Delivered() {
  const top = ["disha-pursuit-of-sunshine", "disha-courtyard"].map(getPortfolioItem);
  const rest = ["disha-central-park", "disha-park-west", "disha-windsor-gardens"].map(getPortfolioItem);

  return (
    <section data-tone="light" aria-labelledby="delivered-title" className="surface-ivory py-24 md:py-32">
      <div className="shell">
        <SectionHead
          id="delivered-title"
          eyebrow="Delivered"
          title={["Five communities,", <em key="e">handed over.</em>]}
          intro="Each one photographed as it stands today. Open a community for its timeline, its photographs and the words of the families who live there."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 md:gap-6">
          {top.map((p, i) => (
            <InteractiveProjectCard key={p.slug} p={p} aspect="aspect-[4/3]" sizes="(min-width: 768px) 50vw, 100vw" morph delay={i * 100} />
          ))}
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-3 md:mt-6 md:gap-6">
          {rest.map((p, i) => (
            <InteractiveProjectCard key={p.slug} p={p} aspect="aspect-[4/5]" sizes="(min-width: 640px) 33vw, 100vw" morph delay={i * 100} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <ButtonLink href="/homes" variant="outline-dark">
            Compare all communities side by side
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
