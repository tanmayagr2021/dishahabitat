import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { company } from "@/lib/site";
import { projects } from "@/lib/projects";

export function Footer() {
  const sunshine = projects.find((p) => p.slug === "disha-pursuit-of-sunshine");

  return (
    <footer data-tone="dark" className="bg-ink text-paper">
      <div className="shell pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 border-b border-paper/15 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="h-16 w-auto text-paper md:h-20" />
            <p className="display mt-10 text-[3.2rem] leading-[0.9] md:text-[4.5rem]">
              Come <em>home</em>.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/65">
              Mindful living spaces across East Bengaluru, since {company.founded}.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            <div>
              <h2 className="eyebrow text-paper/50">Visit</h2>
              <address className="mt-5 text-sm not-italic leading-relaxed text-paper/85">
                {company.legalName}
                <br />
                {company.office.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <a
                href={company.office.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper"
              >
                Open in Google Maps <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>

            <div>
              <h2 className="eyebrow text-paper/50">Talk to us</h2>
              <ul className="mt-5 space-y-1 text-sm">
                {company.phones.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} className="inline-flex min-h-10 items-center text-paper/85 hover:text-paper">
                      {p.display}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="inline-flex min-h-10 items-center text-paper/85 hover:text-paper"
                  >
                    {company.email}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="eyebrow text-paper/50">Explore</h2>
              <ul className="mt-5 space-y-1 text-sm">
                {[
                  ["/homes", "Our homes"],
                  ["/story", "Our story"],
                  ["/#homeowners", "Homeowners"],
                  ["/contact", "Contact"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="inline-flex min-h-10 items-center text-paper/85 hover:text-paper">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="eyebrow mt-8 text-paper/50">Follow</h2>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {company.socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center text-paper/85 hover:text-paper"
                    >
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-xs leading-relaxed text-paper/55 lg:flex-row lg:justify-between">
          <p>
            © {company.copyrightYear} {company.legalName}
            {sunshine?.rera && <> · {sunshine.shortName} RERA No. {sunshine.rera}</>}
          </p>
          <p className="max-w-xl lg:text-right">
            Redesign prototype for client review — not the live website. Images marked “Artist’s impression” are
            renders, not photographs.
          </p>
        </div>
      </div>
    </footer>
  );
}
