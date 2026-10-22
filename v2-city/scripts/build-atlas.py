"""
Builds the atlas from OpenStreetMap data (© OpenStreetMap contributors, ODbL).

    python3 scripts/build-atlas.py <osm-cache-dir> <v2-city-dir>

Outputs
  public/atlas/city.webp          the city drawing: every street, lake and railway, at 0.1 px per metre
  public/atlas/hood-<slug>.svg    a figure-ground plan of each community's neighbourhood
  src/lib/atlas.generated.ts      world size, plot outlines, neighbourhood frames and map labels

Nothing is invented: every line is an OSM way, every label an OSM name. Plot outlines are volunteer
mapping and approximate; the site always quotes Disha's published acreage instead.
"""
import json, math, os, sys
from PIL import Image, ImageDraw

SRC, ROOT = sys.argv[1], sys.argv[2]
PUB = os.path.join(ROOT, "public", "atlas")
os.makedirs(PUB, exist_ok=True)

# ---------- Projection: local equirectangular, metres, origin at the north-west corner ----------
LON0, LON1, LAT0, LAT1 = 77.55, 77.87, 12.86, 13.11
LATC = 12.985
KX = 111320 * math.cos(math.radians(LATC))
KY = 110574
WORLD_W = (LON1 - LON0) * KX
WORLD_H = (LAT1 - LAT0) * KY


def proj(lat, lon):
    return ((lon - LON0) * KX, (LAT1 - lat) * KY)


def load(name):
    with open(os.path.join(SRC, name)) as f:
        return json.load(f)["elements"]


def pts(geom):
    return [proj(p["lat"], p["lon"]) for p in geom if p]


def area(poly):
    a = 0.0
    for i in range(len(poly) - 1):
        a += poly[i][0] * poly[i + 1][1] - poly[i + 1][0] * poly[i][1]
    return abs(a) / 2


def centroid(poly):
    a = cx = cy = 0.0
    for i in range(len(poly) - 1):
        c = poly[i][0] * poly[i + 1][1] - poly[i + 1][0] * poly[i][1]
        a += c
        cx += (poly[i][0] + poly[i + 1][0]) * c
        cy += (poly[i][1] + poly[i + 1][1]) * c
    a /= 2
    return (cx / (6 * a), cy / (6 * a))


def simplify(p, tol):
    """Douglas–Peucker. A closed ring is split at its farthest point first, so it never collapses."""
    if len(p) < 3:
        return p
    if p[0] == p[-1]:
        far = max(range(len(p)), key=lambda i: math.hypot(p[i][0] - p[0][0], p[i][1] - p[0][1]))
        if far == 0:
            return p
        return simplify(p[: far + 1], tol) + simplify(p[far:], tol)[1:]
    keep = [False] * len(p)
    keep[0] = keep[-1] = True
    stack = [(0, len(p) - 1)]
    while stack:
        i, j = stack.pop()
        ax, ay = p[i]
        bx, by = p[j]
        dx, dy = bx - ax, by - ay
        L = math.hypot(dx, dy) or 1e-9
        best, idx = 0.0, -1
        for k in range(i + 1, j):
            d = abs(dy * p[k][0] - dx * p[k][1] + bx * ay - by * ax) / L
            if d > best:
                best, idx = d, k
        if best > tol and idx > 0:
            keep[idx] = True
            stack += [(i, idx), (idx, j)]
    return [q for q, k in zip(p, keep) if k]


roads = load("roads.json")
water = load("water.json")
places = load("places.json")
plots_raw = {e["id"]: e for e in load("plots.json") if e["type"] == "way"}
buildings = load("buildings.json")

ROAD_RANK = {
    "residential": 0, "living_street": 0, "unclassified": 0,
    "tertiary": 1, "tertiary_link": 1,
    "secondary": 2, "secondary_link": 2,
    "primary": 3, "primary_link": 3,
    "trunk": 4, "trunk_link": 4, "motorway": 4, "motorway_link": 4,
}

