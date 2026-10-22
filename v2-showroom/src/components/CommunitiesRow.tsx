"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { CardCarousel, type CarouselHandle } from "./CardCarousel";
import { CommunityMap, type MapItem } from "./CommunityMap";

/*
 * The communities row with its map: the card on show and the plot on the map stay together. A card
 * chosen by an arrow, a mark or a name on the map moves the map at once; a row scrolled by hand moves
 * it once the scrolling has settled, so a fast swipe does not send the map to every card on the way.
 */
type Props = { title: string; line: string; items: MapItem[]; children: ReactNode };

const SETTLE_MS = 220;

export function CommunitiesRow({ title, line, items, children }: Props) {
  const row = useRef<CarouselHandle>(null);
  const [shown, setShown] = useState(0);
  const chosen = useRef<{ i: number; until: number } | null>(null);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onSelect = useCallback((i: number) => {
    clearTimeout(timer.current);
    chosen.current = { i, until: performance.now() + 1500 };
    setShown(i);
  }, []);

  const onActive = useCallback((i: number) => {
    const c = chosen.current;
    if (c) {
      // the row is still scrolling to a chosen card: ignore the cards it passes on the way
      if (i !== c.i && performance.now() < c.until) return;
      chosen.current = null;
    }
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShown(i), SETTLE_MS);
  }, []);

  const onPick = useCallback((i: number) => row.current?.show(i), []);

  return (
    <CardCarousel
      ref={row}
      title={title}
      line={line}
      names={items.map((c) => c.name)}
      onActive={onActive}
      onSelect={onSelect}
      dock={<CommunityMap items={items} active={shown} onPick={onPick} />}
    >
      {children}
    </CardCarousel>
  );
}
