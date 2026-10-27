"use client";

import Link from "next/link";
import { useState } from "react";
import { communityHref } from "@/lib/content";
import type { MapItem } from "./CommunityMap";
import { LazyMap } from "./LazyMap";
import { ArrowRight } from "./Icons";
import s from "./MapSection.module.css";

type Props = { title: string; line: string; items: (MapItem & { eyebrow: string })[] };

/*
 * The one place on the home page where all the communities are seen together: a list to choose from
 * (also the keyboard way in, since the marks on the map are for pointing) beside the map.
 */
export function MapSection({ title, line, items }: Props) {
  const [active, setActive] = useState(0);
  const shown = items[active] ?? items[0];
  return (
    <section className={s.section} aria-labelledby="map-title">
      <div className={s.inner}>
        <div className={s.side}>
          <div className="reveal">
            <h2 id="map-title" className={`display ${s.title}`}>
              {title}
            </h2>
            <p className={s.line}>{line}</p>
          </div>
          <ul className={s.list}>
            {items.map((c, i) => (
              <li key={c.slug}>
                <button type="button" className={s.item} aria-pressed={i === active} onClick={() => setActive(i)}>
                  <span className={s.name}>{c.name}</span>
                  <span className={s.meta}>
                    {c.eyebrow} · {c.place}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {shown && (
            <Link className="text-link" href={communityHref(shown.slug)}>
              Explore {shown.name}
              <ArrowRight />
            </Link>
          )}
        </div>
        <div className={s.map}>
          <LazyMap items={items} active={active} onPick={setActive} />
        </div>
      </div>
    </section>
  );
}