# Water: closed ways, plus outer rings of multipolygon relations.
water_polys, parks, rails = [], [], []
for e in water:
    t = e.get("tags", {})
    if e["type"] == "way":
        g = pts(e.get("geometry", []))
        if t.get("railway"):
            rails.append((t["railway"], g))
        elif t.get("leisure") == "park" and len(g) > 3:
            parks.append(g)
        elif len(g) > 3:
            water_polys.append((t.get("name"), g))
    elif e["type"] == "relation":
        for m in e.get("members", []):
            if m.get("role") == "outer" and m.get("geometry"):
                g = pts(m["geometry"])
                if len(g) > 3 and g[0] == g[-1]:
                    water_polys.append((t.get("name"), g))

# ---------- The city drawing (raster): a night plate, streets lit in gold ----------
from PIL import ImageFilter

PXM = 0.1  # pixels per metre in the final image
SS = 2  # supersampling
W, H = int(WORLD_W * PXM), int(WORLD_H * PXM)
k = PXM * SS


def mask():
    m = Image.new("L", (W * SS, H * SS), 0)
    return m, ImageDraw.Draw(m)


wat, dw = mask()
park, dp = mask()
minor, d0 = mask()
mid, d1 = mask()
major, d2 = mask()
rail, dr_ = mask()
for name, g in water_polys:
    if area(g) < 20000:  # under 2 hectares: ponds and pools are too small to read at city scale
        continue
    dw.polygon([(x * k, y * k) for x, y in g], fill=255)
for g in parks:
    if area(g) > 4000:
        dp.polygon([(x * k, y * k) for x, y in g], fill=255)
widths = {0: 2, 1: 3, 2: 3, 3: 4, 4: 5}
for rank in range(5):
    d = d0 if rank == 0 else d1 if rank <= 2 else d2
    for e in roads:
        if ROAD_RANK.get(e["tags"].get("highway")) != rank:
            continue
        g = [(x * k, y * k) for x, y in pts(e.get("geometry", []))]
        if len(g) > 1:
            d.line(g, fill=255, width=widths[rank], joint="curve")
for kind, g in rails:
    gg = [(x * k, y * k) for x, y in g]
    if len(gg) > 1:
        dr_.line(gg, fill=255, width=2)
wat, park, minor, mid, major, rail = (m.resize((W, H), Image.LANCZOS) for m in (wat, park, minor, mid, major, rail))

GROUND = (11, 21, 40)
out = Image.new("RGB", (W, H), GROUND)


def lay(colour, m, alpha):
    global out
    out = Image.composite(Image.new("RGB", (W, H), colour), out, m.point(lambda v: int(v * alpha)))


