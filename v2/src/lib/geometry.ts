/*
 * The drawn architecture around the frame.
 *
 * The opening photograph looks through nested concrete portals. They are measured in the source
 * image (1900 × 1200 px) below: every portal is the same rectangle scaled about one vanishing
 * point, with its top edge 0.185 × its width above that point. V2 clips the photograph to the
 * middle portal and draws three more in front of it with the same proportions, all standing on
 * one ground line, so the page itself becomes the gate.
 *
 * In every later act the same lines tighten into nested frames around the picture.
 */

export type Rect = { left: number; top: number; width: number; height: number };

export const gatePhoto = {
  width: 1900,
  height: 1200,
  /* The middle portal's opening (1240 px wide at 312–1552), trimmed by 10 px a side, about the
     vanishing point, so no part of a parked car shows. It becomes the frame. */
  opening: { left: 322, top: 358, right: 1546, ground: 960 },
  vanishing: { x: 934, y: 587 },
} as const;

/* How much larger each drawn portal is than the photographed one, nearest last. */
export const portalScales = [1.2, 1.4, 1.62] as const;
/* Offsets of the nested frames in later acts, in CSS pixels. */
const frameOffsets = [6, 13, 22, 34] as const;

export type Drawing = {
  /* The sky-blue line on the frame's edge, then three ink walls. */
  lines: [Rect, Rect, Rect, Rect];
  ground: Rect & { opacity: number };
  foot: Rect & { centred: boolean };
};

/* Where the photographed portal sits on screen, from the gate layer's box. */
export function gateFrame(layer: Rect) {
  const s = layer.width / gatePhoto.width;
  const o = gatePhoto.opening;
  const frame: Rect = {
    left: layer.left + o.left * s,
    top: layer.top + o.top * s,
    width: (o.right - o.left) * s,
    height: (o.ground - o.top) * s,
  };
  const vanishing = {
    x: layer.left + gatePhoto.vanishing.x * s,
    y: layer.top + gatePhoto.vanishing.y * s,
  };
  return { frame, vanishing, scale: s };
}

export function drawGate(layer: Rect, page: { width: number; gutter: number }): Drawing {
  const { frame, vanishing } = gateFrame(layer);
  const ground = frame.top + frame.height;
  const rise = vanishing.y - frame.top; // the top edge's height above the vanishing point
  const portal = (k: number): Rect => {
    const top = vanishing.y - rise * k;
    const width = frame.width * k;
    return { left: vanishing.x - width / 2, top, width, height: ground - top };
  };
  return {
    lines: [frame, portal(portalScales[0]), portal(portalScales[1]), portal(portalScales[2])],
    ground: { left: page.gutter, top: ground, width: page.width - page.gutter * 2, height: 0, opacity: 1 },
    foot: { left: page.gutter, top: ground + 14, width: page.width - page.gutter * 2, height: 0, centred: true },
  };
}

export function drawFrame(frame: Rect): Drawing {
  const around = (o: number): Rect => ({
    left: frame.left - o,
    top: frame.top - o,
    width: frame.width + o * 2,
    height: frame.height + o * 2,
  });
  const outer = frameOffsets[2];
  return {
    lines: [around(frameOffsets[0]), around(frameOffsets[1]), around(frameOffsets[2]), around(frameOffsets[3])],
    ground: { left: frame.left - outer, top: frame.top + frame.height + outer, width: frame.width + outer * 2, height: 0, opacity: 0 },
    foot: { left: frame.left, top: frame.top + frame.height + frameOffsets[3] + 10, width: frame.width, height: 0, centred: false },
  };
}
