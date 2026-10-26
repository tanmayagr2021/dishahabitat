import type { Metadata } from "next";
import { Accordion, Breadcrumbs, CtaBand, PageIntro, Section, SectionHead } from "@/components/ds";
import { ChecklistTool } from "@/components/ChecklistTool";
import { checklist } from "@/lib/checklist";
import { links } from "@/lib/content";
import { pageMeta } from "@/lib/launch";

export const metadata: Metadata = pageMeta({
  title: "The checklist: must-knows while investing in a home",
  description: "Khata certificate, occupancy certificate, carpet area, deviation assessment and sewage treatment plants, explained by Disha Habitat.",
  path: "/checklist",
});

/* Plain definitions of the terms buyers meet most often. */
const words = [
  ["BHK", "Bedroom, hall, kitchen. A 3 BHK home has three bedrooms, a living room and a kitchen."],
  ["RERA", "The Real Estate (Regulation and Development) Act, 2016. A project must be registered with the state’s RERA authority before it is sold, and the registration records its promised completion date."],
  ["Carpet area", "The usable floor area inside a home’s walls. Under RERA, a developer must state each home’s carpet area."],
  ["Super built-up area", "Carpet area plus the walls, balconies and a share of the common areas such as lobbies and the clubhouse."],
  ["OC", "Occupancy certificate: issued by the local authority when a building is complete and fit to live in."],
  ["Khata", "A property’s entry in the city’s tax register. It is not proof of ownership on its own."],
  ["EMI", "Equated monthly instalment: the fixed monthly payment on a home loan, covering interest and part of the loan."],
  ["STP", "Sewage treatment plant: it treats a community’s waste water on site so the water can be reused."],
].map(([title, body]) => ({ title, body }));

export default function ChecklistPage() {
  return (
    <>
      <PageIntro
        above={<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Checklist" }]} />}
        title="Must-knows while investing in a home"
        line="We began as homebuyers, so we know how much there is to learn. Five things every buyer in Bengaluru should understand. Tick them off as you go; your progress stays on this device."
      />
      <Section label="The must-knows" width="measure" space="tight">
        <ChecklistTool items={checklist} />
      </Section>
      <Section tone="surface" width="measure" labelledBy="words-title">
        <SectionHead id="words-title" title="Words you’ll hear" line="The short versions, for when a brochure or a sales call uses them." />
        <Accordion items={words} defaultOpen={null} />
      </Section>
      <CtaBand title="Still have a question?" line="Our team will explain any document for any Disha home, as plainly as you need." actions={[{ label: "Book a visit", href: links.bookVisit }]} />
    </>
  );
}
