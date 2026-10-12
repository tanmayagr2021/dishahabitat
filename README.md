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
| `/homes` | All five communities in alternating editorial rows, plus a comparison table |
| `/homes/[slug]` | Each community: full-bleed hero, facts band, timeline, location, gallery and lightbox; amenities and specifications where published; homeowner words; enquiry; next/previous |
| `/plan` | Home Affordability Explorer, with notes on how the estimates are made |
| `/story` | Journey, the “Black & White” manifesto, founders, community timeline, brand film |
| `/contact` | Office, phones, email, socials, enquiry form, community addresses |

**Concept — “Black & White”.** Taken from Disha’s own manifesto (“Our promises are inked in Black. Our approach is
clear White. Bring in your own colours.”). The interface is strictly ink and paper; colour arrives only through the
photographs, which develop from black & white into colour as they are reached, and through each community’s
signature hue (Windsor palm green, Central Park dusk blue, Park West mustard, Courtyard terracotta, Sunshine gold).

**Homepage sequence** (show, don’t tell):

1. Hero — the photograph follows the time of day in Bengaluru (day: Courtyard; dusk / night: Central Park clubhouse),
   developing from black & white into colour, with a live IST clock.
2. Where we began — the founding line inks in word by word as it scrolls.
3. The collection — five tall black-and-white panels; hover or focus opens one into colour. Morphs into the community
   page on click (React `<ViewTransition>`).
4. A day at Pursuit of Sunshine — pinned scroll: the sun crosses an arc, five photographs run morning to night and the
   page itself turns from day to night. Phase names are an editorial device.
5. Every dot is a home — 1,102 dots (the published home counts), lighting up community by community, year by year.
6. Homeowners — each journey from hometown to Disha community; open a row for their words.
7. Our core — the manifesto as a title sequence, ending with “colours” in the five hues.
8. Plan — a one-sentence EMI calculator; each underlined figure is a slider.
9. “Let’s meet for coffee.” — the founder’s invitation over the brand film, with the enquiry form.

Inner pages: `/homes` (index, time-to-build chart, comparison table), each community (scaled timeline, gallery,
specs, next-community morph), `/story` (to-scale chart of all five builds 2014–2025, manifesto, founders, film),
`/plan`, `/contact`.

**Design system** (`src/app/globals.css`): Instrument Serif (display), Geist (text), Geist Mono (labels and data);
ink `#0c0c0b`, paper `#f3f1ec`, five community hues. Pinned sequences fall back to static layouts under
`prefers-reduced-motion`; video never autoplays for reduced-motion or Save-Data visitors.

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
