"use client";

import { useEffect, useRef, useState } from "react";
import { area, base, mapLabels, mapPlots, tiles } from "@/lib/map.generated";
import { MOTION_OK, useMedia } from "@/lib/useMedia";
import s from "./CommunityMap.module.css";

/*
 * The map prototype's idea, in the showroom's colours: a map of East Bengaluru beside the community
 * cards. When a card comes into view the map flies to that community's plot (out over the city and back
 * down, as the map prototype's camera does); a name on the map brings its card into view.
 *
 * Drawn on a canvas from pictures made by scripts/build-map.py: one plate for the whole area, and sharper
 * tiles near each plot, loaded only when the map flies there. Plot outlines are drawn on top, in brass.
 */

export type MapItem = { slug: string; name: string; place: string };
type Props = { items: MapItem[]; active: number; onPick: (i: number) => void };

/* The camera: the centre of the view and its width, in metres. */
type Cam = { x: number; y: number; w: number };

const GROUND = "#f2f2f2"; // the pictures' own ground colour
const BRASS = "#c6a46b";
const BRASS_INK = "#86652f";
const FOCUS_SPAN = 4800; // metres across the map's shorter side when it rests on a community
const ZOOM = { min: 0.06, max: 0.11 }; // px per metre at rest: the tiles are drawn at 0.2
const MAX_DPR = 2;

const plotBySlug = new Map(mapPlots.map((p) => [p.slug, p]));
const plotBox = new Map(
  mapPlots.map((p) => {
    const xs = p.points.map((q) => q[0]);
    const ys = p.points.map((q) => q[1]);
    return [p.slug, { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }];
  }),
);
const haveTile = new Set<number>(tiles.have);

/*
 * The smooth zoom of van Wijk and Nuij (2003), "Smooth and efficient zooming and panning": the camera
 * rises as far as the distance needs, so a long move reads as a flight rather than a blur.
 */
function flight(a: Cam, b: Cam) {
  const rho = Math.SQRT2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d2 = dx * dx + dy * dy;
  if (d2 < 1) {
    const S = Math.log(b.w / a.w) / rho;
    return {
      S: Math.abs(S),
      at: (t: number): Cam => ({ x: a.x + t * dx, y: a.y + t * dy, w: a.w * Math.exp(rho * t * S) }),
    };
  }
  const d1 = Math.sqrt(d2);
  const b0 = (b.w * b.w - a.w * a.w + 4 * d2) / (4 * a.w * d1);
  const b1 = (b.w * b.w - a.w * a.w - 4 * d2) / (4 * b.w * d1);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
  const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  const S = (r1 - r0) / rho;
  const c0 = Math.cosh(r0);
  const s0 = Math.sinh(r0);
  return {
    S,
    at: (t: number): Cam => {
      const q = rho * t * S + r0;
      const u = (a.w / (2 * d1)) * (c0 * Math.tanh(q) - s0);
      return { x: a.x + u * dx, y: a.y + u * dy, w: (a.w * c0) / Math.cosh(q) };
    },
  };
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/* Where the camera rests for a card: on its plot, or over all of them when the plot is not mapped. */
function restFor(slug: string | undefined, W: number, H: number): Cam {
  const p = slug ? plotBySlug.get(slug) : undefined;
  if (p) {
    const z = Math.min(ZOOM.max, Math.max(ZOOM.min, Math.min(W, H) / FOCUS_SPAN));
    return { x: p.centre[0], y: p.centre[1], w: W / z };
  }
  // every plot in view, with room above the top one for its name and below for the note
  const xs = mapPlots.map((q) => q.centre[0]);
  const ys = mapPlots.map((q) => q.centre[1]);
  const pad = { x: 56, top: 56, bottom: 64 };
  const bw = Math.max(...xs) - Math.min(...xs);
  const bh = Math.max(...ys) - Math.min(...ys);
  const z = Math.min((W - 2 * pad.x) / bw, (H - pad.top - pad.bottom) / bh);
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2 + (pad.bottom - pad.top) / 2 / z;
  return { x: (Math.max(...xs) + Math.min(...xs)) / 2, y: cy, w: W / z };
}

/*
 * Where a plot's name sits, in screen pixels: above the plot, or (when there is no room above) below it,
 * to its right or to its left. Each side has its own anchor point and its own shift for the tag.
 */
type Side = "above" | "below" | "right" | "left";
const SIDES: Side[] = ["above", "below", "right", "left"];
const SHIFT: Record<Side, string> = {
  above: "translate(-50%, -100%)",
  below: "translate(-50%, 0)",
  right: "translate(0, -50%)",
  left: "translate(-100%, -50%)",
};

function pinAnchor(slug: string, left: number, top: number, z: number, side: Side = "above") {
  const b = plotBox.get(slug)!;
  const p = plotBySlug.get(slug)!;
  const cx = (p.centre[0] - left) * z;
  const cy = (p.centre[1] - top) * z;
  const mid = ((b.x0 + b.x1) / 2 - left) * z;
  if (side === "below") return { x: mid, y: Math.max((b.y1 - top) * z, cy + 6) + 8 };
  if (side === "right") return { x: Math.max((b.x1 - left) * z, cx + 6) + 8, y: cy };
  if (side === "left") return { x: Math.min((b.x0 - left) * z, cx - 6) - 8, y: cy };
  return { x: mid, y: Math.min((b.y0 - top) * z, cy - 6) - 8 };
}

/* The room a name takes on each side of its anchor, with its 5 px pointer. */
function pinRect(side: Side, a: { x: number; y: number }, w: number, h: number) {
  if (side === "below") return { x: a.x - w / 2, y: a.y - 5, w, h: h + 5 };
  if (side === "right") return { x: a.x - 5, y: a.y - h / 2, w: w + 5, h };
  if (side === "left") return { x: a.x - w, y: a.y - h / 2, w: w + 5, h };
  return { x: a.x - w / 2, y: a.y - h, w, h: h + 5 };
}

type Rect = { x: number; y: number; w: number; h: number };
/* The upright box round a name of w x h turned by deg degrees about its centre (x, y). */
function turned(x: number, y: number, w: number, h: number, deg: number): Rect {
  const a = (deg * Math.PI) / 180;
  const bw = Math.abs(w * Math.cos(a)) + Math.abs(h * Math.sin(a));
  const bh = Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a));
  return { x: x - bw / 2, y: y - bh / 2, w: bw, h: bh };
}
const overlaps = (a: Rect, b: Rect, gap = 6) =>
  a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;

