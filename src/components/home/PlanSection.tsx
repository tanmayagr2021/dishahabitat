import { AffordabilityExplorer } from "@/components/AffordabilityExplorer";
import { ArrowLink, Label, Lines } from "@/components/ui";

/* The Home Affordability Explorer, set as a product rather than a form. Figures are illustrative. */
export function PlanSection() {
  return (
    <section id="plan" data-tone="light" aria-labelledby="plan-title" className="surface-stone py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label n="07" className="text-mute">
              Home affordability explorer
            </Label>
            <Lines
              id="plan-title"
              className="serif mt-8 text-[clamp(2.3rem,4.4vw,4.4rem)] leading-[1.02]"
              lines={["What would your", <em key="e">monthly EMI be?</em>]}
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[1.05rem] leading-relaxed text-ink/75">
              Enter a price, down payment, rate and tenure — add your income if you like. Everything is calculated in your
              browser and nothing is sent anywhere.
            </p>
            <p className="label mt-4 text-earth">Example figures only · not Disha Habitat prices or an offer of finance</p>
          </div>
        </div>
        <div className="mt-14 md:mt-20">
          <AffordabilityExplorer />
        </div>
        <ArrowLink href="/plan" className="mt-10 text-ink">
          Open the full-page calculator and its fine print
        </ArrowLink>
      </div>
    </section>
  );
}
