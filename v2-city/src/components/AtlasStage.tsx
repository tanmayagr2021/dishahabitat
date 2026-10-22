"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { cityLabels, hoodLabels, hoods, plotBounds, plots, world } from "@/lib/atlas.generated";
import {
  cityView,
  clamp01,
  ease,
  flight,
  hoodLayout,
  hoodView,
  outlineMorph,
  scaleBar,
  smooth,
  toScreen,
  type Box,
  type Stage,
  type View,
} from "@/lib/camera";
import { CINE } from "@/lib/cine";
import { communities } from "@/lib/content";
import s from "./Atlas.module.css";

/*
 * A CITY, MADE OF HOMES
 *
 * An atlas plate of East Bengaluru, drawn from OpenStreetMap: every street as a hairline, every
 * lake as flat tone, and Disha's plots as the only things in the logo's blue. Scrolling walks the
 * communities in the order they were handed over. For each, the camera descends from the city to
 * the neighbourhood (a figure-ground plan of real streets and buildings), and the photograph
 * rises out of the plot's own outline into a frame beside it: place, neighbourhood and home in
 * one view.
 *
 * This is the map only; the words are server-rendered in Chapters.tsx and scroll normally in the left
 * column, and only the map is sticky. Large screens with
 * motion allowed get the moving atlas (html.cine, set before first paint in layout.tsx);
 * everyone else, including browsers without JavaScript, gets a still map for each community.
 */

type Act = string; // "city", a community slug, or "closing"

const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const mappedCommunities = communities.filter((c) => c.mapped);
/* The chapters in reading order, so each section knows whether it has been passed. */
const chapterOrder = ["city", ...mappedCommunities.map((c) => c.slug), "closing"];
const numberOf = (slug: string) => String(communities.findIndex((c) => c.slug === slug) + 1).padStart(2, "0");
const nameOf = (slug: string) => communities.find((c) => c.slug === slug)?.name ?? "";
/* Which side of its plot each name sits on in the city view, so neighbours never collide. */
const labelSide: Record<string, "left" | "right"> = { "disha-central-park": "left" };

type HoodFrame = { view: View; crop: Box };

const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
/* The scale, north arrow and map credit in the bottom-right corner, measured in measure(). */
type Size = { w: number; h: number };
const legendBox = (S: Stage, l: Size): Box => ({ x: S.w - l.w - 32, y: S.h - l.h - 24, w: l.w + 32, h: l.h + 24 });

/* City names that would sit under a community's name tag are left out (names run about 3 km east or west). */
const placeLabels = cityLabels.filter(
  (l) =>
    !plots.some((p) => {
      const dx = l.x - p.centre[0],
        dy = Math.abs(l.y - p.centre[1]);
      const side = labelSide[p.slug] ?? "right";
      return dy < 650 && (side === "right" ? dx > -300 && dx < 3400 : dx < 300 && dx > -3400);
    }),
);

