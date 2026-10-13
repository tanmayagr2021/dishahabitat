# Content sources, assets and open questions

Research date: 12 October 2026. Sources inspected:

- dishahabitat.com: `/`, `/our-homes`, `/our-journey`, `/the-core`, `/homemakers`, `/contact-us`, `/checklist`, and the five
  `/project/…` pages
- dishapursuitofsunshine.com (the official Pursuit of Sunshine site)
- YouTube oEmbed for the brand film `EFDhOmvK108` (“Disha Habitat I Come home to mindful living spaces”, channel @dishahabitat)

Design references studied for presentation patterns only (nothing copied): lodhagroup.com, godrejproperties.com, sobha.com.

## Verified facts used

| Item | Value | Source |
| --- | --- | --- |
| In business since | 2014, largely East Bengaluru | /our-journey, /the-core |
| Stats | 5 communities · 1,000+ happy families · 20,000+ walk-ins · 20,25,000+ sq ft delivered · 32,00,000+ sq ft in the making | /the-core |
| Positioning | “Come home to mindful living spaces”; homes “priced mindfully too”; first four properties sold out “without any concentrated brand marketing” | homepage, /the-core |
| Manifesto | “Our Core” Black & White text | /our-journey |
| Founders | Gunaranjan J and K Raja Sekhar, both “Founder \| Director”; bios condensed from /homemakers, quotes verbatim | /homemakers, homepage |
| Homeowner quotes | 5 quotes with names, native places and communities, verbatim | homepage “What a home means…” |
| Office | Disha Habitat Ventures Pvt. Ltd., #43/2, 2nd floor, Whitefield Main Road, Bengaluru 560066; map link | homepage footer, /contact-us |
| Email / phones | info@dishahabitat.com · +91 97401 03333 · +91 97403 03333 | footer, project pages |
| Socials | Instagram, Facebook, LinkedIn, YouTube URLs | site markup |
| Project facts | Size, units, saleable / built-up area, start, completion (as per OC), months, handover | each /project page |
| Project addresses | Courtyard, Central Park, Windsor Gardens | homepage footer |
| Pursuit of Sunshine | Budigere Road; 322 homes; 4 acres; 2 & 3 bedroom; 8 ft × 12 ft sundecks; gated community; RERA PRM/KA/RERA/1251/446/PR/100323/005790; amenities and specification excerpts; call line +91 95053 33333 | dishapursuitofsunshine.com, homepage |

Deliberately **not** shown because they aren’t published: prices, availability, unit configurations for the four
older communities, their amenities, possession or launch dates for future projects, and Park West’s address.

## Images and video

All imagery is Disha Habitat’s own, downloaded from their two websites. **No stock photography is used.** The full per-file list, with source URLs and usage, is in [`ASSET-MANIFEST.md`](ASSET-MANIFEST.md). The original
template’s Pexels stock and the checklist stock photos were deliberately excluded.

| Folder | Content | Type |
| --- | --- | --- |
| `images/pursuit-of-sunshine/` | towers, pool, sundial, treehouse, café, games room, entrance aerial | Photographs |
| `images/pursuit-of-sunshine/render-*` | Surya Stambh, sundeck | **Renders** — labelled “Artist’s impression” on the site |
| `images/pursuit-of-sunshine/master-plan.webp` | Master plan | Plan — labelled “Plan” |
| `images/courtyard/`, `central-park/`, `park-west/`, `windsor-gardens/` | Project photography | Photographs |
| `images/community/` | Team, gardening with children, Independence Day | Photographs |
| `media/brand-film.mp4` | Brand film from dishahabitat.com (30 s, 720p, ~7 MB), framed in the homepage hero | Video |
| `media/logo-intro.mp4` | Logo animation supplied by the client (`DISHA_HABITAT_logo_animation_1080p_…mp4`, 8 s, 1080p, 2.2 MB); a generator’s sparkle mark in the lower right is softened with a vignette | Video |
| `brand/` + `components/Logo.tsx` | Official logo SVG (master file kept for reference), paths inlined unchanged | Logo |

Each image is assigned to a project by the page it appeared on. Captions describe only what is visible.

## Disha Pursuit of the Elements (added in the second pass)

Sources: dishapursuitoftheelements.com (home, floor plans, amenities, gallery, updates) and the featured-project banner on
the dishahabitat.com homepage, inspected 12 October 2026. Facts used: Gunjur location; five-elements concept and intro
(verbatim); 20 acres; towers A, B, F, G (Premium, 25 floors), C (Millennium, 23 floors), D, E (Presidential, 29 floors);
4 & 5 BHK villas; clubhouse 1,35,000+ sq ft with 40+ amenities and the listed amenities; RERA Phase I and II numbers;
sales line +91 95053 33333, WhatsApp, email; quarterly construction updates (latest Q3 2026). “Last few 2, 3 & 4 BHK
homes” is from the dishahabitat.com banner. All 12 images (`public/images/pursuit-of-the-elements/`) come from the
project site and are labelled artist’s impressions; the master plan is labelled Plan.

## Items for the client to confirm

1. **Image rights and originals.** Confirm usage rights and photographer credits. Please supply high-resolution originals:
   the Pursuit of Sunshine gallery is only 1313 px wide.
