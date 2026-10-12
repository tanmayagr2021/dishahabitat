import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { Reveal, SectionMark } from "@/components/ui";
import { company } from "@/lib/site";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit, call or write to Disha Habitat, Whitefield Main Road, Bengaluru.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            “Let’s meet
            <br />
            for <em className="text-brass-light">coffee.</em>”
          </>
        }
        intro="Whether you are ready to visit or just beginning to look, we would be glad to talk it through with you."
      />

      <section className="bg-ivory py-20 md:py-28">
        <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-8">
          <Reveal className="space-y-12 lg:col-span-4">
            <div>
              <SectionMark n="01" label="Corporate office" />
              <address className="mt-6 not-italic leading-relaxed text-ink">
                <span className="display block text-[1.9rem] leading-tight">{company.legalName}</span>
                {company.office.lines.map((l) => (
                  <span key={l} className="mt-1 block text-ink-soft">
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
                Open in Google Maps <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>

            <div className="border-t border-ink/15 pt-8">
              <h2 className="eyebrow text-ink-mute">Call</h2>
              <ul className="mt-3">
                {company.phones.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} className="display inline-flex min-h-12 items-center text-[2.1rem] hover:text-brass-deep">
                      {p.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ink/15 pt-8">
              <h2 className="eyebrow text-ink-mute">Write</h2>
              <a
                href={`mailto:${company.email}`}
                className="display mt-3 inline-flex min-h-12 items-center break-all text-[2.1rem] hover:text-brass-deep"
              >
                {company.email}
              </a>
            </div>

            <div className="border-t border-ink/15 pt-8">
              <h2 className="eyebrow text-ink-mute">Follow</h2>
              <ul className="mt-3 flex flex-wrap gap-x-6">
                {company.socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-sm underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                    >
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7 lg:col-start-6">
            <div id="enquire" className="border border-ink/10 bg-paper p-6 shadow-[0_40px_80px_-40px_rgba(20,19,17,0.35)] sm:p-10 lg:p-14">
              <h2 className="display text-[2.6rem] leading-none sm:text-[3.4rem]">
                Send an <em className="text-brass-deep">enquiry</em>
              </h2>
              <p className="mb-10 mt-3 text-sm text-ink-mute">Fields marked * are required.</p>
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section data-tone="dark" aria-labelledby="sites-title" className="topo bg-forest-900 py-20 text-ivory [--topo-opacity:0.3] md:py-28">
        <div className="shell">
          <Reveal>
            <SectionMark n="02" label="Our communities" tone="dark" />
            <h2 id="sites-title" className="display mt-6 text-[2.8rem] sm:text-[3.8rem]">
              Where to <em className="text-brass-light">find us.</em>
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Reveal as="li" key={p.slug} className="border-t border-ivory/15 py-7">
                <h3 className="display text-[1.9rem] leading-tight">
                  <Link href={`/homes/${p.slug}`} className="hover:text-brass-light">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/65">{p.address ?? p.locality}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
