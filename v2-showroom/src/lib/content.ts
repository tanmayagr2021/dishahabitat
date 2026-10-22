/*
 * Everything the showroom homepage says about Disha Habitat. Facts are copied from the V1 site's
 * verified data (../src/lib/projects.ts, elements.ts, proof.ts and site.ts), which come from
 * dishahabitat.com and the official project sites, inspected October 2026. Change a fact there first.
 * No prices, and every computer render is labelled an artist's impression.
 */

export type Img = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /* object-position on wide screens, and on phones, where the frame turns portrait */
  position?: string;
  mobilePosition?: string;
};

export type Cta = { label: string; href: string };

/* V2 is the homepage only; every other page lives on the full site. Change when the domain moves. */
export const fullSite = "https://dishahabitat.vercel.app";

export const links = {
  /* The site-visit booker on the full site: it opens the visitor's own WhatsApp or email. */
  bookVisit: `${fullSite}/contact#book`,
  elements: `${fullSite}/homes/pursuit-of-the-elements`,
  homes: `${fullSite}/homes`,
  story: `${fullSite}/story`,
  checklist: `${fullSite}/checklist`,
  contact: `${fullSite}/contact`,
  privacy: `${fullSite}/privacy`,
  emi: `${fullSite}/plan`,
  /* Karnataka RERA's public search, where any registration number can be checked. */
  rera: "https://rera.karnataka.gov.in/",
  updates: "https://www.dishapursuitoftheelements.com/project-updates",
  mygate: "https://mygate.com/bengaluru/disha-central-park-499.html",
} as const;

export const communityHref = (slug: string) => `${fullSite}/homes/${slug}`;

const enquiry = "Hello Disha Habitat, I would like to know more about Pursuit of the Elements.";