export function CommunityMap({ items, active, onPick }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pins = useRef<(HTMLButtonElement | null)[]>([]);
  const names = useRef<(HTMLSpanElement | null)[]>([]);
  const edges = useRef<(HTMLButtonElement | null)[]>([]);
  const note = useRef<HTMLParagraphElement>(null);
  const credit = useRef<HTMLParagraphElement>(null);
  const motionOk = useMedia(MOTION_OK);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  /* Everything the drawing needs between frames lives here, outside React. */
  const st = useRef({
    W: 0,
    H: 0,
    dpr: 1,
    cam: null as Cam | null,
    target: active,
    base: null as HTMLImageElement | null,
    tiles: new Map<number, HTMLImageElement | null>(),
    frame: 0,
    flightId: 0,
    draw: () => {},
    settle: () => {},
    want: (() => {}) as (cam: Cam) => void,
  });

  // Start loading only when the map is about to scroll into view.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Drawing, sizing and tiles.
  useEffect(() => {
    if (!near) return;
    const el = root.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const S = st.current;

    const request = (n: number) => {
      if (S.tiles.has(n)) return;
      S.tiles.set(n, null);
      const img = new Image();
      img.decoding = "async";
      img.src = `/map/t/${n % tiles.cols}-${Math.floor(n / tiles.cols)}.webp`;
      img
        .decode()
        .then(() => {
          S.tiles.set(n, img);
          schedule();
        })
        .catch(() => S.tiles.delete(n));
    };

    /* Loads the tiles a resting view needs. */
    const want = (cam: Cam) => {
      const z = S.W / cam.w;
      const hw = S.W / 2 / z;
      const hh = S.H / 2 / z;
      const T = tiles.metres;
      for (let r = Math.floor((cam.y - hh) / T); r <= Math.floor((cam.y + hh) / T); r++) {
        for (let c = Math.floor((cam.x - hw) / T); c <= Math.floor((cam.x + hw) / T); c++) {
          if (c < 0 || r < 0 || c >= tiles.cols || r >= tiles.rows) continue;
          const n = r * tiles.cols + c;
          if (haveTile.has(n)) request(n);
        }
      }
    };

    const draw = () => {
      const { W, H, dpr, cam } = S;
      if (!cam || !W) return;
      const z = W / cam.w;
      const left = cam.x - W / 2 / z;
      const top = cam.y - H / 2 / z;
      const k = z * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = GROUND;
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      if (S.base) ctx.drawImage(S.base, -left * k, -top * k, area.width * k, area.height * k);

      // The sharper tiles, faded in as the camera comes down. Edges snap to whole device pixels so
      // neighbouring tiles meet without a hairline between them.
      const fade = Math.min(1, Math.max(0, (z - 0.03) / 0.025));
      if (fade > 0) {
        ctx.globalAlpha = fade;
        const T = tiles.metres;
        const c0 = Math.max(0, Math.floor(left / T));
        const r0 = Math.max(0, Math.floor(top / T));
        const c1 = Math.min(tiles.cols - 1, Math.floor((left + W / z) / T));
        const r1 = Math.min(tiles.rows - 1, Math.floor((top + H / z) / T));
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const img = S.tiles.get(r * tiles.cols + c);
            if (!img) continue;
            const x0 = Math.round((c * T - left) * k);
            const y0 = Math.round((r * T - top) * k);
            const x1 = Math.round(((c + 1) * T - left) * k);
            const y1 = Math.round(((r + 1) * T - top) * k);
            ctx.drawImage(img, x0, y0, x1 - x0, y1 - y0);
          }
        }
        ctx.globalAlpha = 1;
      }

      // Plots: outlines in brass, the shown community solid. Too small to read as a shape, a dot.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const current = items[S.target]?.slug;
      const shownPlot = current ? plotBySlug.get(current) : undefined;
      if (shownPlot) {
        // a soft brass glow, so the community on show is found at a glance however small its plot
        const b = plotBox.get(shownPlot.slug)!;
        const x = (shownPlot.centre[0] - left) * z;
        const y = (shownPlot.centre[1] - top) * z;
        const r = Math.max(30, (Math.max(b.x1 - b.x0, b.y1 - b.y0) * z) / 2 + 22);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
        glow.addColorStop(0, "rgb(198 164 107 / 0.42)");
        glow.addColorStop(0.55, "rgb(198 164 107 / 0.16)");
        glow.addColorStop(1, "rgb(198 164 107 / 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const p of mapPlots) {
        const on = p.slug === current;
        const b = plotBox.get(p.slug)!;
        const span = Math.max(b.x1 - b.x0, b.y1 - b.y0) * z;
        if (span < 9) {
          const x = (p.centre[0] - left) * z;
          const y = (p.centre[1] - top) * z;
          ctx.beginPath();
          ctx.arc(x, y, on ? 6 : 4.5, 0, Math.PI * 2);
          ctx.fillStyle = on ? BRASS : "#d9c39c";
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#fff";
          ctx.stroke();
          continue;
        }
        ctx.beginPath();
        p.points.forEach(([x, y], i) => {
          const sx = (x - left) * z;
          const sy = (y - top) * z;
          if (i) ctx.lineTo(sx, sy);
          else ctx.moveTo(sx, sy);
        });
        ctx.closePath();
        ctx.fillStyle = on ? BRASS : "rgb(198 164 107 / 0.45)";
        ctx.fill();
        ctx.lineJoin = "round";
        ctx.lineWidth = on ? 1.5 : 1;
        ctx.strokeStyle = BRASS_INK;
        ctx.stroke();
      }

      // Names follow their plots and places every frame.
      items.forEach((it, i) => {
        const pin = pins.current[i];
        if (!pin || !plotBox.has(it.slug)) return;
        // in flight every name sits above its plot; at rest, where settle() found room
        const side = "moving" in el.dataset ? "above" : ((pin.dataset.side as Side | undefined) ?? "above");
        const { x, y } = pinAnchor(it.slug, left, top, z, side);
        pin.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) ${SHIFT[side]}`;
      });
    };

    /* At rest: decide which names fit, nearest the shown community first, and hide the rest. */
    const settle = () => {
      const { W, H, cam } = S;
      if (!cam || !W) return;
      const z = W / cam.w;
      const left = cam.x - W / 2 / z;
      const top = cam.y - H / 2 / z;
      const taken: Rect[] = [];
      const view = { x: 4, y: 4, w: W - 8, h: H - 8 };
      const box0 = el.getBoundingClientRect();
      // the note and the map credit are never covered
      const fixed: Rect[] = [note.current, credit.current]
        .filter((p) => p !== null)
        .map((p) => {
          const r = p.getBoundingClientRect();
          return { x: r.left - box0.left, y: r.top - box0.top, w: r.width, h: r.height };
        });
      taken.push(...fixed);
      const inside = (r: Rect) =>
        r.x >= view.x && r.y >= view.y && r.x + r.w <= view.x + view.w && r.y + r.h <= view.y + view.h;
      // the plots themselves are never covered by a place name
      for (const p of mapPlots) {
        const b = plotBox.get(p.slug)!;
        taken.push({
          x: (b.x0 - left) * z - 6,
          y: (b.y0 - top) * z - 6,
          w: (b.x1 - b.x0) * z + 12,
          h: (b.y1 - b.y0) * z + 12,
        });
      }
      const order = items.map((_, i) => i).sort((a, b) => (a === S.target ? -1 : b === S.target ? 1 : a - b));
      const pinRects: Rect[] = [];
      for (const i of order) {
        const pin = pins.current[i];
        const slug = items[i]?.slug;
        if (!pin || !slug || !plotBox.has(slug)) continue;
        const w = pin.offsetWidth;
        const h = pin.offsetHeight;
        const clear = (r: Rect) =>
          inside(r) && !pinRects.some((q) => overlaps(q, r, 4)) && !fixed.some((q) => overlaps(q, r, 4));
        // above the plot if there is room, otherwise the first clear side; the community on show always above
        const side = (i === S.target ? SIDES.slice(0, 1) : SIDES).find((sd) =>
          clear(pinRect(sd, pinAnchor(slug, left, top, z, sd), w, h)),
        );
        pin.dataset.hidden = side ? "false" : "true";
        pin.dataset.side = side ?? "above";
        if (side) pinRects.push(pinRect(side, pinAnchor(slug, left, top, z, side), w, h));
      }
      taken.push(...pinRects);
      // Communities out of view: a tag at the edge of the map, on the line towards each, nearest first.
      const cx = W / 2;
      const cy = H / 2;
      items
        .map((it, i) => ({ it, i }))
        .filter(({ it }) => plotBySlug.has(it.slug))
        .map(({ it, i }) => {
          const p = plotBySlug.get(it.slug)!;
          return { i, x: (p.centre[0] - left) * z, y: (p.centre[1] - top) * z };
        })
        .sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy))
        .forEach(({ i, x, y }) => {
          const tag = edges.current[i];
          if (!tag) return;
          const pin = pins.current[i];
          const offscreen = x < 0 || x > W || y < 0 || y > H;
          if (!offscreen || pin?.dataset.hidden === "false") {
            tag.dataset.hidden = "true";
            return;
          }
          const w = tag.offsetWidth;
          const h = tag.offsetHeight;
          const dx = x - cx;
          const dy = y - cy;
          const m = 10;
          const tx = dx ? (dx > 0 ? W - m - w / 2 - cx : m + w / 2 - cx) / dx : Infinity;
          const ty = dy ? (dy > 0 ? H - m - h / 2 - cy : m + h / 2 - cy) / dy : Infinity;
          const t = Math.min(tx, ty);
          // on the line towards the plot if that spot is clear, or slid along the same edge until one is
          const along = tx < ty ? { x: 0, y: h + 6 } : { x: w / 2 + 6, y: 0 };
          let spot: Rect | null = null;
          for (const k of [0, 1, -1, 2, -2, 3, -3, 4, -4]) {
            const px = Math.min(W - m - w / 2, Math.max(m + w / 2, cx + dx * t + along.x * k));
            const py = Math.min(H - m - h / 2, Math.max(m + h / 2, cy + dy * t + along.y * k));
            const r = { x: px - w / 2, y: py - h / 2, w, h };
            if (!taken.some((q) => overlaps(q, r, 4))) {
              spot = r;
              break;
            }
          }
          tag.dataset.hidden = spot ? "false" : "true";
          if (!spot) return;
          taken.push(spot);
          const px = spot.x + w / 2;
          const py = spot.y + h / 2;
          tag.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -50%)`;
          tag.style.setProperty("--towards", `${Math.atan2(dy, dx).toFixed(3)}rad`);
        });
      // Each name takes the first of its spots that is in view and clear, nearest the middle first.
      mapLabels.forEach((l, i) => {
        const n = names.current[i];
        if (!n) return;
        const w = n.offsetWidth;
        const h = n.offsetHeight;
        const spots = l.at
          .map(([x, y, a]) => ({ x: (x - left) * z, y: (y - top) * z, a }))
          .filter((p) => p.x > -w && p.x < W + w && p.y > -h && p.y < H + h)
          .sort((p, q) => Math.hypot(p.x - W / 2, p.y - H / 2) - Math.hypot(q.x - W / 2, q.y - H / 2));
        const spot = spots.find((p) => {
          const r = turned(p.x, p.y, w, h, p.a);
          return inside(r) && !taken.some((q) => overlaps(q, r));
        });
        n.dataset.hidden = spot ? "false" : "true";
        if (!spot) return;
        taken.push(turned(spot.x, spot.y, w, h, spot.a));
        n.style.transform = `translate3d(${spot.x.toFixed(1)}px, ${spot.y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${spot.a}deg)`;
      });
      schedule();
    };

    function schedule() {
      if (!S.frame) {
        S.frame = requestAnimationFrame(() => {
          S.frame = 0;
          draw();
        });
      }
    }
    S.draw = schedule;
    S.settle = settle;
    S.want = want;

    const size = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      if (!r.width || !r.height) return;
      S.W = r.width;
      S.H = r.height;
      S.dpr = dpr;
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      S.flightId++;
      S.cam = restFor(items[S.target]?.slug, S.W, S.H);
      delete el.dataset.moving;
      want(S.cam);
      draw();
      settle();
    };
    const ro = new ResizeObserver(size);
    ro.observe(el);

    const img = new Image();
    img.decoding = "async";
    img.src = base.src;
    img
      .decode()
      .then(() => {
        S.base = img;
        setReady(true);
        schedule();
      })
      .catch(() => setReady(true));

    // Names change size when the web font arrives.
    document.fonts?.ready.then(() => settle());

    return () => {
      ro.disconnect();
      cancelAnimationFrame(S.frame);
      S.frame = 0;
      S.flightId++;
    };
  }, [near, items]);

  // Fly to the shown community.
  useEffect(() => {
    const S = st.current;
    if (S.target === active && S.cam) return;
    S.target = active;
    if (!S.cam || !S.W) return;
    const to = restFor(items[active]?.slug, S.W, S.H);
    const id = ++S.flightId;
    // the tiles for where the camera lands start loading now, so they are there when it arrives
    S.want(to);
    if (!motionOk) {
      delete root.current?.dataset.moving;
      S.cam = to;
      S.draw();
      requestAnimationFrame(() => S.settle());
      return;
    }
    const path = flight(S.cam, to);
    const duration = Math.min(1700, Math.max(650, path.S * 420));
    const start = performance.now();
    const el = root.current;
    if (el) el.dataset.moving = "";
    const step = (now: number) => {
      if (id !== S.flightId) return;
      const t = Math.min(1, (now - start) / duration);
      S.cam = t < 1 ? path.at(ease(t)) : to;
      S.draw();
      if (t < 1) requestAnimationFrame(step);
      else {
        if (el) delete el.dataset.moving;
        requestAnimationFrame(() => S.settle());
      }
    };
    requestAnimationFrame(step);
  }, [active, items, motionOk]);

  const shown = items[active];
  const mapped = shown && plotBySlug.has(shown.slug);
  const label = mapped
    ? `Map of East Bengaluru showing ${shown.name}, ${shown.place}, among Disha’s communities.`
    : `Map of East Bengaluru showing Disha’s communities. ${shown?.name ?? ""} is not marked on this map.`;

  return (
    <div ref={root} className={s.map} data-ready={ready || undefined}>
      <div className={s.picture} role="img" aria-label={label}>
        <canvas ref={canvas} className={s.canvas} aria-hidden="true" />
      </div>
      <div className={s.labels} aria-hidden="true">
        {mapLabels.map((l, i) => (
          <span
            key={l.text}
            ref={(n) => {
              names.current[i] = n;
            }}
            className={`${s.place} ${l.kind === "place" ? "" : s[l.kind]}`}
            data-hidden="true"
          >
            {l.text}
          </span>
        ))}
        {items.map((it, i) =>
          plotBySlug.has(it.slug) ? (
            <button
              key={it.slug}
              ref={(n) => {
                pins.current[i] = n;
              }}
              type="button"
              tabIndex={-1}
              className={s.pin}
              data-active={i === active || undefined}
              data-hidden="true"
              onClick={() => onPick(i)}
            >
              {it.name}
            </button>
          ) : null,
        )}
        {items.map((it, i) =>
          plotBySlug.has(it.slug) ? (
            <button
              key={`edge-${it.slug}`}
              ref={(n) => {
                edges.current[i] = n;
              }}
              type="button"
              tabIndex={-1}
              className={s.edge}
              data-hidden="true"
              onClick={() => onPick(i)}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {it.name}
            </button>
          ) : null,
        )}
      </div>
      {shown && !mapped && (
        <p ref={note} className={s.note}>
          {shown.name} is not marked on this map.
        </p>
      )}
      <p ref={credit} className={s.credit}>
        Map data ©{" "}
        <a href="https://www.openstreetmap.org/copyright" rel="noopener" target="_blank">
          OpenStreetMap
        </a>
      </p>
    </div>
  );
}
