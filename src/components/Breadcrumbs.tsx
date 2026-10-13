import Link from "next/link";
import { ChevronRight } from "lucide-react";

/* Breadcrumbs that mirror the page's address exactly (Home › Checklist › Carpet area = /checklist/carpet-area). */
export function Breadcrumbs({ trail, tone = "dark" }: { trail: { label: string; href?: string }[]; tone?: "dark" | "light" }) {
  const muted = tone === "dark" ? "text-paper/65 hover:text-paper" : "text-mute hover:text-ink";
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {trail.map((t, i) => (
          <li key={t.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden className={`size-3.5 ${tone === "dark" ? "text-paper/40" : "text-mute/60"}`} />}
            {t.href ? (
              <Link href={t.href} className={`inline-block py-1 ${muted}`}>
                {t.label}
              </Link>
            ) : (
              <span aria-current="page" className={tone === "dark" ? "text-paper" : "text-ink"}>
                {t.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
