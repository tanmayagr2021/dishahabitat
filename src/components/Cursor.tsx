"use client";

import { useEffect, useRef, useState } from "react";

/*
 * A soft cursor for mouse and trackpad users: a small dot that trails the pointer, opening into a
 * labelled disc over anything marked data-cursor ("View", "Drag"). Primary buttons marked
 * data-magnetic lean gently towards the pointer. Touch screens and reduced motion get neither.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let raf = 0;
    let mag: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      const target = t.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor ?? null);
      const m = t.closest<HTMLElement>("[data-magnetic]");
      if (mag && mag !== m) mag.style.translate = "";
      mag = m;
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.translate = `${(x - (r.left + r.width / 2)) * 0.18}px ${(y - (r.top + r.height / 2)) * 0.3}px`;
      }
    };
    const leave = () => {
      x = y = -100;
      if (mag) mag.style.translate = "";
    };
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={dot} aria-hidden className={`cursor-dot ${label ? "is-label" : ""}`}>
      <span>{label}</span>
    </div>
  );
}