lay((23, 58, 47), park, 0.85)  # green spaces
lay((44, 132, 196), wat.filter(ImageFilter.GaussianBlur(5)), 0.35)  # a soft glow at the shore
lay((26, 92, 140), wat, 0.95)  # lakes
lay((200, 168, 108), minor, 0.34)  # lanes and residential streets
lay((222, 190, 130), mid, 0.6)  # tertiary and secondary roads
lay((232, 178, 92), major.filter(ImageFilter.GaussianBlur(4)), 0.45)  # light thrown by the main roads
lay((246, 216, 160), major, 0.95)  # main roads
lay((132, 168, 196), rail, 0.55)  # railways
out.save(os.path.join(PUB, "city.webp"), "WEBP", quality=80, method=6)
# AVIF for browsers that take it (about a third smaller); city.webp stays as the fallback.
out.save(os.path.join(PUB, "city.avif"), "AVIF", quality=58, speed=4)
print("city.avif", os.path.getsize(os.path.join(PUB, "city.avif")) // 1024, "KB")
# A half-resolution plate for the first paint: sharp at city scale, swapped for the full drawing
# once the page has settled (the full one is only needed for the descent into a neighbourhood).
low = out.resize((W // 2, H // 2), Image.LANCZOS)
low.save(os.path.join(PUB, "city-low.avif"), "AVIF", quality=60, speed=4)
low.save(os.path.join(PUB, "city-low.webp"), "WEBP", quality=80, method=6)
print("city-low", os.path.getsize(os.path.join(PUB, "city-low.avif")) // 1024, "KB avif,", os.path.getsize(os.path.join(PUB, "city-low.webp")) // 1024, "KB webp")
print("city.webp", W, H, os.path.getsize(os.path.join(PUB, "city.webp")) // 1024, "KB")

# ---------- Plots ----------
PLOTS = [
    # slug, OSM way, how the plot was identified
    ("disha-windsor-gardens", 768730167, "Named “Disha Windsor Gardens” in OpenStreetMap"),
    ("disha-central-park", 702716215, "Named “Disha Central Park” in OpenStreetMap"),
    ("disha-courtyard", 773145599, "Named “Disha Courtyard” in OpenStreetMap"),
    ("disha-pursuit-of-sunshine", 1190134154, "Named “Disha” in OpenStreetMap, beside Budigere Road; 4.1 acres against a published 4"),
    ("pursuit-of-the-elements", 1186548889, "Named “Disha Pursuit of Elements” in OpenStreetMap"),
]
plots = []
for slug, wid, how in PLOTS:
    g = pts(plots_raw[wid]["geometry"])
    if g[0] != g[-1]:
        g.append(g[0])
    c = centroid(g)
    xs, ys = [p[0] for p in g], [p[1] for p in g]
    plots.append({
        "slug": slug,
        "osm": wid,
        "how": how,
        "points": [[round(x, 1), round(y, 1)] for x, y in g[:-1]],
        "centre": [round(c[0], 1), round(c[1], 1)],
        "span": round(max(max(xs) - min(xs), max(ys) - min(ys)), 1),
        "osmAcres": round(area(g) / 4046.8564224, 2),
    })

# ---------- Neighbourhood plans (SVG) ----------
STREET_W = {0: 6, 1: 9, 2: 12, 3: 15, 4: 19}


def path_d(seq, closed=False, ox=0.0, oy=0.0):
    out = []
    for poly in seq:
        if len(poly) < 2:
            continue
        x0, y0 = round(poly[0][0] - ox), round(poly[0][1] - oy)
        s = [f"M{x0} {y0}"]
        px, py = x0, y0
        for x, y in poly[1:]:
            xi, yi = round(x - ox), round(y - oy)
            if xi == px and yi == py:
                continue
            s.append(f"l{xi - px} {yi - py}")
            px, py = xi, yi
        if closed:
            s.append("z")
        out.append("".join(s))
    return "".join(out)


def inside(g, x0, y0, x1, y1):
    return any(x0 <= x <= x1 and y0 <= y <= y1 for x, y in g)


hoods = {}
hood_labels = {}
for p in plots:
    size = 4200 if p["slug"] == "pursuit-of-the-elements" else 3400
    cx, cy = p["centre"]
    x0, y0 = cx - size / 2, cy - size / 2
    x1, y1 = x0 + size, y0 + size
    by_rank = {r: [] for r in range(5)}
    named = {}
    for e in roads:
        r = ROAD_RANK.get(e["tags"].get("highway"))
        g = pts(e.get("geometry", []))
        if r is None or not inside(g, x0 - 200, y0 - 200, x1 + 200, y1 + 200):
            continue
        by_rank[r].append(simplify(g, 1.5))
        n = e["tags"].get("name")
        if n and r >= 1:
            # Sample every straight stretch of 30 m or more at 40 m intervals: each sample is a spot
            # where the name could sit along the road.
            for a, b in zip(g, g[1:]):
                L = math.hypot(b[0] - a[0], b[1] - a[1])
                if L < 30:
                    continue
                ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
                k = max(1, int(L // 40))
                for i in range(k):
                    t = (i + 0.5) / k
                    mx, my = a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t
                    if x0 + 300 < mx < x1 - 300 and y0 + 300 < my < y1 - 300:
                        named.setdefault(n, []).append((L, mx, my, ang, r))
    bl = [simplify(pts(e["geometry"]), 0.6) for e in buildings if e.get("geometry") and inside(pts(e["geometry"]), x0, y0, x1, y1)]
    wl = [g for n, g in water_polys if inside(g, x0 - 500, y0 - 500, x1 + 500, y1 + 500)]
    pk = [g for g in parks if inside(g, x0, y0, x1, y1)]
    rl = [g for kd, g in rails if inside(g, x0, y0, x1, y1)]

    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">']
    svg.append("<!-- Map data © OpenStreetMap contributors (ODbL). Drawn for Disha Habitat V2. -->")
    # A night plan: navy ground, green spaces, glowing water, buildings as lit blocks edged in gold, streets in gold.
    svg.append(f'<rect width="{size}" height="{size}" fill="#0b1528"/>')
    if pk:
        svg.append(f'<path fill="#173a2f" d="{path_d([simplify(g, 1) for g in pk], True, x0, y0)}"/>')
    if wl:
        svg.append(f'<path fill="#1b5c8f" d="{path_d([simplify(g, 1) for g in wl], True, x0, y0)}"/>')
    if bl:
        svg.append(f'<path fill="#1f3558" stroke="#d8b06a" stroke-opacity="0.32" stroke-width="0.7" d="{path_d(bl, True, x0, y0)}"/>')
    tone = {0: ("#cdb07a", 0.5), 1: ("#dcc08a", 0.72), 2: ("#e3c590", 0.8), 3: ("#f2d6a0", 0.92), 4: ("#f6dcaa", 0.95)}
    for r in range(5):
        if by_rank[r]:
            col, op = tone[r]
            svg.append(f'<path fill="none" stroke="{col}" stroke-opacity="{op}" stroke-width="{STREET_W[r] * 0.55:.1f}" stroke-linecap="round" stroke-linejoin="round" d="{path_d(by_rank[r], False, x0, y0)}"/>')
    if rl:
        svg.append(f'<path fill="none" stroke="#8fb3cf" stroke-opacity="0.6" stroke-width="2.5" stroke-dasharray="12 9" d="{path_d(rl, False, x0, y0)}"/>')
    svg.append("</svg>")
    fn = f"hood-{p['slug']}.svg"
    with open(os.path.join(PUB, fn), "w") as f:
        f.write("".join(svg))
    print(fn, len(bl), "buildings", os.path.getsize(os.path.join(PUB, fn)) // 1024, "KB")
    hoods[p["slug"]] = {"x": round(x0, 1), "y": round(y0, 1), "size": size, "src": f"/atlas/{fn}"}

    # Labels: named roads near the plot (from OSM). Each road gets several candidate spots along its
    # length, nearest first; the page uses the first one that fits on screen at the current size.
    labels = []
    roads_ranked = []
    reach = 900 * size / 3400  # how far from the plot to look for names: further round a larger plot
    for n, segs in named.items():
        if len(n) > 30:  # very long official names do not fit along a street
            continue
        cand = []
        for L, mx, my, ang, r in sorted(segs, key=lambda q: math.hypot(q[1] - cx, q[2] - cy)):
            d = math.hypot(mx - cx, my - cy)
            if L < 30 or d < 60 or d > reach:
                continue
            if any(math.hypot(mx - c[0], my - c[1]) < 40 for c in cand):
                continue
            if ang > 90:
                ang -= 180
            if ang < -90:
                ang += 180
            cand.append([round(mx, 1), round(my, 1), round(ang, 1)])
            if len(cand) == 24:
                break
        if cand:
            first = math.hypot(cand[0][0] - cx, cand[0][1] - cy)
            roads_ranked.append((first - max(s_[4] for s_ in segs) * 80, n, cand))
    roads_ranked.sort()
    from difflib import SequenceMatcher
    for _, n, cand in roads_ranked:
        # One name per road: OSM sometimes carries two spellings of the same street.
        if any(SequenceMatcher(None, n.lower(), l["text"].lower()).ratio() > 0.85 for l in labels):
            continue
        labels.append({"text": n, "kind": "road", "at": cand})
        if len(labels) == 4:
            break
    places_near = []
    for e in places:
        x, y = proj(e["lat"], e["lon"])
        d = math.hypot(x - cx, y - cy)
        if e["tags"].get("name") and 160 < d < reach:
            places_near.append((d, {"text": e["tags"]["name"], "kind": "place", "at": [[round(x, 1), round(y, 1), 0]]}))
    places_near.sort(key=lambda q: q[0])
    pl = [l for _, l in places_near[:3]]
    hood_labels[p["slug"]] = labels + pl

# ---------- City labels: OSM names only ----------
CITY_PLACES = ["Whitefield", "Varthur", "Gunjur", "Panathur", "Marathahalli", "Bellandur", "Mahadevapura",
               "Kadugodi", "Hoskote", "K R Puram", "Krishnarajapuram", "Hagaduru", "Mandur", "Budigere", "Sarjapura",
               "Indiranagar", "Domlur", "HAL", "Kundalahalli", "Brookefield", "Hoodi", "Ramamurthy Nagar"]
city_labels = []
seen = set()
for e in places:
    n = e["tags"].get("name")
    if n in CITY_PLACES and n not in seen and e["tags"].get("place") in ("suburb", "town", "village", "quarter"):
        x, y = proj(e["lat"], e["lon"])
        city_labels.append({"text": n, "x": round(x), "y": round(y), "angle": 0, "kind": "place"})
        seen.add(n)
for n, g in water_polys:
    if n in ("Bellandur Lake", "Varthur Lake", "Varthur Kere") and n not in seen and area(g) > 200000:
        c = centroid(g if g[0] == g[-1] else g + [g[0]])
        city_labels.append({"text": n, "x": round(c[0]), "y": round(c[1]), "angle": 0, "kind": "lake"})
        seen.add(n)

# ---------- A small crop for phones and the static map: every plot, with city around it ----------
xs = [q[0] for p in plots for q in p["points"]]
ys = [q[1] for p in plots for q in p["points"]]
PAD = 1700
bbox = {"x": min(xs) - PAD, "y": min(ys) - PAD, "w": max(xs) - min(xs) + 2 * PAD, "h": max(ys) - min(ys) + 2 * PAD}
# Phones show the crop at 3:5; widen the box to that ratio around its centre.
cxm, cym = bbox["x"] + bbox["w"] / 2, bbox["y"] + bbox["h"] / 2
mw = max(bbox["w"], bbox["h"] * 0.6)
mh = mw / 0.6
mobile = {"x": round(cxm - mw / 2), "y": round(cym - mh / 2), "w": round(mw), "h": round(mh)}
full = Image.open(os.path.join(PUB, "city.webp"))
crop = full.crop((int(mobile["x"] * PXM), int(mobile["y"] * PXM), int((mobile["x"] + mobile["w"]) * PXM), int((mobile["y"] + mobile["h"]) * PXM)))
crop = crop.resize((780, 1300), Image.LANCZOS)
crop.save(os.path.join(PUB, "city-mobile.webp"), "WEBP", quality=74, method=6)
print("city-mobile.webp", os.path.getsize(os.path.join(PUB, "city-mobile.webp")) // 1024, "KB", mobile)

ts = f"""/*
 * Generated by scripts/build-atlas.py from OpenStreetMap data (© OpenStreetMap contributors, ODbL).
 * Do not edit by hand. World units are metres; x runs east and y runs south from {LAT1}°N, {LON0}°E.
 */

export const world = {{ width: {round(WORLD_W)}, height: {round(WORLD_H)}, pxPerMetre: {PXM}, src: "/atlas/city.webp" }} as const;

/* The projection, for drawing latitude and longitude ticks: x = (lon - lon0) * kx, y = (lat1 - lat) * ky. */
export const projection = {{ lon0: {LON0}, lat1: {LAT1}, kx: {round(KX, 3)}, ky: {KY} }} as const;

export type Label = {{ text: string; x: number; y: number; angle: number; kind: "road" | "place" | "lake" }};
/* A neighbourhood label with candidate spots [x, y, angle], nearest the plot first. */
export type HoodLabel = {{ text: string; kind: "road" | "place"; at: [number, number, number][] }};
export type Plot = {{ slug: string; osm: number; how: string; points: [number, number][]; centre: [number, number]; span: number; osmAcres: number }};
export type Hood = {{ x: number; y: number; size: number; src: string }};

export const plots: Plot[] = {json.dumps(plots, ensure_ascii=False)};

/* Every plot with {PAD} m of city around it, and the 3:5 crop drawn for phones (public/atlas/city-mobile.webp). */
export const plotBounds = {json.dumps({k: round(v) for k, v in bbox.items()})};
export const mobileCrop = {{ ...{json.dumps(mobile)}, src: "/atlas/city-mobile.webp" }};

export const hoods: Record<string, Hood> = {json.dumps(hoods, ensure_ascii=False)};

export const cityLabels: Label[] = {json.dumps(city_labels, ensure_ascii=False)};

export const hoodLabels: Record<string, HoodLabel[]> = {json.dumps(hood_labels, ensure_ascii=False)};
"""
with open(os.path.join(ROOT, "src", "lib", "atlas.generated.ts"), "w") as f:
    f.write(ts)
print("labels", [l["text"] for l in city_labels])
for k_, v in hood_labels.items():
    print(k_, [(l["text"], len(l["at"])) for l in v])
