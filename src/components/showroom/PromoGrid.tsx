import { promos } from "@/lib/content";
import { PhotoPanel } from "./PhotoPanel";
import s from "./PromoGrid.module.css";

/* Two half-width tiles side by side, where tesla.com shows its offers: the two tools a buyer uses before a visit. */
export function PromoGrid() {
  return (
    <div className={s.grid}>
      {promos.map((p) => (
        <PhotoPanel key={p.title} half light id={p.cta.href.slice(1)} image={p.image} title={p.title} line={p.line} ctas={[p.cta]} />
      ))}
    </div>
  );
}
