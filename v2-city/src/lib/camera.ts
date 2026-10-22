/*
 * The atlas camera. A view is a centre in world metres and a scale in screen pixels per metre.
 * Everything on the stage (the city drawing, the neighbourhood plans, the plots and the labels) is
 * placed from one view, so the layers always agree.
 */
import { plots, type Plot } from "./atlas.generated";

export type View = { cx: number; cy: number; s: number };
export type Box = { x: number; y: number; w: number; h: number };
export type Stage = { w: number; h: number; panel: number; nav: number };

/* The part of the stage the map is seen through: right of the text panel. */
export function mapArea(st: Stage): Box {
  return { x: st.panel, y: st.nav, w: st.w - st.panel, h: st.h - st.nav };
}

/* The city view: every mapped plot in sight, centred in the map area. */
export function cityView(st: Stage): View {
  const a = mapArea(st);
  const xs = plots.flatMap((p) => p.points.map((q) => q[0]));
  const ys = plots.flatMap((p) => p.points.map((q) => q[1]));
  const pad = 1700; // metres of city around the outermost plots
  const bw = Math.max(...xs) - Math.min(...xs) + pad * 2;
  const bh = Math.max(...ys) - Math.min(...ys) + pad * 2;
  const s = Math.min((a.w * 0.9) / bw, (a.h * 0.86) / bh);
  const mx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const my = (Math.max(...ys) + Math.min(...ys)) / 2;
  // Put the plots' centre at the middle of the map area, a touch above centre.
  const sx = a.x + a.w * 0.5;
  const sy = a.y + a.h * 0.48;
  return { s, cx: mx + (st.w / 2 - sx) / s, cy: my + (st.h / 2 - sy) / s };
}

export function plotBySlug(slug: string): Plot | undefined {
  return plots.find((p) => p.slug === slug);
}

/*
 * Where the plot sits on screen in a neighbourhood view, and where the photograph's frame goes.
 * The frame always leaves room below it for its caption and the scale bar.
 */
export function hoodLayout(st: Stage) {
  const a = mapArea(st);
  const reserve = 96; // caption under the frame, then the scale bar
  if (a.w >= 760) {
    const fh = Math.min(Math.min(a.w * 0.5, 900) * 0.7, a.h - reserve - 72);
    const fw = fh / 0.7;
    const y = Math.max(a.y + 48, a.y + (a.h - fh) / 2 - 12);
    return {
      plot: { x: a.x + a.w * 0.27, y: a.y + a.h * 0.5 },
      frame: { x: a.x + a.w * 0.94 - fw, y, w: fw, h: fh } as Box,
    };
  }
  // Narrow map areas: the plot above, the frame below it on the right.
  const fw = Math.min(a.w * 0.64, (a.h * 0.46) / 0.7);
  const fh = fw * 0.7;
  return {
    plot: { x: a.x + a.w * 0.42, y: a.y + a.h * 0.27 },
    frame: { x: a.x + a.w * 0.94 - fw, y: a.y + a.h - reserve - fh, w: fw, h: fh } as Box,
  };
}

export function hoodView(slug: string, st: Stage): View {
  const p = plotBySlug(slug);
  if (!p) return cityView(st);
  const a = mapArea(st);
  const { plot } = hoodLayout(st);
  // The plot is drawn about a sixth of the map area across, within sensible limits.
  const s = Math.min(Math.max((a.w * 0.17) / p.span, 0.42), 1.3);
  return { s, cx: p.centre[0] + (st.w / 2 - plot.x) / s, cy: p.centre[1] + (st.h / 2 - plot.y) / s };
}

export function toScreen(v: View, st: Stage, x: number, y: number) {
  return { x: (x - v.cx) * v.s + st.w / 2, y: (y - v.cy) * v.s + st.h / 2 };
}

/*
 * Smooth zoom and pan between two views (van Wijk and Nuij, "Smooth and efficient zooming and
 * panning", 2003): the camera rises just enough to see both places, then descends. Returns the
 * interpolator and a duration in milliseconds.
 */
