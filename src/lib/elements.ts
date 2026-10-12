/*
 * Disha Pursuit of the Elements, Gunjur: the project Disha Habitat is selling now.
 * Every fact comes from dishapursuitoftheelements.com (home, floor plans, amenities, updates)
 * and the featured-project banner on dishahabitat.com, inspected 12 October 2026.
 * The imagery on those sites is computer-generated, so every image here is labelled a render.
 */
import type { Media } from "@/lib/projects";

const render = (src: string, width: number, height: number, alt: string, caption: string): Media => ({
  src,
  width,
  height,
  alt,
  caption,
  kind: "render",
});

const dir = "/images/pursuit-of-the-elements";

export const elements = {
  slug: "pursuit-of-the-elements",
  href: "/homes/pursuit-of-the-elements",
  name: "Disha Pursuit of the Elements",
  shortName: "Pursuit of the Elements",
  hue: "var(--color-elements)",
  locality: "Gunjur, East Bengaluru",
  status: "Now selling",
  /* From the featured-project banner on dishahabitat.com. */
  offer: "Last few 2, 3 & 4 BHK homes",
  tagline: "Let it all come to you.",
  intro:
    "Disha Pursuit of the Elements, located at Gunjur, draws inspiration from the five elements of nature. The core elemental attributes of space, fire, air, water and earth have been captured in every aspect of the homes and amenities here.",
  fiveElements: ["Space", "Fire", "Air", "Water", "Earth"],
  facts: [
    { label: "Land", value: "20 acres" },
    { label: "Apartments", value: "2, 3 & 4 BHK" },
    { label: "Villas", value: "4 & 5 BHK" },
    { label: "Clubhouse", value: "1,35,000+ sq ft" },
    { label: "Amenities", value: "40+" },
    { label: "Towers", value: "7, up to 29 floors" },
  ],
  towers: [
    { name: "Premium Towers", which: "A, B, F, G", floors: "Basement + 2 parking levels + 25 floors" },
    { name: "Presidential Towers", which: "D, E", floors: "2 basements + 2 parking levels + 29 floors" },
    { name: "Millennium Tower", which: "C", floors: "2 basements + 2 parking levels + 23 floors" },
    { name: "Villas", which: "4 & 5 BHK", floors: "Independent villas within the community" },
  ],
  clubhouse: [
    "Rooftop heated pool",
    "Badminton & squash courts",
    "Banquet hall",
    "Terrace gardens & supermart",
    "Boutique spaces",
    "Day care centre",
    "Library & study rooms",
  ],
  outdoor: [
    "Five Elements Sculpture Park",
    "Waterbody with fountain",
    "Amphitheatre",
    "Reflexology path",
    "Hammock zone",
    "Giant chessboard",
    "Outdoor café",
    "Kitchen garden",
    "Lily pond",
    "Camping zones",
    "Tennis court",
    "Futsal court",
    "Cricket pitch",
    "Skating rink",
    "Putt-putt golf",
    "Pet parks",
    "Aroma garden",
    "Jogging & walking track",
  ],
  cover: render(`${dir}/towers.webp`, 1600, 900, "Artist’s impression of the Pursuit of the Elements towers above landscaped gardens and a water channel", "The towers and central gardens"),
  gallery: [
    render(`${dir}/clubhouse.webp`, 1440, 750, "Artist’s impression of the clubhouse with a large sculpted sphere at its entrance", "The clubhouse, 1,35,000+ sq ft"),
    render(`${dir}/play-lawn.webp`, 1920, 1080, "Artist’s impression of a children’s play lawn with a grassy mound and tunnel", "Kids’ play area on the lawn"),
    render(`${dir}/living.webp`, 844, 750, "Artist’s impression of a bright living and dining room with an open kitchen", "Living and dining"),
    render(`${dir}/giant-chess.webp`, 1920, 1080, "Artist’s impression of a giant outdoor chessboard among planted terraces", "The giant chessboard"),
    render(`${dir}/bedroom.webp`, 844, 750, "Artist’s impression of a bedroom with a green panelled wall", "A bedroom"),
    render(`${dir}/amphitheatre.webp`, 1440, 750, "Artist’s impression of the open-air amphitheatre with stepped lawns", "The amphitheatre"),
    render(`${dir}/outdoor-cafe.webp`, 1440, 750, "Artist’s impression of an outdoor café under the trees", "The outdoor café"),
    render(`${dir}/lounge.webp`, 844, 750, "Artist’s impression of a lounge corner with a sofa and a large plant", "A quiet corner"),
    render(`${dir}/villas.webp`, 1440, 750, "Artist’s impression of the villa rows from above, with a pool and gardens", "The villas, from above"),
    render(`${dir}/courts-aerial.webp`, 1440, 750, "Artist’s impression of the sports courts and lawns from above", "Courts and lawns, from above"),
  ],
  masterPlan: {
    src: `${dir}/master-plan.jpg`,
    width: 2200,
    height: 1414,
    alt: "Master plan of Disha Pursuit of the Elements showing the towers, villas, clubhouse and landscaped grounds",
    caption: "Master plan",
    kind: "plan" as const,
  },
  rera: [
    { phase: "Phase I", no: "PRM/KA/RERA/1251/308/PR/280324/006756" },
    { phase: "Phase II", no: "PRM/KA/RERA/1251/308/PR/060924/007003" },
  ],
  phone: { display: "+91 95053 33333", href: "tel:+919505333333" },
  whatsapp: "https://api.whatsapp.com/send?phone=919505333333",
  email: "info@dishapursuitoftheelements.com",
  website: { label: "dishapursuitoftheelements.com", href: "https://www.dishapursuitoftheelements.com/" },
  updates: "https://www.dishapursuitoftheelements.com/project-updates",
  /* The project site publishes quarterly construction newsletters; the latest is Q3 (July) 2026. */
  latestUpdate: "Q3 2026",
} as const;
