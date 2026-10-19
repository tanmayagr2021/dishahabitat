"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Pointer, RotateCcw, Shuffle } from "lucide-react";

/*
 * A gig wall. Posters, polaroids and the award are taped up at angles; with a mouse you can drag
 * anything around (it comes to the front), and tapping a poster turns it over to its ticket.
 * Positions are in container-width units so the whole wall scales as one piece; phones get their
 * own, taller arrangement. Dates and venues are only those printed on the posters themselves.
 */
type Spot = { x: number; y: number; w: number; r: number };
type Base = { id: string; src: string; ratio: number; alt: string; d: Spot; m: Spot };
type Poster = Base & { kind: "poster"; artist: string; billing: string; credit: string; when?: string; where?: string };
type Polaroid = Base & { kind: "polaroid"; caption: string };
type Award = Base & { kind: "award" };
type Piece = Poster | Polaroid | Award;

const pieces: Piece[] = [
  { kind: "poster", id: "sel", credit: "Presented by", src: "/images/events/shankar-ehsaan-loy.webp", ratio: 306 / 490, alt: "Poster: Shankar Ehsaan Loy, a Red Live concert", artist: "Shankar Ehsaan Loy", billing: "A Red Live concert", when: "21 December 2024", where: "New Horizon College of Engineering, Bellandur", d: { x: 1.5, y: 3, w: 15.5, r: -6 }, m: { x: 2, y: 2, w: 44, r: -5 } },
  { kind: "poster", id: "shreya", credit: "Presented by", src: "/images/events/shreya-ghoshal.webp", ratio: 285 / 467, alt: "Poster: Shreya Ghoshal, All Hearts Tour", artist: "Shreya Ghoshal", billing: "All Hearts Tour", when: "11 May 2024", where: "New Horizon College of Engineering, Bellandur", d: { x: 18.5, y: 8, w: 15, r: 4 }, m: { x: 52, y: 9, w: 44, r: 4 } },
  { kind: "award", id: "award", src: "/images/events/et-award-certificate.webp", ratio: 315 / 227, alt: "ET Business Awards 2025 Certificate of Excellence for Disha Pursuit of the Elements, Innovation Real Estate Project of the Year", d: { x: 36, y: 4, w: 21, r: -2 }, m: { x: 5, y: 80, w: 72, r: -3 } },
  { kind: "poster", id: "armaan", credit: "With", src: "/images/events/armaan-malik.webp", ratio: 308 / 499, alt: "Poster: Armaan Malik, live in Bengaluru", artist: "Armaan Malik", billing: "Live in Bengaluru", when: "13 September", where: "Phoenix Marketcity, Whitefield", d: { x: 60, y: 1.5, w: 15.5, r: -3 }, m: { x: 4, y: 140, w: 44, r: -4 } },
  { kind: "poster", id: "piyush", credit: "Presented by", src: "/images/events/piyush-mishra.webp", ratio: 216 / 435, alt: "Poster: Piyush Mishra’s Ballimaaraan, live in concert", artist: "Piyush Mishra", billing: "Ballimaaraan, live in concert", d: { x: 81, y: 4, w: 12.5, r: 6 }, m: { x: 55, y: 152, w: 38, r: 6 } },
  { kind: "polaroid", id: "stage", src: "/images/events/et-award-stage.webp", ratio: 300 / 146, alt: "Receiving the ET Business Award on stage", caption: "Award night!", d: { x: 39, y: 21, w: 15, r: 5 }, m: { x: 47, y: 117, w: 50, r: 5 } },
  { kind: "polaroid", id: "b1", src: "/images/events/backstage-1.webp", ratio: 365 / 204, alt: "The Disha Habitat team with visiting artists, backstage", caption: "Backstage", d: { x: 2, y: 33, w: 15, r: 5 }, m: { x: 52, y: 260, w: 44, r: -5 } },
  { kind: "poster", id: "chithra", credit: "With", src: "/images/events/ks-chithra.webp", ratio: 372 / 167, alt: "Poster: K S Chithra, live in concert", artist: "K S Chithra", billing: "Live in concert, multilingual", d: { x: 18, y: 37.5, w: 25, r: 3 }, m: { x: 3, y: 213, w: 80, r: 3 } },
  { kind: "polaroid", id: "b3", src: "/images/events/backstage-3.webp", ratio: 305 / 205, alt: "The Disha Habitat team with a visiting artist after the show", caption: "After the show", d: { x: 44.5, y: 34, w: 13, r: -4 }, m: { x: 6, y: 334, w: 44, r: 5 } },
  { kind: "poster", id: "sunil", credit: "Co-powered by", src: "/images/events/sunil-grover.webp", ratio: 220 / 334, alt: "Poster: Sunil Grover live", artist: "Sunil Grover", billing: "Live", when: "2 December 2023", where: "Phoenix Marketcity", d: { x: 59, y: 29, w: 13, r: -5 }, m: { x: 5, y: 258, w: 42, r: -4 } },
  { kind: "polaroid", id: "b2", src: "/images/events/backstage-2.webp", ratio: 287 / 218, alt: "The Disha Habitat team with a visiting artist, backstage", caption: "Meet and greet", d: { x: 73.5, y: 31, w: 12.5, r: 6 }, m: { x: 52, y: 302, w: 44, r: 6 } },
  { kind: "polaroid", id: "b4", src: "/images/events/backstage-4.webp", ratio: 282 / 175, alt: "The Disha Habitat team with a visiting artist in the green room", caption: "Green room", d: { x: 86, y: 27, w: 12.5, r: -7 }, m: { x: 50, y: 352, w: 46, r: -6 } },
];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const DEMO = ["sel", "shreya", "armaan"];

