# Disha Habitat: website redesign

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
npm test             # loan maths (node:test): EMI, zero-rate, schedule, validation, ₹ formatting
npx tsc --noEmit     # types
npm run lint
```

## Launch

Search engines are kept out until launch. Set `SITE_URL` and `SITE_INDEXING=true` in Vercel on launch day. Redirects
from every old dishahabitat.com address are in `next.config.ts`. The full checklist is in [`docs/LAUNCH.md`](docs/LAUNCH.md).

## What’s inside

Every page is built around the buyer’s questions, each answered with proof (research in
[`docs/RESEARCH-BRIEF.md`](docs/RESEARCH-BRIEF.md)).

| Route | Page |
| --- | --- |
| `/` | Hero with proof in the first screen → “What you’re looking for” (the buyer’s list, answered by the founders) → the home on sale and the delivered communities → the delivery record → life in a community (drag the sun) → homeowners → the founders’ invitation |
| `/homes` | “One to choose now. Five to judge us by.”: Pursuit of the Elements first, then the delivered communities, the explorer, build times and a comparison |
| `/homes/pursuit-of-the-elements` | The project on sale: facts, homes, gallery, amenities, a live commute checker, papers and progress (RERA, quarterly updates, record, ET award), enquiry |
| `/homes/[slug]` | Each delivered community: facts, timeline, gallery, homeowner words; ends by pointing to the project on sale |
| `/story` | The founders’ memoir in seven chapters (draft wording for their approval), with the family album, the events wall and the brand film |
| `/contact` | Every channel, a four-step visit booker, what happens next, office map, every community with directions |
| `/checklist`, `/checklist/[slug]` | A working checklist of five must-knows, with a guide for each |
| `/plan` | EMI calculator with notes on how the estimate is made |
| `/privacy` | What the site does and doesn’t do with information |

**Look.** Built from Disha’s own logo film: forest green with a cyan line, brass and ivory. Newsreader for headlines,
Hanken Grotesk for text, Caveat for hand-written notes. Surfaces and tokens live in `src/app/globals.css`.

**Interaction.** A corner button opens Call, WhatsApp, Diniee and booking from anywhere. Every WhatsApp or email
action opens a short form that shows the exact message before the visitor sends it; the site stores nothing. On Our
story, posters on the events wall can be dragged and turned over, and the family album flicks through on a tap; both
demonstrate themselves once on first view. Everything is static or calmer under reduced motion.

**Honesty rules.** Only published or client-confirmed facts appear. Unconfirmed sections (water, paperwork status,
promised RERA dates) are not shown. No call-back is promised. Renders are labelled. No em dashes in site copy.

Stack: Next.js 16 (App Router, fully static), React 19, TypeScript, Tailwind CSS v4, `lucide-react`, Lenis.

```
src/
  app/                    routes, layout, design tokens (globals.css)
  components/             Header, Footer, ActionDock, Diniee, MessageComposer, VisitBooker, CommuteChecker, ChecklistTool, …
  components/home/        homepage sections (Hero, BuyerNeeds, Developments, RecordSection, DayAtDisha, HomeownersSpeak, CtaBand, …)
  components/story/       GigWall, FamilyStacks, ChapterRibbon
  lib/site.ts             company facts, stats, homeowner quotes, founders
  lib/projects.ts         the five delivered communities; lib/elements.ts the project on sale
  lib/proof.ts            delivery record, commute destinations, award, third-party rating
  lib/emi.ts (+ .test.ts) loan maths and ₹ formatting
public/                   Disha’s own imagery, brand film, logo film
docs/                     research brief, content sources, asset manifest
documents/                client documents (PDF)
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

## Enquiries

The site has no backend. Every enquiry is composed on the page and sent from the visitor’s own WhatsApp or email
app, so nothing is stored. Saving enquiries automatically (Google Sheet or CRM) is a planned addition.

## Content and assets

Every fact, quote, photograph and the brand film come from Disha Habitat’s own public websites. Renders and plans are
labelled.

- [`docs/CONTENT-SOURCES.md`](docs/CONTENT-SOURCES.md): verified facts and the items the client must confirm.
- [`docs/ASSET-MANIFEST.md`](docs/ASSET-MANIFEST.md): every file, its source URL, where it’s used, and whether it shows a
  verified development.

Until launch day the site sets `noindex` (see Launch above).
