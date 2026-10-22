# Disha Habitat V2: A city, made of homes

A standalone prototype of a new homepage, separate from the V1 site in the parent folder and from the
earlier `v2/` concept. The research, the three concepts and why this one was chosen are in
[CONCEPTS.md](CONCEPTS.md).

## The idea

A night atlas of East Bengaluru drawn from OpenStreetMap: every street lit in gold, every lake in
blue, and Disha's plots glowing in the logo's sky blue. Scrolling walks the communities in the order
they were handed over (2015 to now). For each one the camera descends from the city to the
neighbourhood, a plan of the real streets and buildings around the plot, and the photograph rises
out of the plot's own outline into a frame beside it, joined by a gold leader line. The words scroll
normally in the left column; only the map is sticky.

Phones, tablets, reduced motion and browsers without JavaScript get a still map and photograph for
each community instead, with the same words.

## Run it

```bash
cd v2-city
npm run dev            # http://localhost:3300
npm run build && npm run start
npm run lint
npm run typecheck
```

Locally `v2-city/node_modules` is a link to the parent's packages (Next.js 16.4.0, React 19.3.0).
To deploy it on its own, replace the link with `npm install`.

## Redrawing the map

```bash
npm run atlas:fetch    # downloads OpenStreetMap data into .osm-cache (Overpass API)
npm run atlas:build    # draws public/atlas/* and writes src/lib/atlas.generated.ts
```

## Files

- `src/components/Atlas.tsx`: puts the two halves together.
- `src/components/AtlasStage.tsx`: the moving map (client): camera, flights, plot glow, label placement,
  the photograph's morph out of the plot outline, and the chapter marking.
- `src/components/Chapters.tsx`: every word on the page, server-rendered, with a still map and
  photograph per community (what phones, tablets, reduced motion and no-JavaScript visitors see).
- `src/components/StaticMap.tsx` and `DeferredImg.tsx`: the still maps; plans load only when needed.
- `src/components/Atlas.module.css`: both compositions.
- `src/lib/camera.ts`: views, the smooth zoom-and-pan flight (van Wijk and Nuij), the frame layout and
  the morph from plot outline to frame.
- `src/lib/cine.ts`: the one media query that decides moving or still, shared by every part.
- `src/lib/content.ts`: every fact, copied from V1's verified data, and where links go.
- `src/lib/atlas.generated.ts`: plot outlines, neighbourhood frames and map labels (generated).
- `scripts/fetch-osm.sh` and `scripts/build-atlas.py`: the map pipeline.
- `public/atlas/`: the night city plate (330 KB at half size for the first paint, 1 MB in full for the
  descent, AVIF with WebP fallback), a 119 KB crop for phones, and five neighbourhood plans.

## What was tested (19 October 2026)

- Chrome, Safari's engine (WebKit) and Firefox's engine (Gecko), through Playwright: every chapter,
  the flights, phones and tablets. No console errors or failed requests in any of them.
- Eleven screen sizes from 1024×768 to 2560×1440, plus 320, 390 and 768 wide: no label collisions, no
  label cut off, no sideways scrolling, the photograph always clear of the plot and the map key.
- Text enlarged to 125%, 150% and 200% (before and after load): still no overflow or collisions.
- Fast scrolling, jittering between chapters, resizing mid-flight, crossing the 1024 px breakpoint,
  reloading mid-page, deep links, keyboard only, reduced motion, and JavaScript turned off.
- axe (WCAG 2.2 AA and best practice): no violations. Lighthouse: desktop 99 performance, mobile 89,
  accessibility and best practices 100. SEO flags only the deliberate noindex.
- Not tested: a real iPhone or Android handset, and Safari itself (WebKit is its engine, not the app).

## Content rules

Only verified facts. Plot outlines are volunteer mapping and approximate; land areas are Disha's
published figures. Pursuit of Sunshine is the OSM plot named "Disha" beside Budigere Road (4.1 mapped
acres against a published 4). Park West is counted in the totals but not mapped, because its
address is not published. The Pursuit of the Elements image is an artist's impression and says so.
Map data © OpenStreetMap contributors, ODbL; the credit is on the map and in the footer.
