"""
Draws the communities map from OpenStreetMap data (© OpenStreetMap contributors, ODbL), in the
showroom's colours: a light grey city, white streets, and Disha's plots in brass (drawn on the page).

    python3 scripts/build-map.py <osm-cache-dir> <v2-showroom-dir>

The OSM extracts are the ones the map prototype uses (../v2-city/scripts/fetch-osm.sh): roads.json,
water.json, places.json and plots.json. The projection is the same as the map prototype's.

Outputs
  public/map/base.webp        the whole area at 0.05 px per metre, shown while flying between plots
  public/map/t/<c>-<r>.webp   512 px tiles at 0.32 px per metre around each plot, loaded as needed
  src/lib/map.generated.ts    the area, the tile grid, plot outlines and place names

Nothing is invented: every line is an OSM way, every label an OSM name. Plot outlines are volunteer
mapping and approximate.
"""
import json, math, os, sys
from PIL import Image, ImageDraw, ImageFilter

SRC, ROOT = sys.argv[1], sys.argv[2]
PUB = os.path.join(ROOT, "public", "map")
os.makedirs(os.path.join(PUB, "t"), exist_ok=True)

# ---------- Projection: the map prototype's, in metres from 13.11°N, 77.55°E ----------
LON0, LAT1, LATC = 77.55, 13.11, 12.985
KX = 111320 * math.cos(math.radians(LATC))
KY = 110574


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


def bbox(g):
    xs, ys = [p[0] for p in g], [p[1] for p in g]
    return (min(xs), min(ys), max(xs), max(ys))


# ---------- Plots: the five communities mapped in OSM (Park West is not) ----------
PLOTS = [
    ("pursuit-of-the-elements", 1186548889),
    ("disha-pursuit-of-sunshine", 1190134154),  # named "Disha" beside Budigere Road; 4.1 mapped acres against a published 4
    ("disha-courtyard", 773145599),
    ("disha-central-park", 702716215),
    ("disha-windsor-gardens", 768730167),
]
plots_raw = {e["id"]: e for e in load("plots.json") if e["type"] == "way"}
plots = []
for slug, wid in PLOTS:
    g = pts(plots_raw[wid]["geometry"])
    if g[0] != g[-1]:
        g.append(g[0])
    plots.append((slug, g, centroid(g)))

# ---------- The area: every plot, with room for the widest view around each ----------
# At rest the page shows about 5 km round a plot (up to 6 km across on a phone, 8 km down beside the
# cards on a tablet), so tiles cover 5.2 km either side and 4.4 km above and below. The whole area is a
# little larger, for the flights.
REACH_X, REACH_Y = 5200, 4400
px0 = min(c[0] for _, _, c in plots)
px1 = max(c[0] for _, _, c in plots)
py0 = min(c[1] for _, _, c in plots)
py1 = max(c[1] for _, _, c in plots)
TILE_M = 2560  # metres per tile
TILE_PX = 512
PXM = TILE_PX / TILE_M  # 0.2 px per metre: sharp on a 2x screen at the closest view the page uses (0.11)
X0 = math.floor((px0 - REACH_X - 2400) / TILE_M) * TILE_M
Y0 = max(0, math.floor((py0 - REACH_Y - 2400) / TILE_M) * TILE_M)
X1 = math.ceil((px1 + REACH_X + 2400) / TILE_M) * TILE_M
Y1 = math.ceil((py1 + REACH_Y + 2400) / TILE_M) * TILE_M
AW, AH = X1 - X0, Y1 - Y0
COLS, ROWS = AW // TILE_M, AH // TILE_M
print("area", X0, Y0, AW, AH, COLS, "x", ROWS, "tiles")

# ---------- OSM layers, clipped to the area ----------
ROAD_RANK = {
    "residential": 0, "living_street": 0, "unclassified": 0,
    "tertiary": 1, "tertiary_link": 1,
    "secondary": 2, "secondary_link": 2,
    "primary": 3, "primary_link": 3,
    "trunk": 4, "trunk_link": 4, "motorway": 4, "motorway_link": 4,
}


