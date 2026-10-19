import type { Metadata } from "next";
import { pageMeta } from "@/lib/launch";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ComposeButton } from "@/components/ComposeButton";
import { ChecklistTool } from "@/components/ChecklistTool";
import { Lines } from "@/components/ui";
import { checklist } from "@/lib/checklist";

export const metadata: Metadata = pageMeta({
  title: "The checklist: must-knows while investing in a home",
  description: "Khata certificate, occupancy certificate, carpet area, deviation assessment and sewage treatment plants, explained by Disha Habitat.",
  path: "/checklist",
});

/* Plain definitions of the terms buyers meet most often; the long versions are in the checklist above. */
const words: [string, string][] = [
  ["BHK", "Bedroom, hall, kitchen. A 3 BHK home has three bedrooms, a living room and a kitchen."],
  ["RERA", "The Real Estate (Regulation and Development) Act, 2016. A project must be registered with the state’s RERA authority before it is sold, and the registration records its promised completion date."],
  ["Carpet area", "The usable floor area inside a home’s walls. Under RERA, a developer must state each home’s carpet area."],
  ["Super built-up area", "Carpet area plus the walls, balconies and a share of the common areas such as lobbies and the clubhouse."],
  ["OC", "Occupancy certificate: issued by the local authority when a building is complete and fit to live in."],
  ["Khata", "A property’s entry in the city’s tax register. It is not proof of ownership on its own."],
  ["EMI", "Equated monthly instalment: the fixed monthly payment on a home loan, covering interest and part of the loan."],
  ["STP", "Sewage treatment plant: it treats a community’s waste water on site so the water can be reused."],
];

export default function ChecklistPage() {
  return (
    <>
      <section data-tone="dark" aria-labelledby="cl-title" className="surface-deep grain relative overflow-hidden pb-16 pt-36 md:pb-20 md:pt-44">
        <Image src="/images/checklist/hero.webp" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-30" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-deep/60 via-forest-deep/80 to-forest-deep" />
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow anim-fade text-paper/70">The checklist</p>
            <h1 className="serif anim-rise mt-5 t-hero leading-[1.02]">
              Must-knows while <em>investing in a home.</em>
            </h1>
          </div>
          <p className="anim-fade-up text-[1.08rem] leading-relaxed text-paper/80 lg:col-span-4 lg:col-start-9" style={{ "--d": "250ms" } as CSSProperties}>
            We began as homebuyers, so we know how much there is to learn. Five things every buyer in Bengaluru should
            understand. Tick them off as you go; your progress stays on this device.
          </p>
        </div>
      </section>

      <section data-tone="light" aria-label="The five must-knows" className="layer surface-ivory py-12 md:py-16">
        <div className="shell">
          <ChecklistTool items={checklist} />

          <section aria-labelledby="words-title" className="mt-12 rounded-2xl border border-ink/10 bg-white/60 p-6 md:p-9">
            <h2 id="words-title" className="serif t-sub leading-tight">
              Words you’ll hear
            </h2>
            <p className="mt-2 max-w-2xl text-mute">The short versions, for when a brochure or a sales call uses them.</p>
            <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {words.map(([term, meaning]) => (
                <div key={term} className="min-w-0 border-t border-ink/10 pt-4">
                  <dt className="font-semibold">{term}</dt>
                  <dd className="mt-1 leading-relaxed text-ink/80">{meaning}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="card-dark mt-12 flex print:hidden flex-col items-start justify-between gap-6 bg-forest p-7 text-paper md:flex-row md:items-center md:p-9">
            <div>
              <Lines className="serif t-sub leading-tight" as="h2" lines={["Still have a question?", <em key="e">Ask us directly.</em>]} />
              <p className="mt-2 text-paper/75">Our team will explain any document for any Disha home, as plainly as you need.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ComposeButton channel="whatsapp" topic="Something else" className="inline-flex h-12 items-center justify-center rounded-lg bg-paper px-5 font-semibold text-ink hover:bg-white">
                Ask on WhatsApp
              </ComposeButton>
              <Link href="/contact#book" className="inline-flex h-12 items-center justify-center rounded-lg border border-paper/30 px-5 font-medium hover:border-paper/60">
                Book a site visit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
