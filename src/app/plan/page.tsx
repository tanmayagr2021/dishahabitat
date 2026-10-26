import type { Metadata } from "next";
import { Accordion, Breadcrumbs, PageIntro, Section, SectionHead } from "@/components/ds";
import { AffordabilityExplorer } from "@/components/AffordabilityExplorer";
import { pageMeta } from "@/lib/launch";

export const metadata: Metadata = pageMeta({
  title: "EMI calculator",
  description: "Estimate a monthly EMI, total interest and repayment from your own figures. Illustrative only; nothing you enter leaves your browser.",
  path: "/plan",
});

const notes = [
  {
    title: "How the EMI is calculated",
    body: "We use the standard reducing-balance formula: EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P is the loan amount, r the monthly interest rate and n the number of monthly payments. At 0% interest, the EMI is simply P ÷ n.",
  },
  {
    title: "What it doesn’t include",
    body: "GST, processing fees, insurance, stamp duty, registration, maintenance deposits and changes in floating rates are not included. Banks usually lend at most 75 to 90% of a home’s value, depending on the loan size. Lenders may round or schedule payments differently.",
  },
  {
    title: "What it is not",
    body: "This is an illustrative planning tool, not an offer of finance, a loan approval or an eligibility check by Disha Habitat or any lender. Speak to your bank for an actual quote.",
  },
];

export default function PlanPage() {
  return (
    <>
      <PageIntro
        above={<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "EMI calculator" }]} />}
        title="What would your monthly EMI be?"
        line="Enter a home price, down payment, interest rate and tenure. The estimate updates as you type, and your figures never leave your browser."
      />
      <Section label="EMI calculator" space="tight">
        <AffordabilityExplorer />
      </Section>
      <Section tone="surface" width="measure" labelledBy="notes-title">
        <SectionHead id="notes-title" title="About these estimates" />
        <Accordion items={notes} defaultOpen={null} />
      </Section>
    </>
  );
}