export function AtlasStage() {
  const stage = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const city = useRef<HTMLDivElement>(null);
  const cityImg = useRef<HTMLImageElement>(null);
  const overlay = useRef<SVGSVGElement>(null);
  const marks = useRef<HTMLDivElement>(null);
  const scale = useRef<HTMLSpanElement>(null);
  const leader = useRef<SVGPathElement>(null);
  const hoodEls = useRef<Record<string, HTMLDivElement | null>>({});
  const photoEls = useRef<Record<string, HTMLElement | null>>({});

  const st = useRef<Stage>({ w: 1440, h: 900, panel: 500, nav: 64 });
  const cityS = useRef(0.05);
  const frames = useRef<Record<string, HoodFrame>>({});
  const view = useRef<View | null>(null);
  const raf = useRef(0);
  const shown = useRef<string | null>(null);
  const fromAct = useRef<string>("city");
  const toAct = useRef<string>("city");
  const legendSize = useRef<Size>({ w: 420, h: 56 });

  const [act, setAct] = useState<Act>("city");
  const [cine, setCine] = useState(false);
  const [hoodsOn, setHoodsOn] = useState(false);
  // The full-resolution plate and the neighbourhood plans load once the page has settled, or at
  // once if the visitor leaves the city first.
  const hiRes = hoodsOn || (cine && act !== "city");

  /* ---------- Camera ---------- */

  const apply = useCallback((v: View) => {
    const S = st.current;
    const z = v.s / cityS.current;
    if (city.current) {
      city.current.style.transform = `translate(${S.w / 2 - v.cx * v.s}px, ${S.h / 2 - v.cy * v.s}px) scale(${z})`;
    }
    let hoodMax = 0;
    for (const c of mappedCommunities) {
      const el = hoodEls.current[c.slug];
      const f = frames.current[c.slug];
      if (!el || !f) continue;
      // Only the plans at either end of the current flight are drawn.
      const inPlay = c.slug === toAct.current || c.slug === fromAct.current;
      const o = inPlay ? smooth(0.16, 0.42, v.s / f.view.s) : 0;
      hoodMax = Math.max(hoodMax, o);
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o > 0.001 ? "visible" : "hidden";
      if (o > 0.001) {
        el.style.transform = `translate(${(f.crop.x - v.cx) * v.s + S.w / 2}px, ${(f.crop.y - v.cy) * v.s + S.h / 2}px) scale(${v.s / f.view.s})`;
      }
    }
    if (city.current) city.current.style.opacity = (1 - 0.94 * hoodMax).toFixed(3);
    if (overlay.current) {
      overlay.current.setAttribute(
        "viewBox",
        `${v.cx - S.w / 2 / v.s} ${v.cy - S.h / 2 / v.s} ${S.w / v.s} ${S.h / v.s}`,
      );
    }
    if (marks.current) {
      const cityO = 1 - smooth(1.5, 3, z);
      const plotO = 1 - smooth(2.4, 5, z);
      const els = Array.from(marks.current.querySelectorAll<HTMLElement>("[data-x]"));
      const at = new Map(els.map((el) => [el, toScreen(v, S, Number(el.dataset.x), Number(el.dataset.y))] as const));
      const show = (el: HTMLElement, o: number) => {
        const p = at.get(el)!;
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o > 0.01 ? "visible" : "hidden";
        el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
      };
      const offMap = (b: Box) => b.x < S.panel + 12 || b.x + b.w > S.w - 12 || b.y < S.nav + 10 || b.y + b.h > S.h - 10;
      const taken: Box[] = [legendBox(S, legendSize.current)];

      // Community names first. Each keeps its preferred side unless that side would run under the
      // text column, off the map or into another community's name, in which case it flips.
      const names: Box[] = [];
      for (const el of els) {
        if (el.dataset.layer !== "plot") continue;
        const p = at.get(el)!;
        const w = Number(el.dataset.w) || 0,
          h = Number(el.dataset.h) || 0;
        const box = (side: string): Box => ({ x: side === "right" ? p.x + 16 : p.x - 16 - w, y: p.y - h / 2, w, h });
        const prefer = el.dataset.prefer ?? "right";
        const other = prefer === "right" ? "left" : "right";
        const fits = (side: string) => !offMap(box(side)) && !names.some((t) => overlaps(box(side), t));
        const side = fits(prefer) ? prefer : fits(other) ? other : offMap(box(prefer)) ? other : prefer;
        el.dataset.side = side;
        if (plotO > 0.01) {
          names.push(box(side));
          taken.push(box(side), { x: p.x - 9, y: p.y - 9, w: 18, h: 18 });
        }
        show(el, plotO);
      }

      // Place names give way to community names, the map key, the edges of the map and each other.
      for (const el of els) {
        if (el.dataset.layer !== "city") continue;
        const p = at.get(el)!;
        const w = Number(el.dataset.w) || 0,
          h = Number(el.dataset.h) || 0;
        const b = { x: p.x - w / 2 - 4, y: p.y - h / 2 - 3, w: w + 8, h: h + 6 };
        const clear = !offMap(b) && !taken.some((t) => overlaps(b, t));
        if (clear) taken.push(b); // and to each other: the first one placed keeps its spot
        show(el, clear ? cityO : 0);
      }

      // Street and place names belong to the destination only, once the camera has nearly arrived.
      // Each takes the first of its candidate spots that sits on the map, clear of the plot, the
      // photograph, the map key and the names already placed; with no such spot it stays hidden.
      const fr = hoodLayout(S).frame;
      const placed: Box[] = [
        legendBox(S, legendSize.current),
        { x: fr.x - 24, y: fr.y - 24, w: fr.w + 48, h: fr.h + 80 },
      ];
      const dest = frames.current[toAct.current];
      const plot = plots.find((q) => q.slug === toAct.current);
      if (plot) {
        const pts = plot.points.map((q) => toScreen(v, S, q[0], q[1]));
        const xs = pts.map((q) => q.x),
          ys = pts.map((q) => q.y);
        placed.push({
          x: Math.min(...xs) - 6,
          y: Math.min(...ys) - 6,
          w: Math.max(...xs) - Math.min(...xs) + 12,
          h: Math.max(...ys) - Math.min(...ys) + 12,
        });
      }
      for (const el of els) {
        if (el.dataset.layer !== "hood") continue;
        const slug = el.dataset.hood ?? "";
        const near = slug === toAct.current && dest ? smooth(0.75, 1, v.s / dest.view.s) : 0;
        if (near <= 0.01) {
          show(el, 0);
          continue;
        }
        const label = hoodLabels[slug]?.[Number(el.dataset.i)];
        const w = Number(el.dataset.w) || 0,
          h = Number(el.dataset.h) || 0;
        let chosen: { p: { x: number; y: number }; angle: number; box: Box } | null = null;
        for (const [x, y, angle] of label?.at ?? []) {
          const p = toScreen(v, S, x, y);
          const r = angle * (Math.PI / 180);
          const hx = Math.abs(Math.cos(r)) * (w / 2) + Math.abs(Math.sin(r)) * (h / 2) + 4;
          const hy = Math.abs(Math.sin(r)) * (w / 2) + Math.abs(Math.cos(r)) * (h / 2) + 4;
          const box = { x: p.x - hx, y: p.y - hy, w: hx * 2, h: hy * 2 };
          if (!offMap(box) && !placed.some((t) => overlaps(box, t))) {
            chosen = { p, angle, box };
            break;
          }
        }
        if (!chosen) {
          show(el, 0);
          continue;
        }
        placed.push(chosen.box);
        at.set(el, chosen.p);
        const inner = el.firstElementChild as HTMLElement | null;
        if (inner) inner.style.transform = `translate(-50%, -50%) rotate(${chosen.angle}deg)`;
        show(el, near);
      }
    }
    if (scale.current) {
      const b = scaleBar(v.s);
      scale.current.style.setProperty("--bar", `${b.px.toFixed(1)}px`);
      scale.current.dataset.label = b.label;
    }
  }, []);

  const measure = useCallback(() => {
    const el = stage.current;
    const pr = probe.current;
    if (!el || !pr) return false;
    const S: Stage = { w: el.clientWidth, h: el.clientHeight, panel: pr.offsetWidth, nav: pr.offsetHeight };
    if (!S.w || !S.h) return false;
    st.current = S;
    // Label sizes, for keeping names apart (re-measured once the fonts arrive).
    marks.current?.querySelectorAll<HTMLElement>("[data-x]").forEach((m) => {
      const t = (m.dataset.layer === "city" ? m : m.firstElementChild) as HTMLElement | null;
      if (!t) return;
      m.dataset.w = String(t.offsetWidth);
      m.dataset.h = String(t.offsetHeight);
    });
    const lg = el.querySelector<HTMLElement>("[data-legend]");
    if (lg) legendSize.current = { w: lg.offsetWidth, h: lg.offsetHeight };
    const cv = cityView(S);
    cityS.current = cv.s;
    if (city.current) {
      city.current.style.width = `${world.width * cv.s}px`;
      city.current.style.height = `${world.height * cv.s}px`;
    }
    for (const c of mappedCommunities) {
      const h = hoods[c.slug];
      const box = hoodEls.current[c.slug];
      if (!h || !box) continue;
      const v = hoodView(c.slug, S);
      // Only the window seen at the end of the descent, with a margin, is drawn at full size.
      const cw = Math.min((S.w / v.s) * 1.5, h.size);
      const ch = Math.min((S.h / v.s) * 1.5, h.size);
      const cx = Math.min(Math.max(v.cx - cw / 2, h.x), h.x + h.size - cw);
      const cy = Math.min(Math.max(v.cy - ch / 2, h.y), h.y + h.size - ch);
      const crop = { x: cx, y: cy, w: cw, h: ch };
      frames.current[c.slug] = { view: v, crop };
      box.style.width = `${cw * v.s}px`;
      box.style.height = `${ch * v.s}px`;
      const img = box.firstElementChild as HTMLElement | null;
      if (img) {
        img.style.width = `${h.size * v.s}px`;
        img.style.height = `${h.size * v.s}px`;
        img.style.left = `${(h.x - cx) * v.s}px`;
        img.style.top = `${(h.y - cy) * v.s}px`;
      }
    }
    return true;
  }, []);

  const targetFor = useCallback((a: Act): View => {
    const S = st.current;
    return frames.current[a]?.view ?? cityView(S);
  }, []);

  /* ---------- The photograph rising from the plot ---------- */

  const hidePhoto = useCallback(() => {
    const slug = shown.current;
    shown.current = null;
    if (slug) {
      const el = photoEls.current[slug];
      if (el) el.dataset.state = "off";
    }
    if (leader.current) leader.current.dataset.on = "false";
  }, []);

  const showPhoto = useCallback((slug: string, animate: boolean) => {
    const el = photoEls.current[slug];
    const p = plots.find((q) => q.slug === slug);
    const f = frames.current[slug];
    if (!el || !p || !f) return;
    const S = st.current;
    const { frame } = hoodLayout(S);
    const pts = p.points.map((q) => toScreen(f.view, S, q[0], q[1]));
    const xs = pts.map((q) => q.x),
      ys = pts.map((q) => q.y);
    const bx = Math.min(...xs),
      by = Math.min(...ys),
      bw = Math.max(...xs) - bx,
      bh = Math.max(...ys) - by;
    const k = Math.max(bw / frame.w, bh / frame.h);
    const cx = bx + bw / 2,
      cy = by + bh / 2;
    const local = pts.map((q) => ({ x: (q.x - cx) / k + frame.w / 2, y: (q.y - cy) / k + frame.h / 2 }));
    const morph = outlineMorph(local, { x: 0, y: 0, w: frame.w, h: frame.h });

    el.style.left = `${frame.x}px`;
    el.style.top = `${frame.y}px`;
    el.style.width = `${frame.w}px`;
    const img = el.firstElementChild as HTMLElement | null;
    if (!img) return;
    img.style.height = `${frame.h}px`;
    const from = `translate(${cx - (frame.x + frame.w / 2)}px, ${cy - (frame.y + frame.h / 2)}px) scale(${k})`;

    // The leader line: from the plot's edge across to the frame.
    if (leader.current) {
      const right = frame.x > bx + bw;
      const sx = right ? bx + bw + 6 : cx;
      const sy = right ? cy : by + bh + 6;
      const ex = right ? frame.x - 14 : cx;
      const ey = right ? Math.min(Math.max(cy, frame.y + 24), frame.y + frame.h - 24) : frame.y - 14;
      leader.current.setAttribute("d", right ? `M${sx} ${sy}H${(sx + ex) / 2}L${ex} ${ey}` : `M${sx} ${sy}V${ey}`);
      leader.current.dataset.on = "true";
    }

    shown.current = slug;
    if (!animate) {
      img.style.transform = "none";
      img.style.clipPath = morph.to;
      el.dataset.state = "on";
      return;
    }
    el.dataset.state = "from";
    img.style.transform = from;
    img.style.clipPath = morph.from;
    void img.getBoundingClientRect();
    requestAnimationFrame(() => {
      if (shown.current !== slug) return;
      el.dataset.state = "on";
      img.style.transform = "none";
      img.style.clipPath = morph.to;
    });
  }, []);

  /* ---------- Flights ---------- */

  const fly = useCallback(
    (a: Act) => {
      cancelAnimationFrame(raf.current);
      hidePhoto();
      fromAct.current = toAct.current;
      toAct.current = a;
      const target = targetFor(a);
      const from = view.current ?? target;
      const { at, duration } = flight(from, target, st.current);
      const t0 = performance.now();
      const step = (now: number) => {
        const t = clamp01((now - t0) / duration);
        const v = t < 1 ? at(ease(t)) : target;
        view.current = v;
        apply(v);
        if (t < 1) raf.current = requestAnimationFrame(step);
        else if (frames.current[a]) showPhoto(a, true);
      };
      raf.current = requestAnimationFrame(step);
    },
    [apply, hidePhoto, showPhoto, targetFor],
  );

  /* ---------- Wiring ---------- */

  // Moving atlas only on large screens with motion allowed; it follows changes to either.
  useEffect(() => {
    const mq = window.matchMedia(CINE);
    const sync = () => {
      document.documentElement.classList.toggle("cine", mq.matches);
      setCine(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // The neighbourhood plans load once the page has settled, not with the first paint.
  useEffect(() => {
    if (!cine) return;
    const start = () => setHoodsOn(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 900);
    return () => clearTimeout(id);
  }, [cine]);

  // The full-resolution drawing: fetched and decoded off-screen once the page has settled, then
  // given to the same image when the visitor first moves. The city view needs only the half-size
  // plate, so the swap is never visible and never counts as a second "largest paint".
  const hiDrawing = useRef<Promise<string> | null>(null);
  const loadHiDrawing = useCallback(() => {
    const img = cityImg.current;
    if (!img) return null;
    hiDrawing.current ??= new Promise<string>((resolve, reject) => {
      const start = () => {
        const low = img.currentSrc;
        if (!low || low.startsWith("data:")) return reject(new Error("no plate"));
        const url = low.endsWith(".avif") ? world.src.replace(".webp", ".avif") : world.src;
        const pre = new window.Image();
        pre.src = url;
        pre.decode().then(() => resolve(url), reject);
      };
      if (img.complete) start();
      else img.addEventListener("load", start, { once: true });
    });
    return hiDrawing.current;
  }, []);
  useEffect(() => {
    if (hoodsOn) loadHiDrawing()?.catch(() => {});
  }, [hoodsOn, loadHiDrawing]);
  useEffect(() => {
    if (!cine || act === "city") return;
    let live = true;
    loadHiDrawing()
      ?.then((url) => {
        const sources = cityImg.current?.parentElement?.querySelectorAll("source");
        if (live) sources?.forEach((el) => el.setAttribute("srcset", url));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [act, cine, loadHiDrawing]);

  // Which chapter is in view: the last one whose top has passed 55% of the screen.
  useEffect(() => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.55;
      let next = "city";
      for (const el of steps) if (el.getBoundingClientRect().top <= line) next = el.dataset.step ?? next;
      setAct(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Fly to each new chapter.
  const placed = useRef(false);
  useEffect(() => {
    if (!cine || !placed.current) return;
    fly(act);
  }, [act, cine, fly]);

  // Measure the stage, place everything, and keep it placed when the window changes size.
  useEffect(() => {
    if (!cine) {
      placed.current = false;
      return;
    }
    const el = stage.current;
    if (!el) return;
    const place = () => {
      if (!measure()) return;
      cancelAnimationFrame(raf.current);
      const now = document.documentElement.dataset.act ?? "city";
      fromAct.current = now;
      toAct.current = now;
      const v = targetFor(now);
      view.current = v;
      apply(v);
      el.dataset.ready = "";
      const a = document.documentElement.dataset.act ?? "city";
      if (frames.current[a]) showPhoto(a, false);
      else hidePhoto();
      placed.current = true;
    };
    place();
    let live = true;
    document.fonts?.ready.then(() => live && place());
    const ro = new ResizeObserver(place);
    ro.observe(el);
    // A label resizing means the text size changed: measure the names again.
    const sample = el.querySelector<HTMLElement>("[data-layer='plot'] > span");
    if (sample) ro.observe(sample);
    return () => {
      live = false;
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [cine, measure, apply, targetFor, showPhoto, hidePhoto]);

  // Mark the chapter in view, and the ones already passed, on the server-rendered sections.
  useEffect(() => {
    document.documentElement.dataset.act = act;
    const now = chapterOrder.indexOf(act);
    document.querySelectorAll<HTMLElement>("[data-step]").forEach((el) => {
      const i = chapterOrder.indexOf(el.dataset.step ?? "");
      el.toggleAttribute("data-active", i === now);
      el.toggleAttribute("data-past", i < now);
    });
  }, [act]);

  /* The city view before any script runs: the same framing as cityView(), in CSS (Atlas.module.css). */
  const bounds = {
    "--bx": plotBounds.x + plotBounds.w / 2,
    "--by": plotBounds.y + plotBounds.h / 2,
    "--bw": plotBounds.w,
    "--bh": plotBounds.h,
    "--ww": world.width,
    "--wh": world.height,
  } as CSSProperties;

  return (
    <>
      {/* The moving atlas. Decorative: the same places, words and pictures are in the column. */}
      <div ref={stage} className={s.stage} style={bounds} aria-hidden="true" data-act={act}>
        <span ref={probe} className={s.probe} />
        <div ref={city} className={s.city}>
          {/* Downloaded only where the moving atlas shows (phones never fetch it); AVIF where supported. */}
          {/* First paint: a half-resolution plate, sharp at city scale. The full drawing, needed for
              the descent, replaces it in the same element once the page has settled (see below). */}
          <picture>
            <source media={CINE} type="image/avif" srcSet="/atlas/city-low.avif" />
            <source media={CINE} type="image/webp" srcSet="/atlas/city-low.webp" />
            <img ref={cityImg} src={BLANK} alt="" decoding="async" />
          </picture>
        </div>
        {mappedCommunities.map((c) => (
          <div
            key={c.slug}
            className={s.hood}
            ref={(el) => {
              hoodEls.current[c.slug] = el;
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- a vector plan, scaled by the camera */}
            <img src={hiRes ? hoods[c.slug]?.src : undefined} alt="" decoding="async" />
          </div>
        ))}
        <svg ref={overlay} className={s.overlay} preserveAspectRatio="none">
          {/* Each plot glows: two soft halos drawn at a constant screen width, then the plot itself. */}
          {plots.map((p) => (
            <g
              key={p.slug}
              data-on={act === p.slug ? "" : undefined}
              data-build={p.slug === "pursuit-of-the-elements" ? "" : undefined}
            >
              <polygon
                className={s.haloWide}
                points={p.points.map((q) => q.join(",")).join(" ")}
                vectorEffect="non-scaling-stroke"
              />
              <polygon
                className={s.halo}
                points={p.points.map((q) => q.join(",")).join(" ")}
                vectorEffect="non-scaling-stroke"
              />
              <polygon
                className={s.pulse}
                points={p.points.map((q) => q.join(",")).join(" ")}
                vectorEffect="non-scaling-stroke"
              />
              <polygon
                className={s.plot}
                points={p.points.map((q) => q.join(",")).join(" ")}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>
        <div className={s.vignette} />
        <div ref={marks} className={s.marks}>
          {placeLabels.map((l) => (
            <span
              key={l.text}
              className={s.cityLabel}
              data-layer="city"
              data-kind={l.kind}
              data-x={l.x}
              data-y={l.y}
              style={{ "--x": l.x, "--y": l.y } as CSSProperties}
            >
              {l.text}
            </span>
          ))}
          {mappedCommunities.map((c) =>
            (hoodLabels[c.slug] ?? []).map((l, i) => (
              <span
                key={`${c.slug}-${l.text}`}
                className={s.hoodLabel}
                data-layer="hood"
                data-hood={c.slug}
                data-i={i}
                data-kind={l.kind}
                data-x={l.at[0]![0]}
                data-y={l.at[0]![1]}
              >
                <span>{l.text}</span>
              </span>
            )),
          )}
          {plots.map((p) => (
            <a
              key={p.slug}
              href={`#${p.slug}`}
              tabIndex={-1}
              className={s.plotMark}
              data-layer="plot"
              data-prefer={labelSide[p.slug] ?? "right"}
              data-side={labelSide[p.slug] ?? "right"}
              data-x={p.centre[0]}
              data-y={p.centre[1]}
              style={{ "--x": p.centre[0], "--y": p.centre[1] } as CSSProperties}
            >
              <span>
                <b>{numberOf(p.slug)}</b>
                {nameOf(p.slug)}
              </span>
            </a>
          ))}
        </div>
        <svg className={s.leaderLayer}>
          <path ref={leader} className={s.leader} pathLength={1} data-on="false" />
        </svg>
        {mappedCommunities.map((c) => (
          <figure
            key={c.slug}
            className={s.photo}
            data-state="off"
            ref={(el) => {
              photoEls.current[c.slug] = el;
            }}
          >
            <div className={s.photoImage}>
              {/* Fetched once the page has settled, so the photographs never compete with the first paint. */}
              {hiRes ? (
                <Image
                  src={c.photo.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 42vw, 90vw"
                  quality={78}
                  style={{ objectFit: "cover", objectPosition: c.photo.focus }}
                />
              ) : null}
            </div>
            <figcaption className={s.photoCaption}>
              {c.photo.caption}
              {c.photo.render ? null : <span> · {c.locality}</span>}
            </figcaption>
          </figure>
        ))}
        <div className={s.legend} data-legend="">
          <span ref={scale} className={s.scale} data-label="2 km" />
          <span className={s.north}>N</span>
          <span className={s.source}>
            Map data ©{" "}
            <a href="https://www.openstreetmap.org/copyright" tabIndex={-1}>
              OpenStreetMap
            </a>{" "}
            contributors
          </span>
        </div>
      </div>
    </>
  );
}