export function flight(a: View, b: View, st: Stage) {
  const rho = 1.35;
  const w0 = st.w / a.s;
  const w1 = st.w / b.s;
  const ux0 = a.cx,
    uy0 = a.cy,
    ux1 = b.cx,
    uy1 = b.cy;
  const dx = ux1 - ux0,
    dy = uy1 - uy0,
    d2 = dx * dx + dy * dy,
    d1 = Math.sqrt(d2);
  let S: number;
  let at: (t: number) => View;
  if (d2 < 1e-6) {
    S = Math.log(w1 / w0) / rho;
    at = (t) => {
      const w = w0 * Math.exp(rho * t * S);
      return { cx: ux0, cy: uy0, s: st.w / w };
    };
  } else {
    const b0 = (w1 * w1 - w0 * w0 + rho ** 4 * d2) / (2 * w0 * rho * rho * d1);
    const b1 = (w1 * w1 - w0 * w0 - rho ** 4 * d2) / (2 * w1 * rho * rho * d1);
    const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
    const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
    S = (r1 - r0) / rho;
    at = (t) => {
      const sv = t * S;
      const coshr0 = Math.cosh(r0);
      const u = (w0 / (rho * rho * d1)) * (coshr0 * Math.tanh(rho * sv + r0) - Math.sinh(r0));
      const w = (w0 * coshr0) / Math.cosh(rho * sv + r0);
      return { cx: ux0 + u * dx, cy: uy0 + u * dy, s: st.w / w };
    };
  }
  const duration = Math.min(Math.max(Math.abs(S) * 520, 1100), 2300);
  return { at, duration };
}

export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/* A round length for a scale bar about `target` pixels long. */
export function scaleBar(s: number, target = 110) {
  const m = target / s;
  const steps = [50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000];
  const len = steps.reduce((best, x) => (Math.abs(x - m) < Math.abs(best - m) ? x : best), steps[0]!);
  return { metres: len, px: len * s, label: len >= 1000 ? `${len / 1000} km` : `${len} m` };
}

/*
 * The plot outline resampled to `n` points, and a rectangle with the same number of points, both as
 * percentages of a box. CSS can then morph one clip-path polygon into the other.
 */
export function outlineMorph(points: { x: number; y: number }[], box: Box, n = 32) {
  // Start from the vertex nearest the box's top-left, walking clockwise on screen.
  let signed = 0;
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!,
      q = points[(i + 1) % points.length]!;
    signed += p.x * q.y - q.x * p.y;
  }
  const ordered = signed < 0 ? [...points].reverse() : points;
  const start = ordered.reduce((bi, p, i) => (p.x + p.y < ordered[bi]!.x + ordered[bi]!.y ? i : bi), 0);
  const loop = [...ordered.slice(start), ...ordered.slice(0, start)];
  const lr = [...loop, loop[0]!];
  const lseg = lr.slice(1).map((p, i) => Math.hypot(p.x - lr[i]!.x, p.y - lr[i]!.y));
  const total = lseg.reduce((a, b) => a + b, 0);
  const from: string[] = [];
  for (let k = 0; k < n; k++) {
    let dist = (k / n) * total;
    let i = 0;
    while (i < lseg.length - 1 && dist > lseg[i]!) {
      dist -= lseg[i]!;
      i++;
    }
    const a = lr[i]!,
      b = lr[i + 1]!,
      t = lseg[i]! ? dist / lseg[i]! : 0;
    const x = a.x + (b.x - a.x) * t,
      y = a.y + (b.y - a.y) * t;
    from.push(`${(((x - box.x) / box.w) * 100).toFixed(2)}% ${(((y - box.y) / box.h) * 100).toFixed(2)}%`);
  }
  // The rectangle: n points clockwise from the top-left corner, n / 4 per side.
  const to: string[] = [];
  const q = n / 4;
  for (let k = 0; k < n; k++) {
    const side = Math.floor(k / q),
      f = (k % q) / q;
    const [x, y] =
      side === 0 ? [f * 100, 0] : side === 1 ? [100, f * 100] : side === 2 ? [100 - f * 100, 100] : [0, 100 - f * 100];
    to.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  return { from: `polygon(${from.join(", ")})`, to: `polygon(${to.join(", ")})` };
}
