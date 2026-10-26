"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import s from "./CommuteChecker.module.css";

const CommuteChecker = dynamic(() => import("./CommuteChecker").then((m) => m.CommuteChecker));

/*
 * The commute checker sits far down a long page, so its code is fetched only when the visitor is
 * about to reach it. The reserved height keeps the page from jumping when it appears.
 */
export function CommuteLazy() {
  const holder = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          setNear(true);
          obs.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={holder} className={s.slot}>
      {near && <CommuteChecker />}
    </div>
  );
}
