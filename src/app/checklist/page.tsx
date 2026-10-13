import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ComposeButton } from "@/components/ComposeButton";
import { ChecklistTool } from "@/components/ChecklistTool";
import { Lines } from "@/components/ui";
import { checklist } from "@/lib/checklist";

export const metadata: Metadata = {
  title: "The checklist: must-knows while investing in a home",
  description: "Khata certificate, occupancy certificate, carpet area, deviation assessment and sewage treatment plants, explained by Disha Habitat.",
};

export default function ChecklistPage() {
  return (
    <>
      <section data-tone="dark" aria-labelledby="cl-title" className="surface-deep grain relative overflow-hidden pb-16 pt-36 md:pb-20 md:pt-44">
        <Image src="/images/checklist/hero.webp" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-30" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-deep/60 via-forest-deep/80 to-forest-deep" />
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow anim-fade text-paper/70">The checklist</p>
            <h1 className="serif anim-rise mt-5 text-[clamp(2.8rem,6vw,5.4rem)] leading-[1.02]">
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

          <div className="card-dark mt-12 flex print:hidden flex-col items-start justify-between gap-6 bg-forest p-7 text-paper md:flex-row md:items-center md:p-9">
            <div>
              <Lines className="serif text-[clamp(1.8rem,3vw,2.6rem)] leading-tight" as="h2" lines={["Still have a question?", <em key="e">Ask us directly.</em>]} />
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
