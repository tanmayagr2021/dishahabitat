"use client";

import { useEffect, type RefObject } from "react";

/*
 * Writes the element's scroll progress (0 → 1) to the CSS custom property `--p`.
 *   "exit":    0 when the element's top is at the viewport top, 1 once it has scrolled fully out.
 *   "through": 0 when its top enters at the bottom of the viewport, 1 when its bottom leaves the top.
 *   "enter":   0 when its top enters at the bottom, 1 when its top reaches `end` (fraction of viewport).
 * Never hijacks scrolling; respects prefers-reduced-motion (progress stays at `still`).
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  mode: "exit" | "through" | "enter" = "through",
  { end = 0.2, still = 1 }: { end?: number; still?: number } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reduce.matches) {
        el.style.setProperty("--p", String(still));
        return;
      }
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "exit") p = -r.top / Math.max(1, r.height);
      else if (mode === "enter") p = (vh - r.top) / Math.max(1, vh * (1 - end));
      else p = (vh - r.top) / Math.max(1, vh + r.height);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", onScroll);
    };
  }, [ref, mode, end, still]);
}