def in_area(b, m=200):
    return b[2] >= X0 - m and b[0] <= X1 + m and b[3] >= Y0 - m and b[1] <= Y1 + m


roads = []
for e in load("roads.json"):
    r = ROAD_RANK.get(e["tags"].get("highway"))
    g = pts(e.get("geometry", []))
    if r is None or len(g) < 2:
        continue
    b = bbox(g)
    if in_area(b):
        roads.append((r, g, b))

water_polys, parks, rails = [], [], []
for e in load("water.json"):
    t = e.get("tags", {})
    if e["type"] == "way":
        g = pts(e.get("geometry", []))
        if len(g) < 2 or not in_area(bbox(g)):
            continue
        if t.get("railway"):
            rails.append((g, bbox(g)))
        elif t.get("leisure") == "park" and len(g) > 3:
            if area(g) > 4000:
                parks.append((g, bbox(g)))
        elif len(g) > 3 and area(g) > 3000:
            water_polys.append((t.get("name"), g, bbox(g)))
    elif e["type"] == "relation":
        for m in e.get("members", []):
            if m.get("role") == "outer" and m.get("geometry"):
                g = pts(m["geometry"])
                if len(g) > 3 and g[0] == g[-1] and in_area(bbox(g)) and area(g) > 3000:
                    water_polys.append((t.get("name"), g, bbox(g)))
print(len(roads), "roads,", len(water_polys), "lakes,", len(parks), "parks,", len(rails), "railways")

# ---------- The palette: the showroom's light greys, streets drawn as grey lines ----------
THEMES = {
    "light": dict(ground=(242, 242, 242), park=(231, 235, 227), shore=(196, 200, 204), water=(222, 225, 228),
                  minor=(212, 212, 213), casing=(170, 172, 175), main=(186, 187, 190), rail=(178, 178, 180)),
    "ink": dict(ground=(23, 26, 32), park=(29, 38, 34), shore=(58, 64, 72), water=(36, 41, 49),
                minor=(58, 61, 68), casing=(23, 26, 32), main=(112, 115, 122), rail=(74, 76, 82)),
}
P = THEMES[os.environ.get("MAP_THEME", "light")]


def render(x0, y0, w_m, h_m, pxm, ss, widths, min_lake):
    """Draws the area x0..x0+w_m, y0..y0+h_m (metres) at pxm px per metre, supersampled ss times."""
    W, H = round(w_m * pxm), round(h_m * pxm)
    k = pxm * ss
    m = 400  # draw what reaches in from just outside, so lines continue across tile edges
    box = (x0 - m, y0 - m, x0 + w_m + m, y0 + h_m + m)

    def hit(b):
        return b[2] >= box[0] and b[0] <= box[2] and b[3] >= box[1] and b[1] <= box[3]

    def tr(g):
        return [((x - x0) * k, (y - y0) * k) for x, y in g]

    def mask():
        im = Image.new("L", (W * ss, H * ss), 0)
        return im, ImageDraw.Draw(im)

    wat, dw = mask()
    park, dp = mask()
    minor, d0 = mask()
    case, dc = mask()
    main, dm = mask()
    rail, dr = mask()
    for _, g, b in water_polys:
        if hit(b) and area(g) >= min_lake:
            dw.polygon(tr(g), fill=255)
    for g, b in parks:
        if hit(b):
            dp.polygon(tr(g), fill=255)
    for g, b in rails:
        if hit(b):
            dr.line(tr(g), fill=255, width=max(1, round(widths["rail"] * ss)))
    for rank in range(5):
        w = max(1, round(widths[rank] * ss))
        cw = max(1, round((widths[rank] + 2 * widths["casing"]) * ss))
        for r, g, b in roads:
            if r != rank or not hit(b):
                continue
            line = tr(g)
            if rank == 0:
                d0.line(line, fill=255, width=w, joint="curve")
                continue
            # Larger roads: a grey edge under a white street, with round ends so junctions close.
            dc.line(line, fill=255, width=cw, joint="curve")
            dm.line(line, fill=255, width=w, joint="curve")
            for x, y in (line[0], line[-1]):
                dc.ellipse((x - cw / 2, y - cw / 2, x + cw / 2, y + cw / 2), fill=255)
                dm.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=255)
    wat, park, minor, case, main, rail = (im.resize((W, H), Image.LANCZOS) for im in (wat, park, minor, case, main, rail))

    out = Image.new("RGB", (W, H), P["ground"])

    def lay(colour, msk, alpha=1.0):
        nonlocal out
        out = Image.composite(Image.new("RGB", (W, H), colour), out, msk if alpha == 1 else msk.point(lambda v: int(v * alpha)))

    lay(P["park"], park)
    lay(P["shore"], wat.filter(ImageFilter.MaxFilter(3)))
    lay(P["water"], wat)
    lay(P["rail"], rail)
    lay(P["minor"], minor)
    lay(P["casing"], case)
    lay(P["main"], main)
    return out


