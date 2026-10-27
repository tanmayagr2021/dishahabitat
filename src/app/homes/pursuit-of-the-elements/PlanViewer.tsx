"use client";

import Image from "next/image";
import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, CloseIcon } from "@/components/showroom/Icons";
import g from "@/components/ds/Gallery.module.css";
import s from "./PlanViewer.module.css";

type Props = { src: string; alt: string; width: number; height: number };

const MIN = 1;
const MAX = 5;

/*
 * The master plan, with a full-screen viewer for reading its legend: pinch on a phone, the wheel or
 * the + and − buttons on a computer, and drag (or scroll) to move around. The full file loads only
 * when the viewer opens.
 */
export function PlanViewer({ src, alt, width, height }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const zoom = useRef(MIN);
  const drag = useRef<{ x: number; y: number; l: number; t: number } | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  /* Zooms about a point of the visible area (its centre by default), so that point stays put. */
  const zoomTo = (next: number, px?: number, py?: number) => {
    const el = scroller.current;
    if (!el) return;
    const z = Math.min(MAX, Math.max(MIN, next));
    const r = z / zoom.current;
    const x = px ?? el.clientWidth / 2;
    const y = py ?? el.clientHeight / 2;
    zoom.current = z;
    el.style.setProperty("--z", String(z));
    el.scrollLeft = (el.scrollLeft + x) * r - x;
    el.scrollTop = (el.scrollTop + y) * r - y;
  };

  const show = (e: { currentTarget: HTMLElement }) => {
    opener.current = e.currentTarget;
    setOpen(true);
    dialog.current?.showModal();
  };

  /* The wheel (and a trackpad pinch) zooms about the pointer; it needs a non-passive listener. */
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const box = el.getBoundingClientRect();
      zoomTo(zoom.current * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), e.clientX - box.left, e.clientY - box.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || zoom.current === MIN) return;
    const el = e.currentTarget;
    drag.current = { x: e.clientX, y: e.clientY, l: el.scrollLeft, t: el.scrollTop };
    el.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    e.currentTarget.scrollLeft = d.l - (e.clientX - d.x);
    e.currentTarget.scrollTop = d.t - (e.clientY - d.y);
  };

  return (
    <>
      <button type="button" className={s.thumb} onClick={show} aria-haspopup="dialog">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1440px) 1344px, calc(100vw - 32px)"
          quality={82}
          loading="lazy"
          className={s.thumbImg}
        />
        <span className="sr-only">Open the master plan full size</span>
      </button>
      <div className={s.actions}>
        <button type="button" className="btn btn-soft" onClick={show} aria-haspopup="dialog">
          Open full size
        </button>
        <a className="text-link" href={src} target="_blank" rel="noopener noreferrer">
          Open in a new tab <ArrowRight />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      <dialog
        ref={dialog}
        className={`${g.viewer} ${s.viewer}`}
        aria-label="Master plan viewer"
        onClose={() => {
          setOpen(false);
          zoom.current = MIN;
          scroller.current?.style.setProperty("--z", "1");
          opener.current?.focus();
        }}
      >
        <div className={g.frame}>
          <div className={g.bar}>
            <div className={s.zoom}>
              <button type="button" className={g.round} onClick={() => zoomTo(zoom.current / 1.5)} aria-label="Zoom out">
                <span aria-hidden="true">−</span>
              </button>
              <button type="button" className={g.round} onClick={() => zoomTo(zoom.current * 1.5)} aria-label="Zoom in">
                <span aria-hidden="true">+</span>
              </button>
              <p className={s.hint}>Pinch, scroll or use + to zoom</p>
            </div>
            <button type="button" className={g.round} onClick={() => dialog.current?.close()} aria-label="Close the master plan" autoFocus>
              <CloseIcon />
            </button>
          </div>
          <div
            ref={scroller}
            className={s.scroller}
            style={{ "--ar": width / height } as CSSProperties}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
            tabIndex={0}
            aria-label="Master plan, zoomable"
            role="region"
          >
            {open && (
              <Image src={src} alt={alt} width={width} height={height} unoptimized className={s.full} style={{ aspectRatio: `${width} / ${height}` }} />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
