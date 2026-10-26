import Link from "next/link";
import { Fragment } from "react";
import { CookieSettingsLink } from "@/components/consent/ConsentBanner";
import { communities, communityHref, company, links } from "@/lib/content";
import { company as site } from "@/lib/site";
import s from "./SiteFooter.module.css";

/* A RERA number may wrap only at its slashes, never mid-figure. */
const breakable = (code: string) =>
  code.split("/").map((part, i, all) => (
    <Fragment key={i}>
      {part}
      {i < all.length - 1 && (
        <>
          /<wbr />
        </>
      )}
    </Fragment>
  ));

const columns = [
  {
    title: "Communities",
    links: [...communities.map((c) => ({ label: c.name, href: communityHref(c.slug), meta: c.eyebrow })), { label: "All homes", href: links.homes }],
  },
  {
    title: "Disha Habitat",
    links: [
      { label: "Our story", href: links.story },
      { label: "The founders", href: "/story#homemakers" },
      { label: "Contact", href: links.contact },
    ],
  },
  {
    title: "Plan your home",
    links: [
      { label: "Book a site visit", href: links.bookVisit },
      { label: "Homebuyer’s checklist", href: links.checklist },
      { label: "EMI calculator", href: links.emi },
      { label: "Construction updates", href: links.updates },
    ],
  },
] as const;

/*
 * tesla.com ends on a quiet footer. A full site needs a little more: the pages in three short columns,
 * every way to reach Disha, the footnotes, and one line of small print.
 */
export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.grid}>
        {columns.map((col) => (
          <nav key={col.title} className={s.col} aria-label={col.title}>
            <h2 className={s.head}>{col.title}</h2>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("/") ? <Link href={l.href}>{l.label}</Link> : <a href={l.href}>{l.label}</a>}
                  {"meta" in l && l.meta === "Now selling" && <span className={s.badge}>{l.meta}</span>}
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className={s.col}>
          <h2 className={s.head}>Talk to us</h2>
          <ul>
            <li>
              <a href={company.sales.tel}>Sales {company.sales.display}</a>
            </li>
            {site.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href}>Office {p.display}</a>
              </li>
            ))}
            <li>
              <a href={company.whatsapp}>WhatsApp</a>
            </li>
            <li>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </li>
            <li>
              <a href={site.office.mapUrl}>{company.office}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={s.notes}>
        <p id="note-1">
          <sup>1</sup> From 29 reviews of Disha Central Park on <a href={links.mygate}>MyGate</a>, checked October 2026.
        </p>
        <p>
          Images marked “Artist’s impression” are computer renders of Pursuit of the Elements; all other images are
          photographs.
        </p>
        <p>
          Pursuit of the Elements is registered with Karnataka RERA:{" "}
          {company.rera.map((r, i) => (
            <span key={r.no}>
              {r.phase} <span className={s.code}>{breakable(r.no)}</span>
              {i < company.rera.length - 1 ? ", " : ". "}
            </span>
          ))}
          Any registration number can be checked at <a href={links.rera}>rera.karnataka.gov.in</a>.
        </p>
      </div>

      <ul className={s.links}>
        <li>
          {company.copyright} © {company.year}
        </li>
        <li>
          <Link href={links.privacy}>Privacy</Link>
        </li>
        <li>
          <CookieSettingsLink />
        </li>
        {company.socials.map((x) => (
          <li key={x.label}>
            <a href={x.href}>{x.label}</a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
