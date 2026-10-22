import { company } from "@/lib/content";
import { Logo } from "./Logo";
import s from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <Logo className={s.logo} />
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
          <dt className="t-label">Sales, Pursuit of the Elements</dt>
          <dd>
            <a href={company.sales.tel}>{company.sales.display}</a>
          </dd>
        </div>
      </dl>
      <p className={s.small}>
        © 2026 {company.copyright}. Photographs by Disha Habitat; the image of Pursuit of the Elements is an artist’s
        impression. Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>,
        available under the Open Database Licence.
      </p>
    </footer>
  );
}
