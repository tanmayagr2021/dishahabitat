"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { formatIndian } from "@/lib/site";
import s from "./page.module.css";

type Stat = { value: number; suffix: string; label: string };

/* How many comma-separated groups the number has in Indian grouping (5 / 1,000 / 20,25,000). */
const groupsOf = (n: number) => (n < 1000 ? 1 : n < 100000 ? 2 : 3);

/*
 * The figures count up once, the first time they are mostly in view. The counting is CSS (a registered
 * integer property); this component only switches it on, and only where the browser can do it. Without
 * it, or with reduced motion, the real numbers are simply there.
 */
export function Stats({ items }: { items: readonly Stat[] }) {
  const ref = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ok =
      "IntersectionObserver" in window &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches &&
      CSS.supports("width", "round(down, 5px, 1px)") &&
      CSS.supports("content", '"a" / ""');
    if (!ok) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.in = "";
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    el.dataset.armed = "";
    io.observe(el);
    return () => {
      io.disconnect();
      delete el.dataset.armed;
    };
  }, []);

  return (
    <dl ref={ref} className={s.stats}>
      {items.map((st) => (
        <div key={st.label} className={s.stat}>
          <dt>{st.label}</dt>
          <dd style={{ "--n": st.value } as CSSProperties} data-groups={groupsOf(st.value)} data-suffix={st.suffix}>
            <span className={s.real}>
              {formatIndian(st.value)}
              {st.suffix}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
