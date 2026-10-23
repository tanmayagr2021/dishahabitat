"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CloseIcon } from "@/components/showroom/Icons";
import type { Media } from "@/lib/projects";
import s from "./Gallery.module.css";

export type GalleryItem = Media & { project?: string };

const kindLabel = { render: "Artist’s impression", plan: "Plan", photo: null } as const;

/*
 * Pictures in an even grid (the first one large), each opening a full-screen viewer: arrow keys and
 * swipes move through them, Escape closes, and focus returns to the picture that opened it.
 */
export function Gallery({ items, layout = "mosaic" }: { items: readonly GalleryItem[]; layout?: "mosaic" | "grid" }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const openedFrom = useRef<number | null>(null);
  const touch = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    openedFrom.current = i;
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      if (openedFrom.current !== null) triggers.current[openedFrom.current]?.focus();
      openedFrom.current = null;
      setIndex(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const current = index === null ? null : items[index];

  return (
    <>
      <ul className={s.grid} data-layout={layout}>
        {items.map((item, i) => {
          const tag = kindLabel[item.kind];
          return (
            <li key={item.src} className={s.tile}>
              <button
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                type="button"
                className={s.trigger}
                onClick={() => open(i)}
                aria-label={`View larger: ${item.caption}${item.project ? `, ${item.project}` : ""}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={i === 0 && layout === "mosaic" ? "(min-width: 900px) 66vw, 100vw" : "(min-width: 900px) 33vw, 50vw"}
                  quality={78}
                  className={item.kind === "plan" ? s.plan : s.img}
                />
                {tag && <span className={s.tag}>{tag}</span>}
                <span className={s.caption}>{item.caption}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        className={s.viewer}
        aria-label="Picture viewer"
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest("img, button, figcaption")) close();
        }}
        onTouchStart={(e) => {
          touch.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          const end = e.changedTouches[0]?.clientX;
          touch.current = null;
          if (start === null || end === undefined || Math.abs(end - start) < 50) return;
          step(end < start ? 1 : -1);
        }}
      >
        {current && index !== null && (
          <div className={s.frame}>
            <div className={s.bar}>
              <p className={s.count} aria-live="polite">
                {index + 1} / {items.length}
              </p>
              <button type="button" className={s.round} onClick={close} aria-label="Close picture viewer" autoFocus>
                <CloseIcon />
              </button>
            </div>
            <figure className={s.figure}>
              <div className={s.stage}>
                <Image key={current.src} src={current.src} alt={current.alt} fill sizes="100vw" quality={82} className={s.full} />
                {kindLabel[current.kind] && <span className={s.tag}>{kindLabel[current.kind]}</span>}
              </div>
              <figcaption className={s.figcaption}>
                {current.caption}
                {current.project && <span> · {current.project}</span>}
              </figcaption>
            </figure>
            <div className={s.arrows}>
              <button type="button" className={s.round} onClick={() => step(-1)} aria-label="Previous picture">
                <ChevronLeft />
              </button>
              <button type="button" className={s.round} onClick={() => step(1)} aria-label="Next picture">
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
