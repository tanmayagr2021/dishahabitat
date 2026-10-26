"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MapItem } from "./CommunityMap";
import s from "./CommunityMap.module.css";

/* The map's code (about 25 KB with its data) is fetched only when its place is near the screen. */
const CommunityMap = dynamic(() => import("./CommunityMap").then((m) => m.CommunityMap), {
  ssr: false,
  loading: () => <div className={s.map} aria-hidden="true" />,
});

type Props = { items: MapItem[]; active: number; onPick: (i: number) => void };

export function LazyMap(props: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={holder} className={s.slot}>
      {near ? <CommunityMap {...props} /> : <div className={s.map} aria-hidden="true" />}
    </div>
  );
}
