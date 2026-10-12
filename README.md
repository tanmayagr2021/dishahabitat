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

**Homepage sequence.** Sections alternate between dark and light grounds to set the rhythm:

1. Hero — golden-hour photograph of Central Park, headline lines rising from a mask, project ledger with hover previews.
2. Transition — the company’s founding line reveals word by word; a Courtyard photograph opens from an inset frame.
3. Signature homes — interactive showcase with prev/next, a tablist (arrow keys work) and swipe on touch.
4. How we build — light, green, space and together, each tied to a real photograph in a sticky crossfading frame.
5. This is us — the verified stats, counting up on a contour-texture ground.
6. Homeowners — the real quotes, each paired with a photo of that homeowner’s community.
7. Plan your home — the affordability explorer.
8. Our core — the “Black & White” manifesto and the founders.
9. Life at Disha — gallery with lightbox.
10. Enquiry — the brand film as an ambient background.

**Design system** (`src/app/globals.css`):

- **Palette:** forest, charcoal, ivory, stone and an antique-brass accent. The official logo keeps its sky blue.
- **Type:** Cormorant Garamond for display (with lining figures) and Manrope for text.
- **Textures:** a generated topographic contour texture (`public/textures/topography.svg`, from
  `scripts/generate-topography.mjs`) and a fine film grain.
- **Motion:** CSS-led scroll reveals, plus a tiny scroll-progress hook for parallax. No animation library and no scroll
  hijacking. `prefers-reduced-motion` disables reveals, parallax and video autoplay.

Stack: Next.js 16 (App Router, fully static), TypeScript, Tailwind CSS v4 and `lucide-react`. Nothing else is needed at
runtime.

```
src/
  app/                    routes, layout, design tokens (globals.css)
  components/             Header, Footer, Logo, PageHero, Lightbox, EnquiryForm, AffordabilityExplorer, AmbientFilm
  components/home/        homepage sections
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
