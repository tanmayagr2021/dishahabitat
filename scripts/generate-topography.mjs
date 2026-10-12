/*
 * Generates public/textures/topography.svg — the contour background used in dark sections.
 * Fractal simplex noise → d3-contour isolines → smoothed, rounded SVG paths (~166 KB, ~73 KB gzipped).
 * Run:  npm i --no-save d3-contour@4 d3-shape@3 simplex-noise@4 alea@1
 *       node scripts/generate-topography.mjs public/textures/topography.svg disha
 */
import { contours } from "d3-contour";
import { line, curveBasis, curveBasisClosed } from "d3-shape";
import { createNoise2D } from "simplex-noise";
import alea from "alea";
import { writeFileSync } from "node:fs";
const [out, seed = "disha", W = 1600, H = 1000] = process.argv.slice(2);
const noise = createNoise2D(alea(seed));
const step = 8, gw = Math.ceil(W / step), gh = Math.ceil(H / step);
const values = new Float64Array(gw * gh);
for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
  const x = i / gw, y = j / gh;
  // fractal terrain + a gentle ridge, like hills seen from above
  let v = 0, amp = 1, f = 1.6;
  for (let o = 0; o < 4; o++) { v += amp * noise(x * f * 1.6, y * f); amp *= 0.5; f *= 2.1; }
  v += 0.55 * Math.exp(-(((x - 0.68) ** 2) / 0.05 + ((y - 0.42) ** 2) / 0.09));
  v -= 0.35 * Math.exp(-(((x - 0.18) ** 2) / 0.03 + ((y - 0.75) ** 2) / 0.04));
  values[j * gw + i] = v;
}
const thresholds = Array.from({ length: 20 }, (_, k) => -1.05 + k * 0.11);
const shapes = contours().size([gw, gh]).thresholds(thresholds)(values);
const round = (d) => d.replace(/-?\d+\.\d+/g, (m) => String(Math.round(+m)));
const closed = line().curve(curveBasisClosed).x(p => p[0] * step).y(p => p[1] * step);
const open = line().curve(curveBasis).x(p => p[0] * step).y(p => p[1] * step);
const onEdge = ([x, y]) => x <= 0.5 || y <= 0.5 || x >= gw - 0.5 || y >= gh - 0.5;
let paths = "";
shapes.forEach((s, k) => {
  const cls = k % 5 === 0 ? ' class="m"' : "";
  for (const poly of s.coordinates) for (const ring of poly) {
    if (ring.length < 18) continue;
    if (!ring.some(onEdge)) {
      paths += `<path d="${round(closed(ring.filter((_, i) => i % 3 === 0)))}"${cls}/>`;
      continue;
    }
    // Rings touching the frame: draw only the interior runs, skipping the border.
    let run = [];
    const flush = () => {
      if (run.length >= 9) paths += `<path d="${round(open(run.filter((_, i, a) => i % 3 === 0 || i === a.length - 1)))}"${cls}/>`;
      run = [];
    };
    for (const p of ring) {
      if (onEdge(p)) flush();
      else run.push(p);
    }
    flush();
  }
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><style>path{fill:none;stroke:#c8a86b;stroke-width:.8;stroke-opacity:.55}.m{stroke-width:1.3;stroke-opacity:.9}</style>${paths}</svg>`;
writeFileSync(out, svg); console.log(out, (svg.length / 1024).toFixed(1) + " KB", shapes.length, "levels");
