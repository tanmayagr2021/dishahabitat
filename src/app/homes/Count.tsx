import type { CSSProperties } from "react";
import s from "./Count.module.css";

/*
 * A whole number that counts up once when it first shows. The real number is the text, so it reads
 * the same with no CSS animation support or with reduced motion; the count itself is drawn by CSS.
 */
export function Count({ to }: { to: number }) {
  return (
    <span className={s.count} style={{ "--to": to } as CSSProperties}>
      {to}
    </span>
  );
}
