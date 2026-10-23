import type { ReactNode } from "react";
import s from "./Accordion.module.css";

/*
 * Rows that open in place (specifications, questions): a hairline between them, a plus that turns
 * into a cross. Built on <details>, so it works without scripts and with find-in-page.
 */
export function Accordion({ items, defaultOpen = 0 }: { items: readonly { title: ReactNode; body: ReactNode; id?: string }[]; defaultOpen?: number | null }) {
  return (
    <div className={s.list}>
      {items.map((it, i) => (
        <details key={i} id={it.id} className={s.item} open={i === defaultOpen || undefined}>
          <summary className={s.summary}>
            <span className={s.title}>{it.title}</span>
            <span className={s.icon} aria-hidden="true" />
          </summary>
          <div className={s.body}>{it.body}</div>
        </details>
      ))}
    </div>
  );
}
