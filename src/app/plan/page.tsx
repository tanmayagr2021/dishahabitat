import type { Metadata } from "next";
import { AffordabilityExplorer } from "@/components/AffordabilityExplorer";
import { PageHero } from "@/components/PageHero";
import { Label, Reveal } from "@/components/ui";

export const metadata: Metadata = {
  title: "Plan your home",
  description:
    "An illustrative home affordability explorer: estimate a monthly EMI, total interest and repayment from your own figures.",
};

const notes = [
  {
    title: "How the EMI is calculated",
    text: "We use the standard reducing-balance formula: EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P is the loan amount, r the monthly interest rate and n the number of monthly payments. At 0% interest, the EMI is simply P ÷ n.",
  },
  {
    title: "What it doesn’t include",
    text: "Processing fees, insurance, stamp duty, registration, maintenance deposits and changes in floating rates are not included. Lenders may round or schedule payments differently.",
  },
  {
    title: "What it is not",
    text: "This is an illustrative planning tool, not an offer of finance, a loan approval or an eligibility check by Disha Habitat or any lender. Speak to your bank for an actual quote.",
  },
];

export default function PlanPage() {
  return (
    <>
      <PageHero
        label="Plan your home"
        title={
          <>
            Begin with the numbers, <em>calmly.</em>
          </>
        }
        intro="Estimate a monthly EMI, the interest you would pay over the life of a loan, and how each year’s payments divide between principal and interest. Your figures stay in your browser."
      />

      <section data-tone="light" aria-label="Affordability explorer" className="bg-paper py-16 md:py-24">
        <div className="shell">
          <AffordabilityExplorer />
        </div>
      </section>

      <section data-tone="light" aria-labelledby="notes-title" className="bg-paper-2 py-20 md:py-28">
        <div className="shell">
          <Label n="01" className="text-mute">
            The fine print
          </Label>
          <h2 id="notes-title" className="serif mt-6 text-[clamp(2.4rem,4.4vw,4rem)]">
            About these <em>estimates</em>
          </h2>
          <div className="mt-10 grid gap-x-8 md:grid-cols-3">
            {notes.map((n, i) => (
              <Reveal key={n.title} delay={i * 100} className="border-t border-ink py-8">
                <h3 className="text-lg font-medium tracking-tight text-ink">{n.title}</h3>
                <p className="mt-3 leading-relaxed text-mute">{n.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
