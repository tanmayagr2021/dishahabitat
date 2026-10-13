"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/*
 * Inertial smooth scrolling (Lenis), the kind used across award-winning property and studio
 * sites. It drives the native scroll position, so CSS scroll-driven effects and anchors still
 * work. Off for reduced motion; paused while the logo film plays.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -80 } });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const html = document.documentElement;
    const sync = () => (html.dataset.intro === "on" ? lenis.stop() : lenis.start());
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
