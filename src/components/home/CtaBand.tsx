import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { ButtonLink, Lines, Reveal } from "@/components/ui";
import { ComposeButton } from "@/components/ComposeButton";
import { SocialIcons } from "@/components/Socials";
import { homemakers } from "@/lib/site";

/*
 * The close of the home page. People remember an experience by its ending (peak-end rule), so
 * the page ends on two real people and one easy invitation, not on a form.
 */
export function CtaBand() {
  const [guna, raja] = homemakers;
  return (
    <section data-tone="dark" aria-labelledby="cta-title" className="layer isolate bg-forest-deep pb-24 pt-20 text-paper md:pb-28 md:pt-24">
      <Image src="/images/central-park/clubhouse-night.jpg" alt="" fill sizes="100vw" className="depth-slow -z-10 scale-[1.15] object-cover opacity-30" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep via-forest-deep/85 to-forest-deep/50" />
      <div className="shell grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal as="p" className="eyebrow text-paper/65">
            Come and meet us
          </Reveal>
          <Lines id="cta-title" className="serif mt-5 t-section leading-[1.04]" lines={["Bring every question.", <em key="e">We’ll bring the coffee.</em>]} />
          <Reveal delay={150} as="p" className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-paper/75">
            Walk Pursuit of the Elements in Gunjur, or sit down with us at our office on Whitefield Main Road. We’ll explain
            everything, from the RERA papers to the structure, as plainly as you need.
          </Reveal>
          <Reveal delay={250} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact#book" variant="paper" className="font-semibold">
              Book a site visit
            </ButtonLink>
            <ComposeButton
              channel="whatsapp"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-paper/30 bg-white/[0.04] px-5 text-[0.95rem] font-medium backdrop-blur-sm transition-colors hover:border-paper/60"
            >
              <MessageCircle aria-hidden className="size-4 text-[#5ad17a]" /> Message us on WhatsApp
            </ComposeButton>
          </Reveal>
          <p className="mt-4 text-sm text-paper/60">No obligation. You see the full message before it’s sent from your own WhatsApp.</p>
          <div className="mt-8 flex items-center gap-4">
            <span className="text-sm text-paper/60">Follow along</span>
            <SocialIcons className="text-paper/80" itemClassName="hover:text-paper" />
          </div>
        </div>

        <Reveal delay={200} className="lg:col-span-4 lg:col-start-9">
          <div className="grid grid-cols-2 gap-3">
            {[guna, raja].map((h, i) => (
              <figure key={h.name} className={i === 1 ? "mt-10" : ""}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image src={h.portrait} alt={`Portrait of ${h.name}`} fill sizes="(min-width: 1024px) 16vw, 45vw" className="object-cover" />
                </div>
                <figcaption className="mt-3">
                  <span className="block font-semibold">{h.name}</span>
                  <span className="text-sm text-paper/60">{h.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