export function GigWall() {
  const wall = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, HTMLDivElement | null>>({});
  const [offset, setOffset] = useState<Record<string, { x: number; y: number; r: number }>>({});
  const [order, setOrder] = useState(() => pieces.map((p) => p.id));
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [turning, setTurning] = useState<Record<string, boolean>>({});
  const [pinned, setPinned] = useState(false);
  const [settled, setSettled] = useState(false);
  const [hand, setHand] = useState<{ x: number; y: number; on: boolean; tap: number } | null>(null);
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const touched = useRef(false);
  const lastPointer = useRef(0);
  const timers = useRef<number[]>([]);

  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  const stopDemo = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setHand(null);
  };

  // Turn a poster over: squash to an edge, swap the face at the midpoint, open out again.
  const turn = (id: string, to?: boolean) => {
    setTurning((t) => ({ ...t, [id]: true }));
    window.setTimeout(() => setFlipped((f) => ({ ...f, [id]: to ?? !f[id] })), 210);
    window.setTimeout(() => setTurning((t) => ({ ...t, [id]: false })), 430);
  };

  const pointAt = (id: string, tap: number) => {
    const w = wall.current?.getBoundingClientRect();
    const el = els.current[id]?.getBoundingClientRect();
    if (!w || !el) return;
    setHand({ x: el.left - w.left + el.width * 0.55, y: el.top - w.top + el.height * 0.45, on: true, tap });
  };

  // Pieces are taped up one after another when the wall first comes into view; then, unless the
  // visitor gets there first, a hand turns a few posters over to show that they can.
  useEffect(() => {
    const el = wall.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setPinned(true);
        later(1800, () => setSettled(true));
        if (reduce) return;
        let t = 2200;
        DEMO.forEach((id, i) => {
          later(t, () => pointAt(id, i * 2));
          later(t + 750, () => {
            if (touched.current) return;
            pointAt(id, i * 2 + 1);
            turn(id, true);
          });
          t += 1900;
        });
        later(t + 900, () => {
          if (touched.current) return;
          setHand((h) => (h ? { ...h, on: false } : h));
          DEMO.forEach((id, i) => later(i * 160, () => turn(id, false)));
        });
        later(t + 1600, () => setHand(null));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const toFront = (id: string) => setOrder((o) => (o[o.length - 1] === id ? o : [...o.filter((k) => k !== id), id]));

  const onDown = (e: ReactPointerEvent<HTMLElement>, id: string) => {
    if (!touched.current) {
      touched.current = true;
      stopDemo();
    }
    toFront(id);
    // Touch scrolls the page as usual; dragging is for a mouse or pen.
    if (e.pointerType === "touch") return;
    const o = offset[id] ?? { x: 0, y: 0, r: 0 };
    drag.current = { id, sx: e.clientX, sy: e.clientY, ox: o.x, oy: o.y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  // While dragging, move the element directly: no re-render on every pointer move.
  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    const el = els.current[d.id];
    if (!el) return;
    if (!d.moved) el.classList.add("is-dragging");
    d.moved = true;
    el.style.translate = `${d.ox + dx}px ${d.oy + dy}px`;
  };
  const onUp = (e: ReactPointerEvent<HTMLElement>, id: string, flippable: boolean) => {
    const d = drag.current;
    drag.current = null;
    if (d?.moved) {
      els.current[id]?.classList.remove("is-dragging");
      const x = d.ox + (e.clientX - d.sx);
      const y = d.oy + (e.clientY - d.sy);
      setOffset((s) => ({ ...s, [id]: { x, y, r: s[id]?.r ?? 0 } }));
      return;
    }
    if (flippable) turn(id);
  };

  const shuffle = () => {
    touched.current = true;
    stopDemo();
    const w = wall.current?.clientWidth ?? 1000;
    setOffset(Object.fromEntries(pieces.map((p) => [p.id, { x: rand(-0.05, 0.05) * w, y: rand(-0.04, 0.04) * w, r: rand(-8, 8) }])));
    setOrder((o) => [...o].sort(() => Math.random() - 0.5));
    setFlipped({});
  };
  const tidy = () => {
    touched.current = true;
    stopDemo();
    setOffset({});
    setOrder(pieces.map((p) => p.id));
    setFlipped({});
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.95rem] font-medium text-earth">
          <span className="hidden md:inline">Drag them around. </span>Tap a poster to turn it over ↓
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={shuffle} className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-sm font-medium transition-colors hover:bg-ink hover:text-paper">
            <Shuffle aria-hidden className="size-4" /> Shuffle
          </button>
          <button type="button" onClick={tidy} className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-sm font-medium transition-colors hover:bg-ink hover:text-paper">
            <RotateCcw aria-hidden className="size-4" /> Tidy up
          </button>
        </div>
      </div>

      <div ref={wall} className={`gig-wall mt-6 ${pinned ? "is-pinned" : ""} ${settled ? "is-settled" : ""}`}>
        {hand && (
          <div aria-hidden className={`gig-hint ${hand.tap % 2 ? "is-tap" : ""}`} style={{ left: hand.x, top: hand.y, opacity: hand.on ? 1 : 0 }}>
            <span className="flex size-14 items-center justify-center rounded-full bg-paper/95 shadow-[0_10px_30px_-8px_rgb(21_26_23/0.55)] ring-1 ring-ink/10">
              <Pointer aria-hidden className="size-6 text-ink" strokeWidth={1.8} />
            </span>
          </div>
        )}
        {pieces.map((p, i) => {
          const o = offset[p.id] ?? { x: 0, y: 0, r: 0 };
          const isFlipped = !!flipped[p.id];
          const style = {
            "--dx": `${p.d.x}cqw`, "--dy": `${p.d.y}cqw`, "--dw": `${p.d.w}cqw`, "--dr": `${p.d.r}deg`,
            "--mx": `${p.m.x}cqw`, "--my": `${p.m.y}cqw`, "--mw": `${p.m.w}cqw`, "--mr": `${p.m.r}deg`,
            "--i": i,
            zIndex: order.indexOf(p.id) + 1,
            translate: `${o.x}px ${o.y}px`,
          } as CSSProperties;
          const tilt = { rotate: `${o.r}deg` } as CSSProperties;
          const flippable = p.kind === "poster";

          return (
            <div key={p.id} ref={(el) => { els.current[p.id] = el; }} className="gig-piece" style={style}>
              <button
                type="button"
                aria-label={flippable ? `${p.alt}. ${isFlipped ? "Showing the ticket; press to see the poster" : "Press to turn it over"}` : p.kind === "polaroid" ? `${p.caption}: ${p.alt}` : p.alt}
                aria-pressed={flippable ? isFlipped : undefined}
                onPointerDown={(e) => onDown(e, p.id)}
                onPointerMove={onMove}
                onPointerUp={(e) => {
                  lastPointer.current = Date.now();
                  onUp(e, p.id, flippable);
                }}
                onPointerCancel={() => {
                  if (drag.current?.id === p.id) els.current[p.id]?.classList.remove("is-dragging");
                  drag.current = null;
                }}
                onClick={() => {
                  // Screen readers and voice control "click" without pointer events.
                  if (flippable && Date.now() - lastPointer.current > 400) {
                    touched.current = true;
                    stopDemo();
                    toFront(p.id);
                    turn(p.id);
                  }
                }}
                onKeyDown={(e) => {
                  if (flippable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    touched.current = true;
                    stopDemo();
                    toFront(p.id);
                    turn(p.id);
                  }
                }}
                className="gig-hit block w-full cursor-grab text-left active:cursor-grabbing"
                style={tilt}
              >
                <span aria-hidden className="gig-tape" />
                {p.kind === "poster" && (
                  <span className={`gig-flip block ${turning[p.id] ? "is-turning" : ""}`} style={{ aspectRatio: p.ratio }}>
                    <span className="gig-face block overflow-hidden rounded-[3px] bg-ink shadow-[0_14px_24px_-14px_rgb(21_26_23/0.55)]" data-hidden={isFlipped ? "" : undefined}>
                      <Image src={p.src} alt="" fill draggable={false} sizes="(min-width: 768px) 18vw, 45vw" className="object-cover" />
                    </span>
                    <Ticket poster={p} hidden={!isFlipped} />
                  </span>
                )}
                {p.kind === "polaroid" && (
                  <span className="block bg-[#fbf8f1] p-[6%] pb-0 shadow-[0_14px_24px_-14px_rgb(21_26_23/0.55)]">
                    <span className="relative block overflow-hidden bg-ink" style={{ aspectRatio: p.ratio < 1.5 ? p.ratio : 1.5 }}>
                      <Image src={p.src} alt="" fill draggable={false} sizes="(min-width: 768px) 15vw, 45vw" className="object-cover" />
                    </span>
                    <span className="block py-[0.35em] text-center font-[family-name:var(--font-caveat)] text-[clamp(1rem,1.5cqw,1.5rem)] leading-tight text-ink/80">{p.caption}</span>
                  </span>
                )}
                {p.kind === "award" && (
                  <span className="relative block rounded-[4px] bg-[linear-gradient(135deg,#d9b978,#8a6a32_45%,#e2c88f_70%,#7d5e2a)] p-[4%] shadow-[0_16px_28px_-16px_rgb(21_26_23/0.6)]">
                    <span className="relative block overflow-hidden bg-ink" style={{ aspectRatio: p.ratio }}>
                      <Image src={p.src} alt="" fill draggable={false} sizes="(min-width: 768px) 22vw, 70vw" className="object-cover" />
                    </span>
                    <span aria-hidden className="absolute -right-[7%] -top-[12%] grid aspect-square w-[30%] rotate-12 place-items-center rounded-full bg-earth text-center text-paper shadow-lg ring-4 ring-earth/30">
                      <span className="font-[family-name:var(--font-caveat)] text-[clamp(0.85rem,1.4cqw,1.35rem)] leading-[0.95]">
                        ET
                        <br />
                        2025
                      </span>
                    </span>
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* The back of a poster: an admit-one ticket with the details printed on the poster. */
function Ticket({ poster: p, hidden }: { poster: Poster; hidden: boolean }) {
  return (
    <span data-hidden={hidden ? "" : undefined} className="gig-face flex flex-col overflow-hidden rounded-[6px] bg-paper text-ink shadow-[0_18px_30px_-14px_rgb(21_26_23/0.55)]">
      <span className="flex items-center justify-between bg-forest px-[8%] py-[5%] text-paper">
        <span className="text-[clamp(0.55rem,0.8cqw,0.75rem)] font-semibold uppercase tracking-[0.2em]">{p.credit}</span>
        <span className="text-[clamp(0.55rem,0.8cqw,0.75rem)] text-brass">Disha Habitat</span>
      </span>
      <span className="flex flex-1 flex-col justify-center gap-[0.4em] border-b-2 border-dashed border-ink/20 px-[8%] py-[6%]">
        <span className="text-[clamp(0.6rem,0.9cqw,0.8rem)] font-medium text-brass-ink">{p.billing}</span>
        <span className="serif text-[clamp(1.1rem,2cqw,1.9rem)] leading-[1.02]">{p.artist}</span>
        {p.when && <span className="text-[clamp(0.65rem,0.95cqw,0.9rem)] font-semibold tabular-nums">{p.when}</span>}
        {p.where && <span className="text-[clamp(0.6rem,0.85cqw,0.8rem)] leading-snug text-mute">{p.where}</span>}
      </span>
      <span className="flex items-center justify-between gap-3 px-[8%] py-[6%]">
        <span aria-hidden className="h-[1.6em] flex-1 bg-[repeating-linear-gradient(90deg,var(--color-ink)_0_2px,transparent_2px_4px,var(--color-ink)_4px_5px,transparent_5px_8px)] opacity-80" />
        <span className="font-[family-name:var(--font-caveat)] text-[clamp(0.9rem,1.3cqw,1.2rem)] leading-none text-earth">what a night!</span>
      </span>
    </span>
  );
}
