"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Media } from "@/lib/projects";
import { MediaBadge } from "@/components/ui";

export type GalleryItem = Media & { project?: string };

type Props = {
  items: GalleryItem[];
  /* Tailwind classes per tile, applied in order; reuse the last for extra tiles. */
  tileClasses: string[];
  gridClassName: string;
  sizes: string;
};

export function GalleryGrid({ items, tileClasses, gridClassName, sizes }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const openedFrom = useRef<number | null>(null);

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
      // Return focus to the tile that opened the viewer, wherever the visitor browsed to.
      if (openedFrom.current !== null) triggerRefs.current[openedFrom.current]?.focus();
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
      <ul className={gridClassName}>
        {items.map((item, i) => (
          <li
            key={item.src}
            data-reveal="bloom"
            style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as CSSProperties}
            className={tileClasses[Math.min(i, tileClasses.length - 1)]}
          >
            <button
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
              type="button"
              onClick={() => open(i)}
              className="group relative block size-full overflow-hidden rounded-[3px] bg-paper-3 text-left"
              aria-label={`View larger: ${item.caption}${item.project ? `, ${item.project}` : ""}`}
            >
              <MediaBadge kind={item.kind} />
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={sizes}
                className={`transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04] ${item.kind === "plan" ? "bg-white object-contain p-3" : "object-cover"}`}
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/70 to-transparent p-4 pt-12 text-sm text-paper opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                {item.caption}
                {item.project && <span className="block text-xs text-paper/70">{item.project}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Image viewer"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-paper backdrop:bg-ink/80"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {current && index !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 md:px-8">
              <p className="label tabular-nums text-paper/60" aria-live="polite">
                {index + 1} / {items.length}
              </p>
              <button
                type="button"
                onClick={close}
                className="inline-flex size-12 items-center justify-center rounded-full text-paper hover:bg-paper/10"
                aria-label="Close image viewer"
                autoFocus
              >
                <X className="size-6" strokeWidth={1.5} />
              </button>
            </div>

            <figure className="relative mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 md:px-20">
              <div className="relative min-h-0 flex-1">
                <MediaBadge kind={current.kind} />
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="py-5 text-center text-sm text-paper/85">
                {current.caption}
                {current.project && <span className="text-paper/55"> — {current.project}</span>}
              </figcaption>
            </figure>

            <div className="flex justify-center gap-3 pb-6 md:pointer-events-none md:absolute md:inset-x-4 md:top-1/2 md:-translate-y-1/2 md:justify-between md:pb-0">
              <button
                type="button"
                onClick={() => step(-1)}
                className="pointer-events-auto inline-flex size-12 items-center justify-center rounded-full border border-paper/25 text-paper hover:bg-paper hover:text-ink"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="pointer-events-auto inline-flex size-12 items-center justify-center rounded-full border border-paper/25 text-paper hover:bg-paper hover:text-ink"
                aria-label="Next image"
              >
                <ChevronRight className="size-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