# Street widths in final pixels. Tiles: at 0.2 px/m. Base: a little bolder, so the main
# roads still read when the whole area is on screen.
TILE_W = {0: 1.5, 1: 2.2, 2: 2.8, 3: 3.6, 4: 4.4, "casing": 0.6, "rail": 1.2}
BASE_PXM = 0.05
BASE_W = {0: 0.3, 1: 0.45, 2: 0.6, 3: 0.8, 4: 1.0, "casing": 0.25, "rail": 0.4}

base = render(X0, Y0, AW, AH, BASE_PXM, 4, BASE_W, 60000)
base.save(os.path.join(PUB, "base.webp"), "WEBP", quality=82, method=6)
print("base.webp", base.size, os.path.getsize(os.path.join(PUB, "base.webp")) // 1024, "KB")

# Tiles: only those within reach of a plot.
tiles = []
total = 0
for r in range(ROWS):
    for c in range(COLS):
        tx, ty = X0 + c * TILE_M, Y0 + r * TILE_M
        near = any(
            tx + TILE_M >= cx - REACH_X and tx <= cx + REACH_X and ty + TILE_M >= cy - REACH_Y and ty <= cy + REACH_Y
            for _, _, (cx, cy) in plots
        )
        if not near:
            continue
        im = render(tx, ty, TILE_M, TILE_M, PXM, 3, TILE_W, 3000)
        fn = os.path.join(PUB, "t", f"{c}-{r}.webp")
        im.save(fn, "WEBP", quality=80, method=6)
        total += os.path.getsize(fn)
        tiles.append(r * COLS + c)
print(len(tiles), "tiles,", total // 1024, "KB in all")

# ---------- Labels: OSM names only ----------
# Each label has one or more spots [x, y, angle]; the page uses the first that fits in view, nearest the
# middle of the map first.
PLACES = [
    # nearest the plots first; the page drops any that would overlap
    "Gunjur", "Varthur", "Whitefield", "Panathur", "Hagaduru", "Mandur", "Bidarahalli", "Avalahalli",
    "Kadugodi", "Marathahalli", "Bellanduru", "Siddapura", "Brookefield", "Hoskote", "Kannamangala",
    "Carmelaram", "Dommasandra", "Hoodi", "Mahadevapura", "Kundalahalli", "Medahalli", "Ramagondanahalli",
]
by_name = {}
for e in load("places.json"):
    n = e.get("tags", {}).get("name")
    if n in PLACES and n not in by_name and e["tags"].get("place") in ("suburb", "town", "village", "quarter", "neighbourhood"):
        by_name[n] = proj(e["lat"], e["lon"])
places_out = []
for n in PLACES:
    if n in by_name:
        x, y = by_name[n]
        if X0 <= x <= X1 and Y0 <= y <= Y1:
            places_out.append({"text": n, "kind": "place", "at": [[round(x - X0), round(y - Y0), 0]]})

LAKES = ["Varthur Lake", "Bellandur Lake", "Hosakote lake", "Yellamallappa Chetty Lake"]
lakes_out = []
for n in LAKES:
    best = max(((area(g), g) for name, g, _ in water_polys if name == n), default=None, key=lambda q: q[0])
    if best:
        g = best[1] if best[1][0] == best[1][-1] else best[1] + [best[1][0]]
        cx, cy = centroid(g)
        lakes_out.append({"text": n.replace(" lake", " Lake"), "kind": "lake", "at": [[round(cx - X0), round(cy - Y0), 0]]})

# Main roads: spots every 700 m along each, where the road runs straight for 250 m, turned to follow it.
ROADS = ["Varthur Road", "Sarjapura Road", "Budigere Road", "Outer Ring Road", "Varthur - Sarjapur Road",
         "Whitefield - Hoskote Road", "Old Madras Road", "Whitefield Main Road", "Panathur Main Road",
         "Hagadur Road", "Gunjur Hosahalli Road", "Kundalahalli Main Road"]
roads_by_name = {}
for e in load("roads.json"):
    n = e["tags"].get("name")
    if n in ROADS and ROAD_RANK.get(e["tags"].get("highway")) is not None:
        g = pts(e.get("geometry", []))
        if len(g) > 1 and in_area(bbox(g), 0):
            roads_by_name.setdefault(n, []).append(g)


def along(g, d):
    """The point d metres along polyline g."""
    for a, b in zip(g, g[1:]):
        L = math.hypot(b[0] - a[0], b[1] - a[1])
        if d <= L:
            t = d / L if L else 0
            return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
        d -= L
    return g[-1]


roads_out = []
for n in ROADS:
    spots = []
    for g in roads_by_name.get(n, []):
        total = sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(g, g[1:]))
        d = 125
        while d <= total - 125:
            p, a, b = along(g, d), along(g, d - 125), along(g, d + 125)
            chord = math.hypot(b[0] - a[0], b[1] - a[1])
            if chord > 235 and X0 + 200 < p[0] < X1 - 200 and Y0 + 200 < p[1] < Y1 - 200:
                ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
                if ang > 90:
                    ang -= 180
                if ang < -90:
                    ang += 180
                if all(math.hypot(p[0] - q[0], p[1] - q[1]) > 600 for q in spots):
                    spots.append((p[0], p[1], ang))
            d += 100
    if spots:
        roads_out.append({"text": n.replace(" - ", "–"), "kind": "road",
                          "at": [[round(x - X0), round(y - Y0), round(a, 1)] for x, y, a in spots]})

# Priority when names compete for room: the nearest places, then main roads and lakes, then the rest.
place_labels = places_out[:6] + roads_out + lakes_out + places_out[6:]
print("labels", [(l["text"], len(l["at"])) for l in place_labels])

out_plots = []
for slug, g, (cx, cy) in plots:
    out_plots.append({
        "slug": slug,
        "points": [[round(x - X0, 1), round(y - Y0, 1)] for x, y in g[:-1]],
        "centre": [round(cx - X0, 1), round(cy - Y0, 1)],
    })

ts = f"""/*
 * Generated by scripts/build-map.py from OpenStreetMap data (© OpenStreetMap contributors, ODbL).
 * Do not edit by hand. Units are metres from the area's north-west corner; x runs east, y south.
 */

export const area = {{ width: {AW}, height: {AH} }} as const;

/* The whole area at {BASE_PXM} px per metre, drawn first and shown while flying between plots. */
export const base = {{ src: "/map/base.webp", pxPerMetre: {BASE_PXM} }} as const;

/* {TILE_PX} px tiles of {TILE_M} m ({PXM} px per metre), numbered row * cols + col; only these exist. */
export const tiles = {{ metres: {TILE_M}, cols: {COLS}, rows: {ROWS}, have: {json.dumps(tiles)} }} as const;

export type MapPlot = {{ slug: string; points: [number, number][]; centre: [number, number] }};
export const mapPlots: MapPlot[] = {json.dumps(out_plots)};

/* A name and the spots it may sit at, [x, y, angle in degrees], in the order to try them. */
export type MapLabel = {{ text: string; kind: "place" | "lake" | "road"; at: [number, number, number][] }};
export const mapLabels: MapLabel[] = {json.dumps(place_labels, ensure_ascii=False)};
"""
with open(os.path.join(ROOT, "src", "lib", "map.generated.ts"), "w") as f:
    f.write(ts)
print("wrote map.generated.ts")
