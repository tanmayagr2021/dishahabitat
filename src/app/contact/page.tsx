import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { Label, Lines, Reveal } from "@/components/ui";
import { company } from "@/lib/site";
import { projectsByHandover } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit, call or write to Disha Habitat, Whitefield Main Road, Bengaluru.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        title={
          <>
            “Let’s meet <em>for coffee.”</em>
          </>
        }
        intro="Whether you are ready to visit or just beginning to look, we would be glad to talk it through with you."
        aside={
          <div className="grid shrink-0 gap-1 md:text-right">
            {company.phones.map((p) => (
              <a key={p.href} href={p.href} className="serif text-[2rem] leading-tight hover:italic md:text-[2.4rem]">
                {p.display}
              </a>
            ))}
          </div>
        }
      />

      <section data-tone="light" className="bg-paper py-24 md:py-32">
        <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-12 lg:col-span-4">
            <Reveal>
              <Label n="01" className="text-mute">
                Corporate office
              </Label>
              <address className="mt-6 not-italic leading-relaxed">
                <span className="serif block text-[2.2rem] leading-tight">{company.legalName}</span>
                {company.office.lines.map((l) => (
                  <span key={l} className="mt-1 block text-mute">
                    {l}
                  </span>
                ))}
              </address>
              <a
                href={company.office.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                Directions on Google Maps <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Reveal>

            <Reveal delay={80} className="border-t border-ink/15 pt-8">
              <h2 className="label text-mute">Write</h2>
              <a
                href={`mailto:${company.email}`}
                className="serif mt-3 inline-flex min-h-12 items-center break-all text-[2.2rem] leading-tight hover:italic"
              >
                {company.email}
              </a>
            </Reveal>

            <Reveal delay={160} className="border-t border-ink/15 pt-8">
              <h2 className="label text-mute">Follow</h2>
              <ul className="mt-3 flex flex-wrap gap-x-6">
                {company.socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-[0.95rem] underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                    >
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-7 lg:col-start-6">
            <div id="enquire" className="rounded-[4px] bg-paper-2 p-6 sm:p-10 lg:p-14">
              <h2 className="serif text-[clamp(2.4rem,4vw,3.6rem)] leading-none">
                Send an <em>enquiry</em>
              </h2>
              <p className="mb-10 mt-3 text-sm text-mute">We’ll call you back. Fields marked * are required.</p>
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section data-tone="dark" aria-labelledby="sites-title" className="grain relative bg-ink py-24 text-paper md:py-32">
        <div className="shell">
          <Label n="02" className="text-paper/60">
            Our communities
          </Label>
          <Lines id="sites-title" className="serif mt-6 text-[clamp(2.6rem,5vw,4.8rem)]" lines={["Where to", <em key="e">find us.</em>]} />
          <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {projectsByHandover.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 80}>
                <Link href={`/homes/${p.slug}`} className="bloom-on-hover group block">
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-[3px] bg-ink-3">
                    <Image
                      src={p.cover.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                      className="mono-img object-cover transition-[filter,transform] duration-[1200ms] ease-out-expo group-hover:scale-105"
                    />
                  </span>
                  <span className="mt-4 flex items-center gap-2.5">
                    <span aria-hidden className="size-2 rounded-full" style={{ background: p.hue }} />
                    <span className="serif text-[1.8rem] leading-none">{p.shortName}</span>
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-paper/60">{p.address ?? p.locality}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
