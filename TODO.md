# Team plan: Disha Habitat website

Two people, each with their own Claude. This file is the shared source of truth.
Read it at the start of every session. Update the status column when you finish something, in the same PR.

Read `AGENTS.md` first: this Next.js version has breaking changes, check `node_modules/next/dist/docs/` before writing code.

## Owners

| Area | Owner | Weight |
| --- | --- | --- |
| Backend: leads, email, spam protection, consent records | **Friend** | heavy |
| Sanity content editor at `/studio` | **Friend** | heavy |
| Provisioning Neon / Sanity / Resend on Vercel | **Friend** (needs Vercel team access) | heavy |
| Visual restyle of inner pages | **Owner (tanmayagr2021)** | light |
| Feedback widget finish and review | **Owner** | light |
| Merge showroom homepage + map | **Owner** | light |
| Consent banner UI + privacy page copy | **Owner** (UI) | light |
| Analytics scripts after consent | **Friend** (after consent banner merges) | light |
| Final audit pass | **Both**, after everything merges | |

## Rules that avoid conflicts

- Never commit to `main`. One branch per task, PR, the other person reviews.
- Owner touches: `src/app/*/page.tsx`, `src/components/**`, `globals.css`, CSS modules.
- Friend touches: `src/app/api/**`, `src/lib/server/**`, `src/lib/leads.ts`, `src/lib/feedback.ts`, `src/sanity/**`, `src/app/studio/**`, `package.json` dependencies.
- Shared files (`src/app/layout.tsx`, `package.json`, `src/lib/site.ts`): say so in chat before editing, keep the change small, merge fast.
- Secrets: `.env*` is gitignored. Share keys with `vercel env pull` or a password manager, never in chat or commits.
- Large files (`.docx`, `.mp4`, `documents/`) are not in git.
- Run `npx tsc --noEmit` and `npm test` before every PR.

## Open decision (settle before the backend starts)

**Supabase or Neon for leads?** The committed backend (`bf3599f`) targets Supabase and also has a local `.data/` stand-in.
The earlier plan said Neon. The Supabase project is shared with other apps (ViaMagus GCC portal, Select Hub, ViamagusSelect), and a new table in `public` needs explicit grants (see the user's global CLAUDE.md). Pick one, write it here, delete the other path.

Decision: _not made yet_

## Friend: tasks, in order

1. [ ] Accept Marketplace terms for Neon, Sanity, Resend in the browser on the Disha Vercel team (needs team membership first).
   Then, from the repo root:
   `vercel integration add neon --name disha-leads -m region=sin1 --no-claim`
   then `sanity/project` and `resend/resend-email`.
2. [ ] Resolve the Supabase vs Neon decision above.
3. [ ] Leads backend: store enquiries, visit bookings and messages; Resend alert to sales; BotID + honeypot + rate limit (`src/lib/server/guard.ts` already exists); record consent with each lead.
4. [ ] Sanity at `/studio`: move `src/lib` content (projects, elements, proof, site, checklist, portfolio, showroom home) into schemas; publishing revalidates pages; Leads tab reading from the database through a verified Sanity token.
5. [ ] Analytics: GTM / GA4 / Hotjar loaded only after consent, plus Vercel Analytics. Wait for the Owner's consent banner.

## Owner: tasks, in order

1. [ ] Commit and push the feedback widget (done on `tesla-v1`, needs a browser check).
2. [ ] Restyle the remaining pages to the showroom look: homes index, Elements, story, checklist, plan, privacy, 404, contact/forms.
3. [ ] Merge the showroom homepage with the communities map into the main app.
4. [ ] Consent banner UI (DPDP) and privacy page copy. Expose a simple `hasConsent(category)` the Friend can use for analytics.

## Together, last

- [ ] Audit: tests, accessibility, contrast, browser engines, Lighthouse, real devices.
- [ ] Production deploy and domain.

## Done

- Design system, showroom homepage, header, footer, community page (`cf0bf04`)
- Feedback and leads backend first version, Supabase (`bf3599f`)
