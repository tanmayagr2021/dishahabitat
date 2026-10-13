"use client";

import { useEffect, useRef, useState } from "react";
import { formatIndian } from "@/lib/site";

/*
 * A number that counts up from zero the first time it scrolls into view, in Indian digit grouping;
 * its suffix ("+") fades in once the count lands, to say the figure is still growing.
 * Screen readers get the final figure at once; reduced motion shows it without counting.
 */
export function CountUp({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);
  const [landed, setLanded] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / 1800);
          setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
          if (k < 1) raf = requestAnimationFrame(step);
          else setLanded(true);
        };
        setLanded(false);
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>
        {formatIndian(n)}
        {suffix && <span className={`transition-opacity duration-700 ${landed ? "opacity-100" : "opacity-0"}`}>{suffix}</span>}
      </span>
      <span className="sr-only">
        {formatIndian(value)}
        {suffix}
      </span>
    </span>
  );
}
