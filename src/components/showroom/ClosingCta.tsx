import { closing, company, links } from "@/lib/content";
import s from "./ClosingCta.module.css";

/* The page ends on its one action, not on footnotes: book a visit, or call. */
export function ClosingCta() {
  return (
    <section className={s.section} aria-labelledby="closing-title">
      <div className={`${s.inner} reveal`}>
        <div>
          <h2 id="closing-title" className={`display ${s.title}`}>
            {closing.title}
          </h2>
          <p className={s.line}>{closing.line}</p>
        </div>
        <div className={s.buttons}>
          <a className="btn btn-primary" href={links.bookVisit}>
            Book a visit
          </a>
          <a className="btn btn-soft" href={company.sales.tel}>
            Call {company.sales.display}
          </a>
        </div>
      </div>
    </section>
  );
}
