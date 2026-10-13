import Image from "next/image";
import { ButtonLink } from "@/components/ui";
import { elements } from "@/lib/elements";

/*
 * The end of a delivered community's page. Its homes are lived in, so instead of an enquiry form
 * for something that can't be bought, it points the visitor to the community selling now.
 */
export function SoldOutBand({ name }: { name: string }) {
  return (
    <section data-tone="dark" aria-labelledby="soldout-title" className="surface-forest grain relative isolate overflow-hidden py-16 md:py-24">
      <div className="shell grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow text-paper/65">Every home handed over</p>
          <h2 id="soldout-title" className="serif mt-5 text-[clamp(2.2rem,3.8vw,3.4rem)] leading-[1.05] text-balance">
            Families live at {name} today. <em>Looking for a home like theirs?</em>
          </h2>
          <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-paper/75">
            {elements.shortName} is selling now in {elements.locality}: {elements.offer.toLowerCase()} and 4 & 5 BHK villas, built by
            the same people, with the same care.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={elements.href} variant="paper" className="font-semibold">
              See {elements.shortName}
            </ButtonLink>
            <ButtonLink href="/contact#book" variant="outline-light">
              Book a site visit
            </ButtonLink>
          </div>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl lg:col-span-6">
          <Image src={elements.cover.src} alt={elements.cover.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          <span className="absolute right-3 top-3 rounded-full bg-forest-deep/65 px-2.5 py-1 text-[0.7rem] font-medium backdrop-blur-sm">Artist’s impression</span>
        </div>
      </div>
    </section>
  );
}
