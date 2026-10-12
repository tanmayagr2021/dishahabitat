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

**Homepage sequence** — in the order a buyer's questions arrive:

0. Logo film — plays the moment the home page opens (autoplays from the HTML), on every visit; the official SVG
   logo takes over from the film's and glides into the header. Skip at any time; never with reduced motion.
1. Hero — Disha's own buildings full screen, one after another, each rising in through vertical strips like a facade
   going up; centred headline; every slide names the community, its location and what was built.
2. Trust strip — 1,102 homes handed over (the one hero number), with communities, families and square feet delivered.
3. Now selling — Pursuit of the Elements: full-bleed render, translucent facts card, three renders.
4. Delivered — the five communities in a calm grid (two large, three smaller).
5. Why Disha — their own manifesto, then four proof cards: former homebuyers, published build timelines, construction
   updates and RERA numbers, founders you can meet.
6. A day at Disha — drag the sun across the sky to move a real community from morning to night.
7. Homeowners — a map of home towns and their words.
8. EMI calculator — exact, rupee-rounded EMI with totals that are the true sum of payments.
9. “Let’s meet for coffee.” — book a site visit. Compact footer.

The project explorer (filter, sort, select) is on `/homes`.

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
