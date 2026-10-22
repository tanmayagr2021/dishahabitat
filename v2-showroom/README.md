# Disha Habitat V2: showroom

A homepage laid out like tesla.com (studied from its 16 October 2026 version), built entirely from Disha's
own photographs, film and verified facts. A standalone Next.js app; it shares no code with the V1 site in
the parent folder. The communities row borrows the idea of the map prototype in `../v2-city` (a camera
that flies to each plot), redrawn in this site's colours.

```sh
npm run dev      # http://localhost:3400 (next dev)
npm run build && npm run start
```

`node_modules` is a link to the parent folder's packages (same Next 16.4 / React 19.3 versions).

## How it maps to tesla.com

| tesla.com | Here |
| --- | --- |
| Transparent header, five words, icons; "Vehicles" opens a white panel | Same; "Homes" opens a panel with all six communities. Below 68.75rem the words move into a "Menu" sheet |
| Hero carousel: 80% of the screen (90% on phones), changes every 10 s, name and line centred near the top, Order Now + Learn More, marks at the foot | Same timing and layout. Pursuit of the Elements, 1,102 homes handed over (Central Park at dusk), The Villas. **Book a visit** is the main button everywhere Tesla has Order Now, Demo Drive or Schedule Demo |
| Full Self-Driving panel: grey, headline, two figures, two buttons, film | The ET Business Awards 2025 certificate, 1,102 homes handed over, 4.7/5 on MyGate, and Disha's brand film (silent, plays only on screen) |
| Vehicle cards, 1024 × 580, scrolling sideways | Six community cards, newest first after the one on sale, under a short heading, with a map of East Bengaluru beside them that flies to each community as its card comes into view |
| Two grey offer cards | Our story and The checklist |
| Energy cards | Inside Pursuit of the Elements: amenity cards (all labelled artist's impressions) and one link for the row |
| Footnotes and one row of links | One closing invitation (book a visit or call), then the MyGate source, render disclosure, both RERA numbers, links |

Everything links to the full site (`fullSite` in `src/lib/content.ts`); "Book a visit" goes to its
site-visit booker at `/contact#book`, which opens the visitor's own WhatsApp or email.

## Decisions

- **Colour:** white, near-black and Disha's brass (`#c6a46b`, V1's `--color-brass`) as the single accent.
  Compared on the real photographs against forest green and black, brass is the one that stays visible on
  darkened skies and gardens. Dark text on it, 7.4:1. The logo is shown in one colour, as Tesla's is.
- **Type:** Hanken Grotesk (V1's text face) for text and controls; Newsreader, V1's display serif, for
  headlines only, in one static weight (22 KB). The serif is what keeps a Tesla-style layout from looking
  generic. Everything is sized in rem, so it follows the reader's font-size setting.
- **The first five seconds:** the first slide says what (2, 3 & 4 BHK homes on 20 acres in Gunjur), who
  and why (by Disha Habitat, 1,102 homes handed over, Karnataka RERA registered) and what next.
- **One action stands out:** brass "Book a visit" everywhere; the second choice on a photograph is dark
  glass with a hairline, so it never outshines the brass. Story cards use plain underlined links.
- **Facts:** copied from V1's `src/lib/projects.ts`, `elements.ts`, `proof.ts` and `site.ts`. No prices.
  Every computer render says "Artist's impression".
- **Search engines:** `noindex, nofollow`, like the map prototype.
- **The communities map:** the map prototype's navy, gold and blue redrawn for this page: a light grey city,
  streets as grey lines, lakes in a neutral grey, and the plots in brass. It stands beside the cards from
  900px up (as tall as a card) and above them on phones. When a card comes into view the map flies to its
  plot (out over the city and back down), a soft brass glow marks it, and communities just out of view
  are named at the map's edge with an arrow; any name on the map brings its card into view. Park West has
  no plot in OpenStreetMap, so its card shows all five plots and says it is not marked. The plot outlines
  are volunteer mapping and approximate. Nothing loads until the reader scrolls near it (230 KB for the
  first view); without scripts it is not shown and the cards take the full width.

## Files

- `src/lib/content.ts`: every word, figure, link and image on the page.
- `src/components/SiteHeader.tsx`: header, Homes panel, phone menu (focus kept inside, Escape closes).
- `src/components/Hero.tsx`: the carousel (pauses on hover, focus, off screen, or with the pause button;
  never moves with reduced motion; slides 2 and 3 load after the first picture).
- `src/components/ProofPanel.tsx`, `FilmPlayer.tsx`: the award panel and the film.
- `src/components/CardCarousel.tsx`, `Cards.tsx`: the two rows of cards.
- `src/components/CommunitiesRow.tsx`, `CommunityMap.tsx`: the communities row and its map (a canvas;
  names are page text placed where they fit).
- `scripts/build-map.py`: draws the map from the map prototype's OpenStreetMap extracts into
  `public/map/` (a plate for the whole area and 512px tiles near each plot, 0.9 MB in all) and writes
  `src/lib/map.generated.ts`. `MAP_THEME=ink` draws a dark version instead.
- `src/components/PromoGrid.tsx`, `SiteFooter.tsx`.

## Tested (22 October 2026, production build, with the map and the second design pass)

- Contrast of every line of text on a photograph, measured from the pixels behind it: AA at 320, 360,
  390, 768, 1024, 1280, 1440 and 1920 px. Map names measured the same way: 6.8:1 at worst.
- Layout at 12 widths from 320 to 2560 px, and with text at 125, 150 and 200%: no sideways scrolling,
  nothing overlapping or cut off.
- Hero timing (changes at 10 s, holds on hover, pause button, reduced motion), keyboard paths for both
  menus, slide tabs and card arrows: 37/37.
- The map, 16/16: loads nothing until scrolled near; follows the arrows, the marks, a swipe (once it
  settles) and its own names and edge tags; Park West's note; jumps without flying under reduced motion;
  names inside the map and never overlapping at 7 sizes from 320 to 1920 px; 0.8 MB after visiting every
  community. Flights hold 60 frames a second, also with the processor slowed four times.
- axe-core (WCAG 2.2 AA and best practice): 0 violations, page, both menus open, and the map loaded.
- Chrome, WebKit (Safari's engine) and Firefox: no console errors; menus, slides, film, cards and the
  map work.
- Without JavaScript: the first slide, every card and plain links to the full site.
- Lighthouse: phone 98 (LCP 2.4 s on simulated slow 4G), desktop 100; accessibility and best practices
  100. SEO reads 63 only because of the deliberate noindex.
- Every link on the page returns 200; `/contact#book` exists on the full site.

Not yet tested on a real iPhone or Android phone.
