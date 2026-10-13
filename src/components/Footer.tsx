import Link from "next/link";
import { ComposeButton } from "@/components/ComposeButton";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SocialIcons } from "@/components/Socials";
import { company } from "@/lib/site";
import { projects, projectsByHandover } from "@/lib/projects";
import { elements } from "@/lib/elements";

/* A compact footer: the mark, the communities, the essentials, and the legal line. */
export function Footer() {
  const sunshine = projects.find((p) => p.slug === "disha-pursuit-of-sunshine");
  const linkCls = "text-paper/75 transition-colors hover:text-paper";

  return (
    <footer data-tone="dark" className="surface-deep pb-20 md:pb-0">
      <div className="shell py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" aria-label="Disha Habitat home" className="inline-block">
              <Logo className="h-12 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-paper/65">
              {company.tagline}. Residential communities in East Bengaluru since {company.founded}.
            </p>
          </div>

          <nav aria-label="Communities" className="md:col-span-3">
            <h2 className="text-sm text-paper/50">Communities</h2>
            <ul className="mt-3 space-y-1.5 text-[0.95rem]">
              <li>
                <Link href={elements.href} className={`${linkCls} inline-flex items-center gap-2`}>
                  {elements.shortName}
                  <span className="rounded-full bg-cyan/15 px-2 py-0.5 text-[0.72rem] text-cyan">Now selling</span>
                </Link>
              </li>
              {projectsByHandover.map((p) => (
                <li key={p.slug}>
                  <Link href={`/homes/${p.slug}`} className={linkCls}>
                    {p.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Explore" className="md:col-span-2">
            <h2 className="text-sm text-paper/50">Explore</h2>
            <ul className="mt-3 space-y-1.5 text-[0.95rem]">
              {[
                ["/homes", "All homes"],
                ["/story", "Our story"],
                ["/story#homemakers", "Homemakers"],
                ["/checklist", "The checklist"],
                ["/plan", "EMI calculator"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className={linkCls}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="text-sm text-paper/50">Visit or call</h2>
            <address className="mt-3 text-[0.95rem] not-italic leading-relaxed text-paper/75">{company.office.lines.join(", ")}</address>
            <a
              href={company.office.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkCls} mt-1 inline-flex items-center gap-1 text-[0.95rem]`}
            >
              Directions <ArrowUpRight aria-hidden className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <p className="mt-3 flex flex-wrap gap-x-4 text-[0.95rem]">
              {company.phones.map((p) => (
                <a key={p.href} href={p.href} className={linkCls}>
                  {p.display}
                </a>
              ))}
              <ComposeButton channel="email" className={linkCls}>
                {company.email}
              </ComposeButton>
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-paper/10 pt-6 text-xs leading-relaxed text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {company.copyrightYear}, {company.copyrightHolder}
            {sunshine?.rera && <> · {sunshine.shortName} RERA {sunshine.rera}</>}
          </p>
          <SocialIcons className="text-paper/75" itemClassName="hover:text-paper" />
        </div>
        <p className="mt-2 text-[0.7rem] text-paper/35">
          Redesign prototype for client review. Images marked “Artist’s impression” are renders; the EMI calculator is illustrative.
        </p>
      </div>
    </footer>
  );
}
