import type { ReactNode } from "react";
import s from "./FactList.module.css";

export type Fact = { label: string; value: ReactNode; note?: ReactNode };

/* Label on the left, value on the right, a hairline between rows: the way tesla.com lists specifications. */
export function FactList({ facts, columns = 1 }: { facts: readonly Fact[]; columns?: 1 | 2 }) {
  return (
    <dl className={s.list} data-columns={columns}>
      {facts.map((f) => (
        <div key={f.label} className={s.row}>
          <dt>{f.label}</dt>
          <dd>
            {f.value}
            {f.note && <span className={s.note}>{f.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
