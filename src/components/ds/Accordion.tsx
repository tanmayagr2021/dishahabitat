"use client";

import { type ReactNode, useEffect, useId, useState } from "react";
import s from "./Accordion.module.css";

type Item = { title: ReactNode; body: ReactNode; id?: string };

/*
 * Rows that open in place (specifications, questions): a hairline between them, a plus that turns
 * into a minus. The panel opens by animating its row height (0fr to 1fr). A closed panel is inert,
 * so its links are out of the tab order and out of the reading order.
 */
export function Accordion({ items, defaultOpen = 0 }: { items: readonly Item[]; defaultOpen?: number | null }) {
  const uid = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set(defaultOpen === null ? [] : [defaultOpen]));

  /* A link to #some-row opens that row. */
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const at = hash ? items.findIndex((it) => it.id === hash) : -1;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the address bar, which the server cannot
    if (at >= 0) setOpen((o) => new Set(o).add(at));
  }, [items]);

  const toggle = (i: number) =>
    setOpen((o) => {
      const next = new Set(o);
      if (!next.delete(i)) next.add(i);
      return next;
    });

  return (
    <div className={s.list}>
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} id={it.id} className={s.item} data-open={isOpen || undefined}>
            <h3 className={s.heading}>
              <button type="button" className={s.summary} aria-expanded={isOpen} aria-controls={`${uid}-${i}`} onClick={() => toggle(i)}>
                <span className={s.title}>{it.title}</span>
                <span className={s.icon} aria-hidden="true" />
              </button>
            </h3>
            <div id={`${uid}-${i}`} role="region" className={s.panel} inert={!isOpen}>
              <div className={s.clip}>
                <div className={s.body}>{it.body}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
