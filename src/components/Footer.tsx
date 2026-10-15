import Link from "next/link";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { ComposeButton } from "@/components/ComposeButton";
import { Logo } from "@/components/Logo";
import { SocialIcons } from "@/components/Socials";
import { company } from "@/lib/site";
import { projectsNewestFirst } from "@/lib/projects";
import { elements } from "@/lib/elements";

/*
 * A compact footer in clear groups (communities, company, tools, contact), with every contact
 * channel visible, the RERA numbers, and the legal line.
 */
const company_links = [
  ["/story", "Our story"],
  ["/story#this-is-us", "This is us"],
  ["/story#homemakers", "Homemakers"],
  ["/contact", "Contact"],
] as const;
const tools = [
  ["/contact#book", "Book a site visit"],
  ["/plan", "EMI calculator"],
  ["/checklist", "Homebuyer’s checklist"],
  ["/homes#explore", "Compare communities"],
] as const;

export function Footer() {
  const sunshine = projectsNewestFirst.find((p) => p.slug === "disha-pursuit-of-sunshine");
  const linkCls = "inline-block py-1 text-paper/75 transition-colors hover:text-paper";
  const head = "text-sm text-paper/50";

  return (
    <footer data-tone="dark" className="surface-deep pb-20 md:pb-0">
      <div className="shell py-12 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Link href="/" aria-label="Disha Habitat home" className="inline-block">
              <Logo className="h-12 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-paper/65">
              {company.tagline}. Residential communities in East Bengaluru since {company.founded}.
            </p>
            <SocialIcons className="mt-5 text-paper/75" itemClassName="hover:text-paper" />
          </div>

          <nav aria-label="Communities" className="lg:col-span-3">
            <h2 className={head}>Communities</h2>
            <ul className="mt-2 space-y-0.5 text-[0.95rem]">
              <li>
                <Link href={elements.href} className={`${linkCls} inline-flex items-center gap-2`}>
                  {elements.shortName}
                  <span className="rounded-full bg-cyan/15 px-2 py-0.5 text-[0.72rem] text-cyan">Now selling</span>
                </Link>
              </li>
              {projectsNewestFirst.map((p) => (
                <li key={p.slug}>
                  <Link href={`/homes/${p.slug}`} className={linkCls}>
                    {p.shortName} <span className="text-paper/40">· {p.handoverYear}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-2">
            <h2 className={head}>Company</h2>
            <ul className="mt-2 space-y-0.5 text-[0.95rem]">
              {company_links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className={linkCls}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className={`${head} mt-6`}>Tools</h2>
            <ul className="mt-2 space-y-0.5 text-[0.95rem]">
              {tools.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className={linkCls}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className={head}>Talk to us</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={elements.phone.href} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-paper text-sm font-semibold text-ink hover:bg-white">
                <Phone aria-hidden className="size-4" /> Call now
              </a>
              <ComposeButton channel="whatsapp" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-paper/25 text-sm font-medium hover:border-paper/60">
                <MessageCircle aria-hidden className="size-4 text-[#5ad17a]" /> WhatsApp
              </ComposeButton>
            </div>
            <dl className="mt-5 space-y-3 text-[0.95rem]">
              <div>
                <dt className="text-xs text-paper/45">Sales</dt>
                <dd>
                  <a href={elements.phone.href} className={linkCls}>
                    {elements.phone.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-paper/45">Office</dt>
                <dd className="flex flex-wrap gap-x-4">
                  {company.phones.map((p) => (
                    <a key={p.href} href={p.href} className={linkCls}>
                      {p.display}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-paper/45">Email</dt>
                <dd>
                  <ComposeButton channel="email" className={`${linkCls} text-left`}>
                    {company.email}
                  </ComposeButton>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-paper/45">Corporate office</dt>
                <dd className="text-paper/75">
                  {company.office.lines.join(", ")}{" "}
                  <a href={company.office.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper">
                    Directions <ArrowUpRight aria-hidden className="size-3.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-10 border-t border-paper/10 pt-6 text-xs leading-relaxed text-paper/45">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <p>
              © {company.copyrightYear}, {company.copyrightHolder}. {company.legalName.replace(/\.$/, "")}.
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              <li>
                <Link href="/privacy" className="inline-block py-1 hover:text-paper">
                  Privacy
                </Link>
              </li>
              {elements.rera.map((r) => (
                <li key={r.no}>
                  {elements.shortName} RERA ({r.phase}): {r.no}
                </li>
              ))}
              {sunshine?.rera && (
                <li>
                  {sunshine.shortName} RERA: {sunshine.rera}
                </li>
              )}
            </ul>
          </div>
          <p className="mt-3 text-paper/35">Images marked “Artist’s impression” are renders. The EMI calculator is illustrative and is not an offer of finance.</p>
        </div>
      </div>
    </footer>
  );
}