2. **Brand film.** Supply a higher-resolution, web-optimised cut (ideally 1080p and under 4 MB) for the hero.
3. **Homeowner count.** The homepage says “800 proud homeowners”; /our-journey and /the-core say 1,000+. The prototype uses 1,000+.
4. **“Four properties” vs “5 communities”.** The prototype says “our first four properties sold out”. Confirm whether Pursuit of Sunshine is also sold out.
5. **Park West address.** The live homepage repeats Central Park’s address for Park West, so it’s omitted here. Please provide it.
6. **Handover before OC.** Courtyard, Central Park, Park West and Windsor Gardens show handover dates earlier than their OC completion dates. They’re shown as published; please confirm.
7. **Build durations.** Park West (Jan 2016 to Oct 2018) and Central Park (Apr 2015 to Oct 2018) calculate to 33 and 42 months; the site says 32 and 41.
8. **Pursuit of Sunshine status.** The project page lists OC completion March 2025 and handover June 2025. The official project site says “Estimated handover March 2025”, and the homepage still calls it “upcoming / coming soon”. The prototype shows no sales status.
9. **Project name.** “Disha Windsor Garden” (nav and URL) or “Disha Windsor Gardens” (listing and testimonial)? The prototype uses *Gardens*.
10. **Legal entity.** The footer says “© Disha Habitat Projects LLP”; the office is “Disha Habitat Ventures Pvt. Ltd.” The prototype uses the latter.
11. **Spelling.** The source says “Vrihat Smarat Yantra”; the prototype uses “Vrihat Samrat Yantra”.
12. **Founder portraits.** Two black-and-white portraits exist, but which founder each shows can’t be verified, so they aren’t used. Please supply named portraits.
13. **Photo captions.** “Independence Day, together” and the team captions are inferred from the photos. Confirm or correct them.
14. **Differentiator wording.** The six points paraphrase published copy. Approve the messaging, especially “Built to a clear timeline”.
15. **Upcoming launches.** “32,00,000+ sq ft in the making” implies new projects. Provide details if they should appear.
16. **Enquiry routing.** Where should enquiries go (CRM, email, sales line)? A privacy notice is also needed before launch.
17. **Social and map links.** These were taken from the live site; confirm they’re current.
18. **Brand voice lines.** Section headings (“Five communities, built one at a time”, “From across India, to a place called home”, “Begin with the numbers, calmly”) and the “day at Pursuit of Sunshine” phase captions are new editorial copy written for the prototype. Every factual claim in them is sourced, but please approve the tone.
19. **Affordability explorer.** Confirm the client is comfortable showing an illustrative EMI planner, and whether a partner lender or legal review should vet the disclaimer wording.
20. **Pursuit of the Elements.** Confirm “Last few 2, 3 & 4 BHK homes” is still current, whether any gallery interiors
    are photographs of a show apartment (all are labelled artist’s impressions), and whether to add prices or floor-plan
    downloads.
21. **Sales line.** The header no longer shows a phone number (client request). +91 95053 33333 (the line
    published for Pursuit of the Elements and Pursuit of Sunshine) still appears in the mobile menu and on the
    Pursuit of the Elements page. Confirm it should be the site-wide sales number.

22. **Homeowners map.** The home towns on the homepage map are plotted at approximate town
    centres (Govindapur, Odisha is ambiguous — several towns share the name), and the distances
    shown are straight-line estimates rounded to 50 km. Confirm the towns with the homeowners.

23. **Logo film.** The supplied logo animation appears to be AI-generated (it carries a generator’s sparkle mark in
    the lower right, which the site softens). Its logo matches the official artwork closely, and the site always hands
    over to the official SVG logo. Confirm the client is happy to publish the film, ideally with a clean export.

## Added from dishahabitat.com (fourth pass)

- **The checklist** (`/checklist`): the five must-knows (khata certificate, occupancy certificate, carpet area,
  deviation assessment, sewage treatment plants), text from dishahabitat.com/solution/*, lightly edited for grammar.
  Images: the site's own checklist photographs (`public/images/checklist/`).
- **This is us**: the-core text and all five figures, including 20,000+ walk-ins.
- **Homemakers**: fuller profiles of Gunaranjan J and K Raja Sekhar from /homemakers, condensed in their words.
  Portraits `people/gunaranjan-j.jpg` (grid-imgs-3) and `people/k-raja-sekhar.jpg` (grid-imgs-4), matched by their
  position beside each biography on /homemakers. **Confirm with the client.**
- **The Disha family and Events & collaborations** (/our-journey): homeowner family photographs, team photographs and
  the events collage (`public/images/people/`). Family photos are labelled "Homeowners" without names.
- **Home-life photographs** from the homepage poem section (`public/images/life/`).
- **Socials**: Instagram, Facebook, LinkedIn and YouTube links from the site footer.
- **Copyright line**: the live footer reads "© 2026, Disha Habitat Projects LLP", while the contact page names the
  corporate office as Disha Habitat Ventures Pvt. Ltd. Both are used as published. **Confirm which entity to show.**

24. **Messages.** Every WhatsApp and email action opens a form; the composed message is shown in full and opens in
    WhatsApp (+91 95053 33333) or the visitor's email app. Emails about Pursuit of the Elements go to
    info@dishapursuitoftheelements.com; others to info@dishahabitat.com. Confirm these are the right inboxes.
