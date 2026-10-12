# Disha Habitat — website redesign prototype

A standalone, front-end-only redesign prototype for [Disha Habitat](https://www.dishahabitat.com/), built for client review.
It is **not** connected to the live website, its CMS, hosting or domain.

## Run it

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Production preview (what to show the client — faster, no dev overlay):

```bash
npm run build
npm start            # http://localhost:3000
```

Checks: `npx tsc --noEmit` (types) and `npm run lint`.

## What’s inside

| Route | Page |
| --- | --- |
| `/` | Homepage: film hero, stats, featured communities, “Our core” story, gallery with lightbox, homeowner stories, differentiators, enquiry |
| `/homes` | All five communities plus an at-a-glance comparison table |
| `/homes/[slug]` | Reusable community page: facts, timeline, location, gallery, amenities and specifications where published, homeowner words, enquiry |
| `/story` | Journey, “Black & White” manifesto, founders, community timeline, brand film |
| `/contact` | Office, phone, email, socials, enquiry form, community addresses |

Stack: Next.js 16 (App Router, fully static), TypeScript, Tailwind CSS v4, `lucide-react` icons. Animation is plain CSS plus an
`IntersectionObserver`; it respects `prefers-reduced-motion` (the hero film won’t autoplay and reveals are disabled).

```
src/
  app/            routes, layout, global design tokens (globals.css)
  components/     Header, Footer, Logo, Lightbox, EnquiryForm, home/ sections
  lib/site.ts     company facts, stats, homeowner quotes, founders
  lib/projects.ts the five communities (facts, timelines, media)
public/
  images/         official Disha Habitat photography and renders, by project
  media/          brand film (from dishahabitat.com) and its poster frame
```

All copy and figures live in `src/lib/`. Change them there, not in components.

## The enquiry form is a demo

The form validates in the browser (name, Indian mobile number, optional email, consent) and shows a success state that
**states plainly that nothing was sent**. No data leaves the browser and nothing is stored.

Before launch, real delivery needs an approved backend or form integration (e.g. the client’s CRM, a server action
that emails the sales team, or a form service), plus a privacy notice suitable for India’s DPDP Act. Replace the
`onSubmit` handler in `src/components/EnquiryForm.tsx`.

## Content and assets

Every fact, quote and image comes from Disha Habitat’s own public websites. See
[`docs/CONTENT-SOURCES.md`](docs/CONTENT-SOURCES.md) for sources, how images are labelled, and the list of items the
client needs to confirm.

The site sets `robots: noindex` because it’s a prototype. Remove that in `src/app/layout.tsx` only for an approved launch.
