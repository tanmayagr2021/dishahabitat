import { company } from "@/lib/content";
import { whatsappVisit } from "@/lib/site";
import { Arrow } from "./Arrow";
import { Logo } from "./Logo";
import s from "./Closing.module.css";

/* Morning again: the page closes on paper with one invitation and the company's published details. */
export function Closing() {
  return (
    <footer className={s.closing} data-step="closing" aria-labelledby="closing-title">
      <div className={s.invite}>
        <p className={`${s.kicker} t-label`}>Visit</p>
        <h2 id="closing-title" className="t-act">
          Come and walk through <em className="it">one of them.</em>
        </h2>
        <p className={`${s.body} t-body`}>
          Visits to Pursuit of the Elements are planned with Disha’s sales team on WhatsApp. The message opens ready
          for you to send; nothing leaves this page on its own.
        </p>
        <div className={s.actions}>
          <a className="button" href={whatsappVisit} target="_blank" rel="noopener noreferrer">
            Plan a visit on WhatsApp <Arrow />
          </a>
          <a className="link" href={company.sales.tel}>
            Call {company.sales.display}
          </a>
        </div>
      </div>

      <dl className={s.facts}>
        <div>
          <dt className="t-label">Office</dt>
          <dd>{company.office}</dd>
        </div>
        <div>
          <dt className="t-label">Email</dt>
          <dd>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </dd>
        </div>
        <div>
          <dt className="t-label">Building since</dt>
          <dd>{company.founded}, in {company.region}</dd>
        </div>
      </dl>

      <div className={s.base}>
        <Logo className={s.logo} />
        <p className="t-small">
          © 2026 {company.copyright}. Photographs by Disha Habitat; images of Pursuit of the Elements are
          artist’s impressions.
        </p>
      </div>
    </footer>
  );
}
