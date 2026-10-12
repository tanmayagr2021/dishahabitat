import { AffordabilityExplorer } from "@/components/AffordabilityExplorer";
import { ArrowLink, SectionHead } from "@/components/ui";

/* The Home Affordability Explorer, set as a product rather than a form. Figures are illustrative. */
export function PlanSection() {
  return (
    <section id="plan" data-tone="light" aria-labelledby="plan-title" className="surface-stone py-24 md:py-36">
      <div className="shell">
        <SectionHead
          id="plan-title"
          eyebrow="EMI calculator"
          title={["What would your", <em key="e">monthly EMI be?</em>]}
          intro="Enter a price, down payment, rate and tenure. Everything is calculated in your browser and nothing is sent anywhere. Example figures only — not Disha Habitat prices or an offer of finance."
        />
        <div className="mx-auto mt-12 max-w-6xl">
          <AffordabilityExplorer />
        </div>
        <ArrowLink href="/plan" className="mx-auto mt-8 flex w-fit text-ink">
          Open the full-page calculator and its fine print
        </ArrowLink>
      </div>
    </section>
  );
}
