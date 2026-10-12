import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/ui";
import { company } from "@/lib/site";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit, call or write to Disha Habitat, Whitefield Main Road, Bengaluru.",
};

export default function ContactPage() {
  const withAddress = projects.filter((p) => p.address);

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title={
          <>
            “Let’s meet <br className="hidden sm:block" />
            for <em className="text-olive">coffee</em>.”
          </>
        }
      >
        Whether you are ready to visit or just beginning to look, we would be glad to talk it through with you.
      </PageIntro>

      <section className="pb-24 md:pb-32">
        <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-8">
          <Reveal className="space-y-12 lg:col-span-4">
            <div className="border-t border-ink/20 pt-6">
              <h2 className="eyebrow text-ink-mute">Corporate office</h2>
              <address className="mt-4 not-italic leading-relaxed text-ink">
                {company.legalName}
                {company.office.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <a
                href={company.office.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                Open in Google Maps <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>

            <div className="border-t border-ink/20 pt-6">
              <h2 className="eyebrow text-ink-mute">Call</h2>
              <ul className="mt-3">
                {company.phones.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} className="display inline-flex min-h-12 items-center text-[1.9rem] hover:text-olive">
                      {p.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ink/20 pt-6">
              <h2 className="eyebrow text-ink-mute">Write</h2>
              <a
                href={`mailto:${company.email}`}
                className="display mt-3 inline-flex min-h-12 items-center text-[1.9rem] hover:text-olive"
              >
                {company.email}
              </a>
            </div>

            <div className="border-t border-ink/20 pt-6">
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
            <div id="enquire" className="bg-paper p-6 sm:p-10 lg:p-14">
              <h2 className="display text-[2.4rem] leading-none sm:text-[3rem]">Send an enquiry</h2>
              <p className="mb-10 mt-3 text-sm text-ink-mute">Fields marked * are required.</p>
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="sites-title" className="bg-linen py-20 md:py-28">
        <div className="shell">
          <Reveal>
            <h2 id="sites-title" className="display text-[2.6rem] sm:text-[3.4rem]">
              Our communities
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {withAddress.map((p) => (
              <Reveal as="li" key={p.slug} className="border-t border-ink/20 py-6">
                <h3 className="display text-[1.7rem] leading-tight">
                  <Link href={`/homes/${p.slug}`} className="hover:text-olive">
                    {p.name}
                  </Link>
                </h3>
                <address className="mt-2 text-sm not-italic leading-relaxed text-ink-soft">{p.address}</address>
              </Reveal>
            ))}
            {projects
              .filter((p) => !p.address)
              .map((p) => (
                <Reveal as="li" key={p.slug} className="border-t border-ink/20 py-6">
                  <h3 className="display text-[1.7rem] leading-tight">
                    <Link href={`/homes/${p.slug}`} className="hover:text-olive">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.locality}</p>
                </Reveal>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}
