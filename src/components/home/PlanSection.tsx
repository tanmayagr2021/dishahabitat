import Image from "next/image";
import { AffordabilityExplorer } from "@/components/AffordabilityExplorer";
import { ArrowLink, Lines, Reveal } from "@/components/ui";

/* The EMI calculator beside a home at Disha Central Park. */
export function PlanSection() {
  return (
    <section id="plan" data-tone="light" aria-labelledby="plan-title" className="layer surface-stone">
      <div className="grid lg:grid-cols-12">
        <div className="relative min-h-[22rem] overflow-hidden lg:col-span-4 lg:min-h-full">
          <Image
            src="/images/central-park/living-room.jpg"
            alt="A warmly lit living room inside a home at Disha Central Park"
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="depth-slow scale-[1.12] object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-deep/55 to-transparent" />
          <p className="absolute bottom-5 left-5 text-sm text-paper/90">A home at Disha Central Park</p>
        </div>

        <div className="px-5 py-16 md:px-10 md:py-20 lg:col-span-8 lg:px-14">
          <Reveal as="p" className="eyebrow text-mute">
            Plan your home
          </Reveal>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <Lines id="plan-title" className="serif text-[clamp(2.3rem,3.8vw,3.6rem)] leading-[1.04]" lines={["What would your", <em key="e">monthly EMI be?</em>]} />
            <p className="max-w-sm text-[0.98rem] leading-relaxed text-mute">
              Example figures only. Not Disha Habitat prices or an offer of finance. Nothing you enter leaves your browser.
            </p>
          </div>
          <div className="mt-10">
            <AffordabilityExplorer />
          </div>
          <ArrowLink href="/plan" className="mt-6 text-ink">
            Open the full calculator and its fine print
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
