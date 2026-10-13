import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { ButtonLink, Lines, Reveal } from "@/components/ui";
import { ComposeButton } from "@/components/ComposeButton";
import { SocialIcons } from "@/components/Socials";

/* The close of the home page: one invitation, two ways to act. */
export function CtaBand() {
  return (
    <section data-tone="dark" aria-labelledby="cta-title" className="layer isolate bg-forest-deep pb-24 pt-20 text-paper md:pb-28 md:pt-24">
      <Image src="/images/central-park/clubhouse-night.jpg" alt="" fill sizes="100vw" className="depth-slow -z-10 scale-[1.15] object-cover opacity-35" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep via-forest-deep/80 to-forest-deep/40" />
      <div className="shell flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <Reveal as="p" className="eyebrow text-paper/65">
            Visit us
          </Reveal>
          <Lines id="cta-title" className="serif mt-5 text-[clamp(2.4rem,4.4vw,4.2rem)] leading-[1.04]" lines={["Begin your journey", <em key="e">with Disha Habitat.</em>]} />
          <Reveal delay={150} as="p" className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-paper/75">
            Visit Pursuit of the Elements in Gunjur, or meet us for coffee at our office on Whitefield Main Road. We’ll explain
            everything, until you’re as informed as anyone on the project.
          </Reveal>
          <div className="mt-8 flex items-center gap-4">
            <span className="text-sm text-paper/60">Follow along</span>
            <SocialIcons className="text-paper/80" itemClassName="hover:text-paper" />
          </div>
        </div>
        <Reveal delay={250} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact#book" variant="paper" className="font-semibold">
            Book a site visit
          </ButtonLink>
          <ComposeButton
            channel="whatsapp"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-paper/30 bg-white/[0.04] px-5 text-[0.95rem] font-medium backdrop-blur-sm transition-colors hover:border-paper/60"
          >
            <MessageCircle aria-hidden className="size-4 text-[#5ad17a]" /> Message us on WhatsApp
          </ComposeButton>
          </div>
          <p className="text-sm text-paper/60">No obligation. We’ll call you to confirm a time that suits you.</p>
        </Reveal>
      </div>
    </section>
  );
}