export const company = {
  name: "Disha Habitat",
  copyright: "Disha Habitat Projects LLP",
  year: 2026,
  office: "#43/2, 2nd floor, Whitefield Main Road, Bengaluru 560066",
  email: "info@dishahabitat.com",
  /* The published sales line for Pursuit of the Elements, which also takes WhatsApp. */
  sales: { display: "+91 95053 33333", tel: "tel:+919505333333" },
  whatsapp: `https://api.whatsapp.com/send?phone=919505333333&text=${encodeURIComponent(enquiry)}`,
  socials: [
    { label: "Instagram", href: "https://instagram.com/dishahabitat" },
    { label: "YouTube", href: "https://www.youtube.com/channel/UCjP2EbQ0EQnB7tCUB-GGAEQ" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/disha-habitat/" },
  ],
  rera: [
    { phase: "Phase I", no: "PRM/KA/RERA/1251/308/PR/280324/006756" },
    { phase: "Phase II", no: "PRM/KA/RERA/1251/308/PR/060924/007003" },
  ],
} as const;

const bookVisit: Cta = { label: "Book a visit", href: links.bookVisit };
const learnElements: Cta = { label: "Explore", href: links.elements };

/* The hero: three slides that change every ten seconds, as on tesla.com. */
export type Slide = {
  id: string;
  title: string;
  line: string;
  image: Img;
  primary: Cta;
  secondary: Cta;
  /* Who stands behind the slide, in one line: the maker and the proof. */
  proof?: string;
  note: string;
};

export const heroSlides: Slide[] = [
  {
    id: "elements",
    title: "Pursuit of the Elements",
    line: "Last few 2, 3 & 4 BHK homes on 20 acres in Gunjur, East Bengaluru",
    proof: "By Disha Habitat  ·  1,102 homes handed over  ·  Karnataka RERA registered",
    image: {
      src: "/images/elements/towers.webp",
      width: 1600,
      height: 900,
      alt: "Artist’s impression of the Pursuit of the Elements towers above landscaped gardens and a water channel",
      position: "50% 64%",
      mobilePosition: "60% 50%",
    },
    primary: bookVisit,
    secondary: learnElements,
    note: "Artist’s impression",
  },
  {
    id: "record",
    title: "1,102 homes handed over",
    line: "Across five Disha communities in East Bengaluru",
    image: {
      src: "/images/homes/central-park-dusk.jpg",
      width: 1920,
      height: 1274,
      alt: "The glass clubhouse at Disha Central Park lit at dusk, cantilevered over the pool",
      position: "50% 66%",
      mobilePosition: "58% 50%",
    },
    primary: bookVisit,
    secondary: { label: "Our homes", href: links.homes },
    note: "Disha Central Park, handed over in 2018",
  },
  {
    id: "villas",
    title: "The Villas",
    line: "4 & 5 BHK independent villas at Pursuit of the Elements, Gunjur",
    proof: "By Disha Habitat  ·  Karnataka RERA registered",
    image: {
      src: "/images/elements/villas.webp",
      width: 1440,
      height: 750,
      alt: "Artist’s impression of the villa rows from above, with a pool and gardens",
      position: "50% 60%",
      mobilePosition: "40% 50%",
    },
    primary: bookVisit,
    secondary: learnElements,
    note: "Artist’s impression",
  },
];

/* The proof panel, where tesla.com shows Full Self-Driving: an award, two figures and a film. */
export const proof = {
  title: "Innovation Real Estate Project of the Year",
  line: "A Certificate of Excellence for Pursuit of the Elements at the ET Business Awards 2025, residential category.",
  badges: [
    { value: "5", label: "Communities handed over" },
    { value: "4.7/5", label: "Rated by Central Park residents on MyGate", note: "1" },
  ],
  primary: bookVisit,
  film: {
    src: "/media/brand-film.mp4",
    poster: "/media/brand-film-aerial.jpg",
    label: "Disha Habitat’s brand film: residents, homes and gardens across Disha communities",
  },
} as const;

/* Headings for the two rows of cards: what the row is, in a few words. */
export const rows = {
  communities: {
    title: "Our communities",
    line: "One selling now, five handed over across East Bengaluru.",
  },
  life: {
    title: "Inside Pursuit of the Elements",
    line: "40+ amenities across 20 acres. Every image here is an artist's impression.",
    link: { label: "See every amenity", href: links.elements },
  },
} as const;

/* Every community, newest first after the one on sale. */
export type Community = {
  slug: string;
  name: string;
  eyebrow: string;
  place: string;
  line: string;
  image: Img;
  render?: boolean;
  ctas: Cta[];
};

export const communities: Community[] = [
  {
    slug: "pursuit-of-the-elements",
    name: "Pursuit of the Elements",
    eyebrow: "Now selling",
    place: "Gunjur, East Bengaluru",
    line: "2, 3 & 4 BHK apartments · 4 & 5 BHK villas",
    image: {
      src: "/images/elements/play-lawn.webp",
      width: 1920,
      height: 1080,
      alt: "Artist’s impression of a children’s play lawn with a grassy mound and tunnel, the towers behind",
      position: "50% 55%",
      mobilePosition: "62% 50%",
    },
    render: true,
    ctas: [bookVisit, learnElements],
  },
  {
    slug: "disha-pursuit-of-sunshine",
    name: "Pursuit of Sunshine",
    eyebrow: "Handed over 2025",
    place: "Budigere Road",
    line: "322 homes on 4 acres",
    image: {
      src: "/images/homes/sunshine-pool.webp",
      width: 1313,
      height: 739,
      alt: "Overhead view of a swimmer in the turquoise pool at Disha Pursuit of Sunshine",
      position: "50% 50%",
      mobilePosition: "56% 50%",
    },
    ctas: [{ label: "Explore", href: communityHref("disha-pursuit-of-sunshine") }],
  },
  {
    slug: "disha-courtyard",
    name: "Courtyard",
    eyebrow: "Handed over 2021",
    place: "Hagadur Village",
    line: "264 homes on 3.6 acres",
    image: {
      src: "/images/homes/courtyard.jpg",
      width: 1920,
      height: 1480,
      alt: "Disha Courtyard’s white and terracotta blocks around a pool and landscaped lawn",
      position: "50% 58%",
      mobilePosition: "55% 50%",
    },
    ctas: [{ label: "Explore", href: communityHref("disha-courtyard") }],
  },
  {
    slug: "disha-central-park",
    name: "Central Park",
    eyebrow: "Handed over 2018",
    place: "Panathur–Varthur Road",
    line: "306 homes on 3.5 acres",
    image: {
      src: "/images/homes/central-park-night.jpg",
      width: 1920,
      height: 1174,
      alt: "Night aerial of the clubhouse and illuminated pool at Disha Central Park",
      position: "50% 55%",
      mobilePosition: "48% 50%",
    },
    ctas: [{ label: "Explore", href: communityHref("disha-central-park") }],
  },
  {
    slug: "disha-park-west",
    name: "Park West",
    eyebrow: "Handed over 2018",
    place: "Bengaluru",
    line: "118 homes on 1.5 acres",
    image: {
      src: "/images/homes/park-west.jpg",
      width: 1440,
      height: 960,
      alt: "Disha Park West’s mustard and white residential block in warm afternoon light",
      position: "50% 45%",
      mobilePosition: "62% 50%",
    },
    ctas: [{ label: "Explore", href: communityHref("disha-park-west") }],
  },
  {
    slug: "disha-windsor-gardens",
    name: "Windsor Gardens",
    eyebrow: "Handed over 2015",
    place: "Panathur–Varthur Road",
    line: "92 homes on 1.25 acres",
    image: {
      src: "/images/homes/windsor-gardens.jpg",
      width: 1313,
      height: 739,
      alt: "Aerial view of Disha Windsor Gardens among coconut palms, with the city skyline behind",
      position: "50% 55%",
      mobilePosition: "50% 50%",
    },
    ctas: [{ label: "Explore", href: communityHref("disha-windsor-gardens") }],
  },
];

/* The last thing on the page: one clear next step. */
export const closing = {
  title: "See Pursuit of the Elements in person",
  line: "Book a site visit to Gunjur, or call the sales team on +91 95053 33333.",
};

/* Two cards, where tesla.com shows current offers and its inventory. */
export const promos = [
  {
    title: "Our story",
    line: "How two homebuyers became builders, in the founders’ own words.",
    cta: { label: "Read our story", href: links.story },
    image: {
      src: "/images/story/founders.jpg",
      width: 1920,
      height: 1280,
      alt: "Disha Habitat founders Gunaranjan J and K Raja Sekhar",
      position: "62% 40%",
    },
  },
  {
    title: "The checklist",
    line: "Khata, occupancy certificate, carpet area and more, explained before you buy.",
    cta: { label: "Open the checklist", href: links.checklist },
    image: {
      src: "/images/story/front-door.jpg",
      width: 1280,
      height: 1920,
      alt: "The front door of a home at Disha Central Park",
      position: "50% 40%",
    },
  },
] as const;

/* Life at Pursuit of the Elements, where tesla.com shows its energy products. All renders. */
export const life: { name: string; line: string; image: Img }[] = [
  {
    name: "The clubhouse",
    line: "1,35,000+ sq ft, with a rooftop heated pool",
    image: {
      src: "/images/elements/clubhouse.webp",
      width: 1440,
      height: 750,
      alt: "Artist’s impression of the clubhouse with a large sculpted sphere at its entrance",
      position: "50% 50%",
      mobilePosition: "46% 50%",
    },
  },
  {
    name: "Amphitheatre",
    line: "Open-air, with stepped lawns",
    image: {
      src: "/images/elements/amphitheatre.webp",
      width: 1440,
      height: 750,
      alt: "Artist’s impression of the open-air amphitheatre with stepped lawns",
      position: "50% 50%",
      mobilePosition: "30% 50%",
    },
  },
  {
    name: "Outdoor café",
    line: "Under the trees",
    image: {
      src: "/images/elements/outdoor-cafe.webp",
      width: 1440,
      height: 750,
      alt: "Artist’s impression of an outdoor café under the trees",
      position: "50% 50%",
      mobilePosition: "45% 50%",
    },
  },
  {
    name: "Giant chessboard",
    line: "Among planted terraces",
    image: {
      src: "/images/elements/giant-chess.webp",
      width: 1920,
      height: 1080,
      alt: "Artist’s impression of a giant outdoor chessboard among planted terraces",
      position: "50% 60%",
      mobilePosition: "70% 50%",
    },
  },
  {
    name: "Courts and lawns",
    line: "Tennis, futsal, cricket and skating",
    image: {
      src: "/images/elements/courts-aerial.webp",
      width: 1440,
      height: 750,
      alt: "Artist’s impression of the sports courts and lawns from above",
      position: "50% 50%",
      mobilePosition: "62% 50%",
    },
  },
];

/* The header: one menu with every community (like tesla.com's Vehicles), then plain links. */
export const nav = [
  { label: "Pursuit of the Elements", href: links.elements },
  { label: "Our story", href: links.story },
  { label: "Checklist", href: links.checklist },
  { label: "Contact", href: links.contact },
] as const;

export const homesMenuLinks = [
  { label: "All homes", href: links.homes },
  { label: "Book a visit", href: links.bookVisit },
  { label: "Construction updates", href: links.updates },
  { label: "EMI calculator", href: links.emi },
  { label: "Check a RERA number", href: links.rera },
] as const;
