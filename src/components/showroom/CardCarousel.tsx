"use client";

import { Children, type ReactNode, type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { MOTION_OK, useMedia } from "@/lib/useMedia";
import { ArrowRight, ChevronLeft, ChevronRight } from "./Icons";
import s from "./CardCarousel.module.css";

/*
 * tesla.com's "freeflow" row: large cards that scroll sideways and snap, arrows on computers, marks
 * underneath, with a short heading so the row says what it is. The cards are rendered on the server
 * and passed in as children.
 */
type Props = {
  title: string;
  line: string;
  link?: { label: string; href: string };
  /* A row whose cards hold no links needs the row itself in the tab order, so arrow keys can scroll it. */
  keyboardScroll?: boolean;
  names: string[];
  children: ReactNode;
  /* Something that belongs beside the cards (the communities map): above them on phones, beside on computers. */
  dock?: ReactNode;
  /* The card nearest the start, as the row scrolls. */
  onActive?: (i: number) => void;
  /* A card asked for by an arrow or mark, before the row has scrolled to it. */
  onSelect?: (i: number) => void;
  ref?: Ref<CarouselHandle>;
};

export type CarouselHandle = { show: (i: number) => void };

export function CardCarousel({
  title,
  line,
  link,
  keyboardScroll,
  names,
  children,
  dock,
  onActive,
  onSelect,
  ref,
}: Props) {
  const label = title;
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const motionOk = useMedia(MOTION_OK);
  const items = Children.toArray(children);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = el.scrollWidth - el.clientWidth;
      const pad = (el.children[0] as HTMLElement | undefined)?.offsetLeft ?? 0;
      let nearest = 0;
      let best = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const d = Math.abs((child as HTMLElement).offsetLeft - pad - el.scrollLeft);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      const atEnd = el.scrollLeft >= max - 4;
      setEdges({ start: el.scrollLeft <= 4, end: atEnd });
      setActive(atEnd ? el.children.length - 1 : nearest);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", schedule, { passive: true });
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", schedule);
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    onActive?.(active);
  }, [active, onActive]);

  const show = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    onSelect?.(i);
    const pad = (el.children[0] as HTMLElement | undefined)?.offsetLeft ?? 0;
    el.scrollTo({ left: card.offsetLeft - pad, behavior: motionOk ? "smooth" : "auto" });
  };

  useImperativeHandle(ref, () => ({ show }));

  return (
    <section className={s.section} aria-roledescription="carousel" aria-label={label}>
      <div className={s.head}>
        <div className="reveal">
          <h2 className={`display ${s.title}`}>{title}</h2>
          <p className={s.line}>{line}</p>
        </div>
        {link && (
          <a className={s.link} href={link.href}>
            {link.label}
            <ArrowRight />
          </a>
        )}
      </div>
      <div className={dock ? s.docked : undefined}>
        {dock && <div className={s.dock}>{dock}</div>}
        <div className={s.viewport}>
          <div
            ref={track}
            className={s.track}
            {...(keyboardScroll
              ? { tabIndex: 0, role: "group", "aria-label": `${title}, scroll with the arrow keys` }
              : {})}
          >
            {items.map((child, i) => (
              <div
                key={names[i] ?? i}
                className={s.item}
                role="group"
                aria-roledescription="slide"
                aria-label={`${names[i] ?? ""}, ${i + 1} of ${items.length}`}
              >
                {child}
              </div>
            ))}
          </div>
          <button
            type="button"
            className={`${s.arrow} ${s.prev}`}
            onClick={() => show(Math.max(0, active - 1))}
            disabled={edges.start}
            aria-label={`Previous: ${label}`}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className={`${s.arrow} ${s.next}`}
            onClick={() => show(Math.min(items.length - 1, active + 1))}
            disabled={edges.end}
            aria-label={`Next: ${label}`}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className={s.dots}>
        {names.map((name, i) => (
          <button
            key={name}
            type="button"
            className={s.dot}
            aria-label={`Show ${name}`}
            aria-current={i === active || undefined}
            onClick={() => show(i)}
          />
        ))}
      </div>
    </section>
  );
}
