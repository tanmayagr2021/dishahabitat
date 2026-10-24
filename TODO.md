# Team plan: Disha Habitat website

Two people, each with their own Claude. This file is the shared source of truth.
Read it at the start of every session. Update the status boxes when you finish something, in the same PR.

Read `AGENTS.md` first: this Next.js version has breaking changes, check `node_modules/next/dist/docs/` before writing code.

## Current phase: UI

**Friend** does all the UI work now. **Owner (tanmayagr2021)** reviews PRs, merges and deploys, and handles the backend and integrations later.
The backend work is on hold: do not start it until the Owner says so.

## Owners

| Area | Owner | Status |
| --- | --- | --- |
| Visual restyle of inner pages | **Friend** | now |
| Merge showroom homepage + map | **Friend** | now |
| Consent banner UI + privacy page copy | **Friend** | now |
| Feedback widget browser check and fixes | **Friend** | now |
| Review PRs, merge to `main`, deploy | **Owner** | ongoing |
| Provisioning Neon / Sanity / Resend on Vercel | **Owner** | later |
| Leads backend, email alerts, spam protection, consent records | **Owner** | later |
| Sanity content editor at `/studio` | **Owner** | later |
| Analytics scripts after consent | **Owner** | later |
| Final audit pass | **Both** | last |

## Rules that avoid conflicts

- Never commit to `main`. One branch per task, push it, open a PR. The Owner reviews, merges and deploys.
- Friend touches: `src/app/*/page.tsx`, `src/components/**`, `globals.css`, CSS modules, and `src/lib` content files as needed for pages.
- Off limits for now (backend, Owner's later): `src/app/api/**`, `src/lib/server/**`, `src/lib/leads.ts`, `src/lib/feedback.ts`, `src/sanity/**`, `src/app/studio/**`, anything about Vercel integrations.
- Shared files (`src/app/layout.tsx`, `package.json`, `src/lib/site.ts`): ask before editing, keep the change small.
- No new dependencies without asking.
- Secrets: `.env*` is gitignored. Never commit keys.
- Large files (`.docx`, `.mp4`, `documents/`) are not in git.
- Before every PR run `npx tsc --noEmit`, `npm test` and `npm run build`.
- Every page: check mobile widths, keyboard navigation, contrast and reduced motion.

## Friend: UI tasks, in order

1. [ ] Restyle the remaining pages to the showroom look: homes index, Elements, story, checklist, plan, privacy, 404, contact/forms.
2. [ ] Merge the showroom homepage with the communities map into the main app.
3. [ ] Consent banner UI (DPDP) and privacy page copy. Expose a simple `hasConsent(category)` helper for the analytics work later.
4. [ ] Check the feedback widget (`src/components/feedback/FeedbackWidget.tsx`) in a browser and fix visual problems.

## Owner: later (on hold)

**Open decision, settle before the backend starts:** Supabase or Neon for leads?
The committed backend (`bf3599f`) targets Supabase and has a local `.data/` stand-in. The earlier plan said Neon. The Supabase project is shared with other apps, and a new table in `public` needs explicit grants.

Decision: _not made yet_

1. [ ] Accept Marketplace terms for Neon, Sanity, Resend on the Disha Vercel team, then provision them.
2. [ ] Resolve Supabase vs Neon.
3. [ ] Leads backend: enquiries, visit bookings, messages; Resend alert to sales; BotID + honeypot + rate limit; consent recorded with each lead.
4. [ ] Sanity at `/studio`: move `src/lib` content into schemas, publishing revalidates pages, Leads tab.
5. [ ] Analytics (GTM / GA4 / Hotjar) loaded only after consent, plus Vercel Analytics.

## Together, last

- [ ] Audit: tests, accessibility, contrast, browser engines, Lighthouse, real devices.
- [ ] Production deploy and domain.

## Done

- Design system, showroom homepage, header, footer, community page (`cf0bf04`)
- Feedback and leads backend first version, Supabase (`bf3599f`)
- Feedback widget, review page, team plan
