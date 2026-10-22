import { Fragment } from "react";
import { company, links } from "@/lib/content";
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

/* tesla.com ends with its footnotes and one quiet row of links; so does this page. */
export function SiteFooter() {
  return (
    <footer className={s.footer}>
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
          <a href={links.privacy}>Privacy</a>
        </li>
        <li>
          <a href={links.contact}>Contact</a>
        </li>
        <li>
          <a href={`mailto:${company.email}`}>{company.email}</a>
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
