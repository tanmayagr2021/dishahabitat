# A city, made of homes: research and concepts

19 October 2026. Written before any V2 code.

## What the references actually showed

| Reference | Accessed | What I took from it |
| --- | --- | --- |
| videinfra.com/work/era, plus the linked case study and era.estate | Yes. The case-study page and blog loaded. The live era.estate homepage stayed on its WebGL splash in an automated browser; its /3d-map page loaded. | The map is the centrepiece, not a footer widget. A "simplified" 3D clay model of the district with a river and pins turns "a static plan into a dynamic urban fragment". The weakness for Disha: it needs a modelled city, and it is heavy (WebGL, a loading screen at 100%). |
| factory1611.com/projects/upperhouse | Yes. The case study is mostly device mock-up videos. The live site uol-upperhouse.sg loaded; a guessed /location URL returned 404, so the map is seen only in the mock-ups. | Numbered chapters (01 to 08), a warm paper palette, and a "living map" drawn as cartography in the brand's colours rather than a Google embed. Location storytelling anchors the experience. |
| weareavantus.com/launches/pantheon-development | Yes (the case study). The developer's live site was not linked; the domain I guessed was parked, so I did not inspect it. | Project-first navigation: the developer sells communities, so destinations lead and each project page is its own landing page. |
| dishahabitat.com | Yes | A dark video hero, blue grid tiles, Montserrat, "come home to mindful living spaces", sky blue #00b1ff and navy. Five delivered communities and one on sale, all in East Bengaluru. |

## What is verifiable about Disha's ground

From OpenStreetMap, checked against Disha's published acreage:

| Community | OSM plot | OSM area | Published area |
| --- | --- | --- | --- |
| Pursuit of the Elements, Gunjur | way 1186548889 | 20.04 acres | 20 acres |
| Pursuit of Sunshine, Budigere Road | way 1190134154, named "Disha", beside Budigere Road | 4.14 acres | 4 acres |
| Courtyard, Hagadur | way 773145599 | 4.38 acres | 3.6 acres |
| Central Park, Panathur–Varthur Road | way 702716215 | 5.14 acres | 3.5 acres |
| Windsor Gardens, Panathur–Varthur Road | way 768730167 | 1.39 acres | 1.25 acres |
| Park West | not mapped | | 1.5 acres |

The outlines are drawn by volunteer mappers and are approximate. Published acreage stays the authority.
Park West has no published address and no mapped plot, so it is counted but never pinned.

## Concept A: The Atlas, from city to plot to home

- **Opening viewport.** A printed atlas plate of East Bengaluru, built from real OpenStreetMap streets:
  the whole city as hairlines, lakes as flat tone, rail dashed. Disha's plots are the only things in
  the logo's sky blue. A legend cartouche holds the title, "A city, made of homes.", and the numbered key
  of communities, which is also the project navigation.
- **Signature interaction.** The descent. Scrolling (or choosing a community) moves the camera from the
  city (about 30 km across) down to the neighbourhood (about 2 km), where the detailed street map
  takes over. Then the photograph rises out of the plot's own outline and settles into a frame
  beside it, joined to the plot by a leader line. Place, neighbourhood and home appear in one view.
  The tour runs in handover order (2015 to now), so a counter of homes handed over grows as you go.
- **Assets.** OSM data (streets, water, rail, plots); existing Disha photographs; no new imagery.
- **Complexity.** Medium to high: a data pipeline, a two-level camera (city and neighbourhood layers
  that hand over to each other), and a clip-path morph from polygon to rectangle.
- **Why it is Disha's.** It is drawn from Disha's actual ground. No other developer can have this map,
  and it answers the buyer's first question, "where exactly?", with something they can check.

## Concept B: Six plots, one scale (a specimen sheet)

- **Opening viewport.** The six plot outlines laid side by side at one true scale, like a sheet of
  architectural site plans: from Windsor Gardens' 1.25 acres to the Elements' 20. Each has its name,
  year and home count set like a drawing title block.
- **Signature interaction.** Hovering or choosing a plot unfolds it into the photograph; the others
  dim. A toggle overlays each plot's real neighbourhood streets.
- **Assets.** Plot outlines (only five exist; Park West has none), photographs.
- **Complexity.** Low to medium.
- **Why it is distinctive.** It is honest about scale and very architectural. But it removes the city,
  loses the "where", and one of six plots is missing, which leaves a visible hole in the sheet.

## Concept C: An illustrated skyline

- **Opening viewport.** One continuous hand-drawn elevation of every Disha community on a shared ground
  line, west to east, under a single sky.
- **Signature interaction.** A horizontal pan along the skyline. Hovering a building lifts the drawing
  to reveal the photograph behind it.
- **Assets.** Six accurate architectural line elevations. These need an illustrator; tracing them by
  algorithm from the photographs gives noisy, inaccurate lines, and a drawn elevation of a
  building still under construction would show a completed building that does not exist yet.
- **Complexity.** High, mostly in illustration.
- **Why it is risky.** It is striking but cannot be made accurate with the assets available, and it
  says nothing about place.

## Evaluation (1 to 5)

| | Originality | Brand fit | Feasibility | Visual impact | Usability | Total |
| --- | --- | --- | --- | --- | --- | --- |
| A. The Atlas | 5 | 5 | 4 | 5 | 4 | **23** |
| B. Specimen sheet | 4 | 4 | 5 | 3 | 5 | 21 |
| C. Skyline | 4 | 3 | 2 | 5 | 3 | 17 |

**Selected: A, the Atlas.** It is the only concept that ties place, neighbourhood and home together,
and every line on it is real. From B it keeps true scale (a scale bar at every level and the published
acreage); from the references it keeps the map as centrepiece, numbered chapters and a cartographic
palette, but drawn flat and light instead of a heavy 3D model. Usability guardrails: the words scroll
normally, the key is a plain list of links, and phones, reduced motion and no-JavaScript visitors get a
static map per community.

## Revision, 19 October: the night plate

After the first build the client feedback was "more luxury, more colour, less UI". The concept and
the maps stay the same. The paper atlas became a night plate: Disha's navy as the ground, streets lit
in gold, lakes in blue, and the plots glowing and pulsing in the logo's sky blue. The latitude and
longitude ticks, the neat-line box, the map key and the boxed labels were removed. Figures are now
set large, and the main action is a gold button.
