# Launch guide

How to switch dishahabitat.com to the new site. Everything the site needs is already built. These are settings and
decisions only.

## Already done in the code

- **Redirects from every old address** (`next.config.ts`). The current Webflow URLs are sent permanently to their new pages:
  - `/our-journey` → `/story`
  - `/project/disha-parkwest` → `/homes/disha-park-west`
  - `/solution/khata` → `/checklist/khata-certificate`
  - and so on.

  Leftover template pages (`/service/*`, `/brand/*`, `/template-items/*`, `/utility-pages/*`) go to the home page. Old
  links, bookmarks and search results keep working.
- **Search engines are held back until launch.** Every page carries `noindex` and `robots.txt` disallows crawling until
  `SITE_INDEXING=true` is set.
- **`/sitemap.xml`** lists every page.
- **Organisation data for search engines.** The name, legal name, office address, phones, email and social profiles are
  published facts only.
- **Sharing previews.** Title, description and image are set for links shared on WhatsApp and social media.
- **Icons.** The browser tab icon and the iPhone home-screen icon.
- **Security headers.** `nosniff`, referrer policy, framing limited to the same site, and camera, microphone, location
  and payment switched off.
- **The logo film downloads only when it will play.** That is the first visit with motion allowed, and it saves about
  2 MB on every other visit.

## On launch day

1. **Vercel plan.** A business website needs the Vercel Pro plan; the Hobby plan is for non-commercial use.
2. **Environment variables** (Vercel > Project > Settings > Environment Variables, Production):
   - `SITE_URL` = `https://www.dishahabitat.com`
   - `SITE_INDEXING` = `true`
3. **Domain.** Add `dishahabitat.com` and `www.dishahabitat.com` in Vercel > Domains. Then update the DNS records at the
   registrar as Vercel shows (an A record for the root, a CNAME for `www`). Keep the old Webflow site until the new one
   answers on the domain.
4. **Redeploy** so the new variables apply. Then check that:
   - `https://www.dishahabitat.com/robots.txt` allows crawling and lists the sitemap;
   - `https://www.dishahabitat.com/our-journey` lands on Our story.
5. **Google Search Console.** Verify the domain and submit `/sitemap.xml`. Use "Change of address" only if the domain
   itself changes. It does not here.

## Decisions for Disha before launch

- **Analytics.** The current site loads Google Tag Manager (`GTM-5KSNNT9`), Google Analytics 4 (`G-HC29P7H7MP`) and
  Hotjar (`3286801`). The new site loads none of these. To keep them, they should be added with a cookie consent
  banner, under India's DPDP Act. We need Disha's go-ahead and the account access.
- **Tile selection.** The old `/tile-selection` page embedded an outside tool (sepoy.ai). It now forwards there
  temporarily. Confirm whether residents still use it.
- **Enquiry capture.** Enquiries are sent from the visitor's own WhatsApp or email. Saving them automatically to a
  Google Sheet or CRM is the planned addition.

## Checked before handover (15 October 2026)

| Check | Result |
| --- | --- |
| Production build | 24 pages generated, no errors |
| Types, lint, unit tests | Clean; 6 of 6 EMI tests pass |
| Interaction tests, desktop and phone | Every tool works at both widths: menu, film, buyer list, carousels, corner button, message form, Diniee, commute checker, gallery, visit booker, checklist, EMI, events wall, photo piles, 404 |
| Revamp proposal checks | All 66 automated checks pass at both widths |
| Accessibility (axe, WCAG 2.2 AA) | No violations on any page at either width |
| Links | 347 internal links and anchors, none broken; every outside link answers (Facebook blocks automated checks but opens in a browser) |
| Load on a 4G phone (4× CPU slowdown) | Largest paint 0.7 to 0.8 s, no layout shift |
| Old addresses | Every URL on the current site redirects to its new page |

Still to do by hand: a pass on a real iPhone (Safari) and a real Android phone, once the site is on the final domain.
