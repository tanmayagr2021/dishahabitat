import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { company } from "@/lib/site";
import { projects, projectsByHandover } from "@/lib/projects";

export function Footer() {
  const sunshine = projects.find((p) => p.slug === "disha-pursuit-of-sunshine");

  return (
    <footer data-tone="dark" className="grain relative overflow-hidden bg-ink text-paper">
      <div className="shell pt-24 md:pt-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="serif text-[clamp(4.6rem,12vw,12.5rem)] leading-[0.8]">
              Come <em>home.</em>
            </p>
            <Link
              href="/contact#enquire"
              className="group mt-10 inline-flex min-h-12 items-center gap-4 rounded-full bg-paper py-1.5 pl-6 pr-1.5 text-[0.9rem] font-medium text-ink"
            >
              Plan a visit
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
              </span>
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5">
            <div>
              <h2 className="label text-paper/50">The communities</h2>
              <ul className="mt-5 space-y-1">
                {projectsByHandover.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/homes/${p.slug}`}
                      className="group inline-flex min-h-9 items-center gap-3 text-[0.95rem] text-paper/80 hover:text-paper"
                    >
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full transition-transform duration-500 group-hover:scale-[2]"
                        style={{ background: p.hue }}
                      />
                      {p.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="label text-paper/50">Explore</h2>
              <ul className="mt-5 space-y-1">
                {[
                  ["/homes", "All homes"],
                  ["/story", "Our story"],
                  ["/plan", "Plan your home"],
                  ["/#homeowners", "Homeowners"],
                  ["/contact", "Contact"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="inline-flex min-h-9 items-center text-[0.95rem] text-paper/80 hover:text-paper">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="label text-paper/50">Visit</h2>
              <address className="mt-5 text-[0.95rem] not-italic leading-relaxed text-paper/80">
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
                className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-[0.95rem] text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper"
              >
                Directions <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>

            <div>
              <h2 className="label text-paper/50">Talk to us</h2>
              <ul className="mt-5 space-y-1 text-[0.95rem]">
                {company.phones.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} className="inline-flex min-h-9 items-center text-paper/80 hover:text-paper">
                      {p.display}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${company.email}`} className="inline-flex min-h-9 items-center text-paper/80 hover:text-paper">
                    {company.email}
                  </a>
                </li>
              </ul>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {company.socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center text-paper/60 hover:text-paper"
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

        {/* The wordmark, set full width. */}
        <div className="mt-20 flex items-end justify-between gap-6 border-t border-paper/12 pt-10 md:mt-28">
          <Logo className="h-14 w-auto md:h-20" />
          <div aria-hidden className="flex h-1.5 w-40 gap-1 md:w-64">
            {projectsByHandover.map((p) => (
              <span key={p.slug} className="flex-1 rounded-full" style={{ background: p.hue }} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8 text-xs leading-relaxed text-paper/45 lg:flex-row lg:justify-between">
          <p>
            © {company.copyrightYear} {company.legalName}
            {sunshine?.rera && <> · {sunshine.shortName} RERA No. {sunshine.rera}</>}
          </p>
          <p className="max-w-2xl lg:text-right">
            Redesign prototype for client review — not the live website. Images marked “Artist’s impression” are renders.
            The planner is illustrative only.
          </p>
        </div>
      </div>
    </footer>
  );
}
