import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ComposeButton } from "@/components/ComposeButton";
import { Lines, Reveal } from "@/components/ui";
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
            understand, in plain words.
          </p>
        </div>
      </section>

      <section data-tone="light" aria-label="The five must-knows" className="layer surface-ivory py-16 md:py-24">
        <div className="shell">
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {checklist.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={(i % 3) * 90} className={i === 0 ? "md:col-span-2" : ""}>
                <Link href={`/checklist/${c.slug}`} data-cursor="Read" className="group card flex h-full flex-col overflow-hidden">
                  <span className={`relative block overflow-hidden ${i === 0 ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[16/10]"}`}>
                    <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105" />
                    <span className="absolute left-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-paper text-sm font-semibold tabular-nums text-ink">{i + 1}</span>
                  </span>
                  <span className="flex flex-1 flex-col p-6">
                    <span className="serif text-[1.7rem] leading-tight">{c.title}</span>
                    <span className="mt-2 text-[0.98rem] text-mute">{c.summary}</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-forest">
                      Read the guide <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>

          <div className="card-dark mt-12 flex flex-col items-start justify-between gap-6 bg-forest p-7 text-paper md:flex-row md:items-center md:p-9">
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
