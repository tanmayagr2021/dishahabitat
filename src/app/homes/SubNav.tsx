"use client";

import { useEffect, useRef, useState } from "react";
import s from "./SubNav.module.css";

export type SubNavItem = { id: string; label: string; /* hidden on a phone, where the button already says it */ phoneHidden?: boolean };

/*
 * The model-page bar: it appears under the site header once the hero has scrolled away, lists the
 * page's sections with the current one marked, and keeps "Book a visit" at its right.
 */
export function SubNav({ items, label, cta }: { items: SubNavItem[]; label: string; cta: { label: string; href: string } }) {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState(items[0]?.id);
  const row = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const hero = document.getElementById("page-title")?.closest("section");
    if (!hero) return;
    /* Shown once the hero's foot is within the bar's reach (header 56 + bar 48, and a little to spare). */
    const heroObs = new IntersectionObserver(([en]) => setShown(!en.isIntersecting && en.boundingClientRect.bottom <= 144), { rootMargin: "-144px 0px 0px 0px" });
    heroObs.observe(hero);

    /* A section is current while it crosses a thin line a quarter of the way down the screen. */
    const crossing = new Set<string>();
    const spy = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) crossing.add(en.target.id);
          else crossing.delete(en.target.id);
        }
        const current = [...items].reverse().find((i) => crossing.has(i.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-25% 0px -74% 0px" },
    );
    for (const i of items) {
      const el = document.getElementById(i.id);
      if (el) spy.observe(el);
    }
    return () => {
      heroObs.disconnect();
      spy.disconnect();
    };
  }, [items]);

  /* Keep the current chip in view in the scrolling row on a phone. */
  useEffect(() => {
    const r = row.current;
    const a = r?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!r || !a || r.scrollWidth <= r.clientWidth) return;
    r.scrollTo({ left: a.offsetLeft - (r.clientWidth - a.offsetWidth) / 2, behavior: "auto" });
  }, [active]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    <div className={s.bar} data-show={shown} aria-hidden={!shown || undefined} inert={!shown || undefined}>
      <nav className={s.nav} aria-label={label}>
        <ul ref={row} className={s.row}>
          {items.map((i) => (
            <li key={i.id} data-phone-hidden={i.phoneHidden || undefined}>
              <a href={`#${i.id}`} onClick={(e) => go(e, i.id)} aria-current={active === i.id ? "true" : undefined} className={s.link}>
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <a href={cta.href} className={`btn btn-primary ${s.cta}`}>
        {cta.label}
      </a>
    </div>
  );
}
