# Disha Habitat — website redesign prototype

A standalone, front-end-only redesign prototype for [Disha Habitat](https://www.dishahabitat.com/), built for client review.
It is **not** connected to the live website, its CMS, hosting or domain.

## Run it

Requires Node.js 20.9 or newer to run the site. `npm test` needs Node 23.6+ (it runs TypeScript natively).

```bash
npm install
npm run dev          # http://localhost:3000
```

For a client demo, use the production build (faster, no dev overlay):

```bash
npm run build
npm start            # http://localhost:3000
```

Checks:

```bash
npm test             # loan maths (node:test) — EMI, zero-rate, schedule, validation, ₹ formatting
npx tsc --noEmit     # types
npm run lint
```

## What’s inside

| Route | Page |
| --- | --- |
| `/` | Cinematic homepage — see below |
| `/homes` | Now selling, then all five delivered communities, a time-to-build chart and a comparison table |
| `/homes/pursuit-of-the-elements` | The project on sale now: facts, homes, gallery, amenities, construction updates, RERA, enquiry |
| `/homes/[slug]` | Each community: full-bleed hero, facts band, timeline, location, gallery and lightbox; amenities and specifications where published; homeowner words; enquiry; next/previous |
| `/plan` | Home Affordability Explorer, with notes on how the estimates are made |
| `/story` | Journey, “Our core” manifesto, founders, community timeline, brand film |
| `/contact` | Office, phones, email, socials, enquiry form, community addresses |

**Concept — “The Line Home”.** Built from Disha’s own logo film: on deep forest green a single cyan line draws a roof,
and the name resolves beneath it. Forest and charcoal give depth; ivory and stone give light; the logo’s cyan is the
drawn line (active states, progress, focus, the seam in the hero); brass is the warm metal of the film’s ribbon; earth
is the terracotta of the buildings. Each community keeps a signature hue for data and card accents.

**Homepage sequence** (laid out after the client's reference):

0. Logo film — plays whenever someone arrives at the site, on any page (from the layout); the official SVG logo takes
   over and glides into the header. Skip at any time; never with reduced motion; capped at 11 s.
1. Hero — Disha's buildings full bleed, crossing over with a soft wipe and a slow zoom; headline on the left; "Explore
   our projects" and "Watch our story" (the brand film in a dialog).
2. Our approach — statement, a layered collage of community photographs with a hand-written card quoting the company
   poem, and the record (1,102 homes, 5 communities, 1,000+ families, 20,25,000+ sq ft), counting up.
3. Our developments — Pursuit of the Elements as the featured card; the five delivered communities two at a time.
4. Plan your home — EMI calculator beside a home at Central Park.
5. Why Disha — the manifesto and four proof cards.
6. Spaces that bring people closer — drag the sun across a day at a Disha community.
7. Homeowners speak — published homeowner words beside their community.
8. Begin your journey — book a site visit or talk to us. Compact footer.

Motion: Lenis smooth scrolling; words rise from soft focus; photographs open like a window; collage layers drift at
different depths; counters; hover zoom with a turning arrow. All off or static under reduced motion.

**Design system** (`src/app/globals.css`): Newsreader (headlines, optical sizes, true italic for emphasis) and Hanken
Grotesk (text, labels and figures — clear numerals and ₹). Labels are plain sentence case. Translucent cards: `.card`
(light) and `.card-dark`. Surfaces: `surface-forest`,
`surface-deep`, `surface-charcoal`, `surface-earth`, `surface-ivory`, `surface-stone`, with a fine grain on dark ones.
Cards: `src/components/ProjectCards.tsx` (interactive, editorial, compact); data from `src/lib/portfolio.ts`.
Motion: shutter reveals for images, rising lines for headlines, hairlines that draw, CSS scroll-driven parallax where
supported; under `prefers-reduced-motion` everything is static and no video autoplays.

Stack: Next.js 16 (App Router, fully static), TypeScript, Tailwind CSS v4 and `lucide-react`. Nothing else is needed at
runtime.

```
src/
  app/                    routes, layout, design tokens (globals.css)
  components/             Header, Footer, Logo, PageHero, Lightbox, EnquiryForm, AffordabilityExplorer, AmbientFilm
  components/home/        homepage sections (Hero, Manifesto, Collection, DayInTheSun, HomesField, Journeys, BlackWhite, PlanTeaser, EnquirySection)
  lib/site.ts             company facts, stats, homeowner quotes, founders
  lib/projects.ts         the five communities (facts, timelines, media)
  lib/emi.ts (+ .test.ts) loan maths and ₹ formatting
public/                   official imagery, brand film, logo, contour texture
docs/                     content sources, asset manifest, open questions
```

All copy and figures live in `src/lib/`. Change them there, not in the components.

## Home Affordability Explorer

The explorer is an **illustrative planning tool**, not a Disha Habitat financing, eligibility or loan service.

- **Inputs:** property price, down payment, interest rate, tenure and optional monthly income. Sliders sit alongside
  exact Indian-formatted inputs. The defaults are neutral examples, not Disha prices.
- **Maths:** the reducing-balance EMI, `P·r·(1+r)ⁿ / ((1+r)ⁿ − 1)`, with a separate `P/n` case for 0%. It also
  calculates total interest, total repaid, a yearly principal/interest schedule, and EMI as a share of income
  (indicative only).
- **Accessibility:** results update live and are announced to screen readers. The chart is backed by an accessible
  year-by-year table.
- **Privacy:** no data leaves the browser.

## The enquiry form is a demo

The form validates in the browser and shows a success state that **says plainly that nothing was sent**. No data leaves
the browser.

Real delivery needs an approved backend or form integration, plus a privacy notice suited to India’s DPDP Act. Replace
the `onSubmit` handler in `src/components/EnquiryForm.tsx`.

## Content and assets

Every fact, quote, photograph and the brand film come from Disha Habitat’s own public websites. Renders and plans are
labelled.

- [`docs/CONTENT-SOURCES.md`](docs/CONTENT-SOURCES.md): verified facts and the items the client must confirm.
- [`docs/ASSET-MANIFEST.md`](docs/ASSET-MANIFEST.md): every file, its source URL, where it’s used, and whether it shows a
  verified development.

The site sets `robots: noindex` because it’s a prototype.
