import Link from "next/link";
import s from "./Breadcrumbs.module.css";

/* Where this page sits: small, grey, the current page last and not a link. */
export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className={s.nav}>
      <ol>
        {trail.map((t, i) => (
          <li key={t.label}>
            {t.href && i < trail.length - 1 ? <Link href={t.href}>{t.label}</Link> : <span aria-current="page">{t.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
