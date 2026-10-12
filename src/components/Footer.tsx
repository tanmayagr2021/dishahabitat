import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { company } from "@/lib/site";
import { projects } from "@/lib/projects";

export function Footer() {
  const sunshine = projects.find((p) => p.slug === "disha-pursuit-of-sunshine");

  return (
    <footer data-tone="dark" className="topo relative overflow-hidden bg-forest-900 text-ivory [--topo-opacity:0.28]">
      <div className="shell pt-20 md:pt-28">
        {/* Closing statement */}
        <div className="flex flex-col gap-10 border-b border-ivory/12 pb-16 lg:flex-row lg:items-end lg:justify-between">
          <p className="display text-[4.6rem] leading-[0.85] sm:text-[7rem] lg:text-[9rem] xl:text-[11rem]">
            Come <em className="text-brass-light">home.</em>
          </p>
          <div className="max-w-sm lg:pb-4">
            <p className="leading-relaxed text-ivory/70">
              Mindful living spaces across East Bengaluru, since {company.founded}. Five communities and more than a
              thousand families.
            </p>
            <Link
              href="/contact#enquire"
              className="group mt-6 inline-flex min-h-11 items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-brass-light"
            >
              Start a conversation
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Logo className="h-16 w-auto" />
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-ivory/60">Visit</h2>
            <address className="mt-5 text-sm not-italic leading-relaxed text-ivory/85">
              {company.legalName}
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
              className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-brass-light"
            >
              Open in Google Maps <ArrowUpRight aria-hidden className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-ivory/60">Talk to us</h2>
            <ul className="mt-5 space-y-1 text-sm">
              {company.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="inline-flex min-h-10 items-center text-ivory/85 hover:text-brass-light">
                    {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex min-h-10 items-center text-ivory/85 hover:text-brass-light"
                >
                  {company.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-ivory/60">Explore</h2>
            <ul className="mt-5 space-y-1 text-sm">
              {[
                ["/homes", "Our homes"],
                ["/plan", "Plan your home"],
                ["/story", "Our story"],
                ["/#homeowners", "Homeowners"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="inline-flex min-h-10 items-center text-ivory/85 hover:text-brass-light">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-ivory/60">Follow</h2>
            <ul className="mt-5 space-y-1 text-sm">
              {company.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center text-ivory/85 hover:text-brass-light"
                  >
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-ivory/12 py-8 text-xs leading-relaxed text-ivory/50 lg:flex-row lg:justify-between">
          <p>
            © {company.copyrightYear} {company.legalName}
            {sunshine?.rera && <> · {sunshine.shortName} RERA No. {sunshine.rera}</>}
          </p>
          <p className="max-w-2xl lg:text-right">
            Redesign prototype for client review — not the live website. Images marked “Artist’s impression” are
            renders, not photographs. The affordability planner is illustrative only.
          </p>
        </div>
      </div>
    </footer>
  );
}
