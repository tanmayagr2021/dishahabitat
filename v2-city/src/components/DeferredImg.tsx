"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/*
 * An image that waits for the page to finish loading, then for the visitor to come within a screen of
 * it. Native lazy loading starts far too early on slow connections, where these plans would compete
 * with the first screen's map. Without JavaScript, the <noscript> copy loads as normal.
 */
export function DeferredImg({ src, className, style }: { src: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    let io: IntersectionObserver | null = null;
    const watch = () => {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            img.src = src;
            io?.disconnect();
          }
        },
        { rootMargin: "100% 0px" },
      );
      io.observe(img);
    };
    if (document.readyState === "complete") watch();
    else window.addEventListener("load", watch, { once: true });
    return () => {
      window.removeEventListener("load", watch);
      io?.disconnect();
    };
  }, [src]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- a vector plan, loaded when it is needed */}
      <img ref={ref} className={className} style={style} src={BLANK} alt="" decoding="async" />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- the same plan, for browsers without JavaScript */}
        <img className={className} style={style} src={src} alt="" />
      </noscript>
    </>
  );
}
