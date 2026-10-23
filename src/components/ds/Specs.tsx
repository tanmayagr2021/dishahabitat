import s from "./Specs.module.css";

export type SpecItem = { value: string; label: string; note?: string };

/* Figures in a row on white: the number large in ink, what it measures small and grey beneath. */
export function Specs({ items, align = "start" }: { items: readonly SpecItem[]; align?: "start" | "center" }) {
  return (
    <dl className={s.specs} data-align={align}>
      {items.map((it) => (
        <div key={it.label} className={s.item}>
          <dt>
            {it.label}
            {it.note && <span className={s.note}>{it.note}</span>}
          </dt>
          <dd>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
