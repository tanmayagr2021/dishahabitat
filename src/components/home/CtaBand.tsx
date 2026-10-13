import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { ButtonLink, Lines, Reveal } from "@/components/ui";
import { elements } from "@/lib/elements";

/* The close of the home page: one invitation, two ways to act. */
export function CtaBand() {
  return (
    <section data-tone="dark" aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-forest-deep py-20 text-paper md:py-28">
      <Image src="/images/central-park/clubhouse-night.jpg" alt="" fill sizes="100vw" className="depth-slow -z-10 scale-[1.15] object-cover opacity-35" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep via-forest-deep/80 to-forest-deep/40" />
      <div className="shell flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <Reveal as="p" className="eyebrow text-paper/65">
            Let’s connect
          </Reveal>
          <Lines id="cta-title" className="serif mt-5 text-[clamp(2.4rem,4.4vw,4.2rem)] leading-[1.04]" lines={["Begin your journey", <em key="e">with Disha Habitat.</em>]} />
          <Reveal delay={150} as="p" className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-paper/75">
            Visit Pursuit of the Elements in Gunjur, or meet us for coffee at our office on Whitefield Main Road. We’ll explain
            everything, until you’re as informed as anyone on the project.
          </Reveal>
        </div>
        <Reveal delay={250} className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact#book" variant="paper" className="font-semibold">
            Book a site visit
          </ButtonLink>
          <a
            href={`${elements.whatsapp}&text=${encodeURIComponent("Hello Disha Habitat, I'd like to know more about your homes.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-paper/30 bg-white/[0.04] px-5 text-[0.95rem] font-medium backdrop-blur-sm transition-colors hover:border-paper/60"
          >
            <MessageCircle aria-hidden className="size-4 text-[#5ad17a]" /> Chat on WhatsApp
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
