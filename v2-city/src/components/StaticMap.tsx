import { hoodLabels, hoods, mobileCrop, plots } from "@/lib/atlas.generated";
import { communities } from "@/lib/content";
import { STILL } from "@/lib/cine";
import { DeferredImg } from "./DeferredImg";
import s from "./StaticMap.module.css";

const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
/* Street and place names on the still plans: at most this fraction of the map's width (see the CSS). */
const LABEL_SIZE = 0.029;

/*
 * Still maps for phones, tablets, reduced motion and browsers without JavaScript. Each is a crop of
 * the same drawings the moving atlas uses, placed with percentages, so nothing needs measuring.
 */

type Crop = { x: number; y: number; w: number; h: number };
const pct = (v: number) => `${v.toFixed(3)}%`;
const numberOf = (slug: string) => String(communities.findIndex((c) => c.slug === slug) + 1).padStart(2, "0");
const nameOf = (slug: string) => communities.find((c) => c.slug === slug)?.name ?? "";

function Plots({ crop, active }: { crop: Crop; active?: string }) {
  return (
    <svg
      className={s.plots}
      viewBox={`${crop.x} ${crop.y} ${crop.w} ${crop.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {plots.map((p) => (
        <polygon
          key={p.slug}
          points={p.points.map((q) => q.join(",")).join(" ")}
          data-on={!active || p.slug === active ? "" : undefined}
          data-build={p.slug === "pursuit-of-the-elements" ? "" : undefined}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/* The whole of Disha's East Bengaluru, in the 3:5 crop drawn for phones. */
/* Central Park's name sits above its plot, so it never covers Windsor Gardens a kilometre east or
   runs off the map's left edge; the Elements' and Courtyard's names sit west, so they stay inside a
   narrow frame. */
const sideOf = (slug: string) =>
  slug === "disha-central-park"
    ? "above"
    : slug === "pursuit-of-the-elements" || slug === "disha-courtyard"
      ? "left"
      : "right";

export function StaticCity() {
  const crop = mobileCrop;
  return (
    <figure className={s.cityFigure}>
      <div className={`${s.map} ${s.city}`} style={{ aspectRatio: `${crop.w} / ${crop.h}` }}>
        {/* Only where the still map shows (phones, tablets, reduced motion), never behind the moving atlas. */}
        <picture>
          <source media={STILL} srcSet={crop.src} />
          <img className={s.base} src={BLANK} alt="" width={780} height={1300} decoding="async" />
        </picture>
        <noscript>
          {/* Without JavaScript the still layout shows on every screen. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- a pre-drawn map crop, served as is */}
          <img className={s.base} src={crop.src} alt="" width={780} height={1300} />
        </noscript>
        <Plots crop={crop} />
        <ul className={s.marks} aria-hidden="true">
          {plots.map((p) => (
            <li
              key={p.slug}
              className={s.mark}
              data-side={sideOf(p.slug)}
              style={{
                left: pct(((p.centre[0] - crop.x) / crop.w) * 100),
                top: pct(((p.centre[1] - crop.y) / crop.h) * 100),
              }}
            >
              <b>{numberOf(p.slug)}</b> {nameOf(p.slug)}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className={s.caption}>
        East Bengaluru, north at the top. Every street is from OpenStreetMap; the blue shapes are Disha’s plots.
      </figcaption>
    </figure>
  );
}

/* One community's neighbourhood: a 1.4 km wide window on the figure-ground plan, plot at the centre. */
export function StaticHood({ slug }: { slug: string }) {
  const hood = hoods[slug];
  const plot = plots.find((p) => p.slug === slug);
  if (!hood || !plot) return null;
  const w = Math.max(1400, plot.span * 6);
  const crop: Crop = {
    x: plot.centre[0] - w / 2,
    y: plot.centre[1] - (w * 0.75) / 2,
    w,
    h: w * 0.75,
  };
  const bar = w > 2000 ? 500 : 200;

  // Labels are set at most 2.9% of the map's width (StaticMap.module.css), so each one's full length
  // is known in metres at any screen size: characters × average width × 0.029 × crop width.
  const em = LABEL_SIZE * crop.w;
  const charWidth = { road: 0.66, place: 0.74 };
  const edge = crop.w * 0.025;
  const pxToM = crop.w / 280; // the narrowest the still map gets (a 320 px phone), for the fixed-size scale bar
  const keepOut: Crop[] = [
    // the plot, with a margin
    (() => {
      const xs = plot.points.map((q) => q[0]);
      const ys = plot.points.map((q) => q[1]);
      const m = em * 0.8;
      return {
        x: Math.min(...xs) - m,
        y: Math.min(...ys) - m,
        w: Math.max(...xs) - Math.min(...xs) + 2 * m,
        h: Math.max(...ys) - Math.min(...ys) + 2 * m,
      };
    })(),
    // the scale bar in the bottom-left corner (its label is capped like the street names)
    { x: crop.x, y: crop.y + crop.h - (20 * pxToM + 1.8 * em), w: bar + 24 * pxToM + 4 * em, h: 20 * pxToM + 1.8 * em },
  ];
  const hits = (a: Crop, b: Crop) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const labels: { text: string; kind: string; x: number; y: number; angle: number }[] = [];
  for (const l of hoodLabels[slug] ?? []) {
    const half = (l.text.length * charWidth[l.kind] * em) / 2 + em * 0.3;
    const thick = em * 0.8;
    for (const [x, y, angle] of l.at) {
      const r = (angle * Math.PI) / 180;
      const hx = Math.abs(Math.cos(r)) * half + Math.abs(Math.sin(r)) * thick;
      const hy = Math.abs(Math.sin(r)) * half + Math.abs(Math.cos(r)) * thick;
      const box = { x: x - hx, y: y - hy, w: hx * 2, h: hy * 2 };
      const within =
        box.x > crop.x + edge &&
        box.y > crop.y + edge &&
        box.x + box.w < crop.x + crop.w - edge &&
        box.y + box.h < crop.y + crop.h - edge;
      if (within && !keepOut.some((k) => hits(box, k))) {
        labels.push({ text: l.text, kind: l.kind, x, y, angle });
        keepOut.push(box);
        break;
      }
    }
  }
  return (
    <figure className={`${s.map} ${s.hood}`} style={{ aspectRatio: "4 / 3" }}>
      <DeferredImg
        className={s.base}
        src={hood.src}
        style={{
          width: pct((hood.size / crop.w) * 100),
          height: pct((hood.size / crop.h) * 100),
          left: pct(((hood.x - crop.x) / crop.w) * 100),
          top: pct(((hood.y - crop.y) / crop.h) * 100),
        }}
      />
      <Plots crop={crop} active={slug} />
      <ul className={s.marks} aria-hidden="true">
        {labels.map((l) => (
          <li
            key={l.text}
            className={s.label}
            data-kind={l.kind}
            style={{
              left: pct(((l.x - crop.x) / crop.w) * 100),
              top: pct(((l.y - crop.y) / crop.h) * 100),
              transform: `translate(-50%, -50%) rotate(${l.angle}deg)`,
            }}
          >
            {l.text}
          </li>
        ))}
      </ul>
      <div className={s.scale} aria-hidden="true">
        <i style={{ width: pct((bar / crop.w) * 100) }} />
        <span>{bar} m</span>
      </div>
      <figcaption className="sr-only">
        A plan of the streets and buildings around Disha {nameOf(slug)}, with its plot outlined in blue.
      </figcaption>
    </figure>
  );
}
