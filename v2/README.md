# Disha Habitat V2: The World Between Four Walls

A standalone prototype of a new homepage opening. It is separate from the V1 site in the parent
folder and shares no code with it.

## The idea

A home is never just a place. The page walks through three thresholds, from public to private:

1. **The gate.** Disha's own photograph looks through nested concrete portals. The page clips it to
   one portal and draws three more in front, measured from the photograph's perspective, so the
   visitor stands inside the gate with the headline carved above it.
2. **The courtyard.** The drawn portals gather into nested frames around Disha Courtyard, and the
   page moves from morning paper to dusk stone.
3. **The door.** The frame narrows to a doorway portrait, and the page turns to evening navy.
4. **The communities.** The same frame becomes a viewer for all six communities. Scrolling or
   hovering a name changes the picture; every name links to its page on the full site.

The words always scroll normally; only the frame is sticky. On phones, tablets, with reduced motion
or without JavaScript, every act shows its own framed picture inline.

## Run it

```bash
cd v2
npm run dev        # http://localhost:3200
npm run build && npm run start
npm run lint
npm run typecheck
```

Locally, `v2/node_modules` is a link to the parent's packages (same Next.js 16.4.0 and React 19.3.0).
To deploy V2 on its own, replace the link with `npm install`.

## Files

- `src/app/layout.tsx`: fonts (Piazzolla, Instrument Sans), metadata, and the script that chooses the
  scroll sequence before the first paint.
- `src/app/globals.css`: colour, type, spacing and motion tokens, and the button and link primitives.
- `src/components/Thresholds.tsx` and `.module.css`: the sequence, the stage and both compositions.
- `src/lib/geometry.ts`: the portal measurements and the drawn architecture.
- `src/lib/content.ts`: every fact and picture, copied from V1's verified data.
- `src/lib/site.ts`: where the links go. Change `fullSite` when dishahabitat.com moves.
- `src/components/SiteNav.tsx`, `Closing.tsx`, `Logo.tsx` (the official logo) and `Arrow.tsx`.

## Content rules

Only verified facts are used. The Pursuit of the Elements image is an artist's impression and is
labelled as one. "Plan a visit" opens WhatsApp with a message ready to send, on Disha's published sales
line; nothing is sent from the page. The prototype is marked noindex.
