/*
 * The homepage, the header and the footer: what they say, where they link and which pictures they
 * show. Facts come from the verified data in site.ts, elements.ts, proof.ts and projects.ts (from
 * dishahabitat.com and the official project sites, inspected October 2026); change a fact there.
 * No prices, and every computer render is labelled an artist’s impression.
 */
import { elements } from "@/lib/elements";
import { company as site } from "@/lib/site";

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

export const links = {
  /* The site-visit booker on the contact page. */
  bookVisit: "/contact#book",
  elements: elements.href,
  homes: "/homes",
  story: "/story",
  checklist: "/checklist",
  contact: "/contact",
  privacy: "/privacy",
  emi: "/plan",
  /* Karnataka RERA's public search, where any registration number can be checked. */
  rera: "https://rera.karnataka.gov.in/",
  updates: elements.updates,
  mygate: "https://mygate.com/bengaluru/disha-central-park-499.html",
} as const;

export const communityHref = (slug: string) => (slug === elements.slug ? elements.href : `/homes/${slug}`);

const enquiry = "Hello Disha Habitat, I would like to know more about Pursuit of the Elements.";

export const company = {
  name: site.name,
  copyright: site.copyrightHolder,
  year: site.copyrightYear,
  office: site.office.lines.join(", "),
  email: site.email,
  /* The published sales line for Pursuit of the Elements, which also takes WhatsApp. */
  sales: { display: elements.phone.display, tel: elements.phone.href },
  whatsapp: `${elements.whatsapp}&text=${encodeURIComponent(enquiry)}`,
  socials: site.socials,
  rera: elements.rera,
} as const;

const bookVisit: Cta = { label: "Book a visit", href: links.bookVisit };
const learnElements: Cta = { label: "Explore", href: links.elements };

/* The one quiet line at the foot of every hero slide. "verify" goes to the RERA strip on the project page. */
export const trust = {
  record: "1,102 homes handed over since 2014",
  rera: "Karnataka RERA registered",
  verify: `${elements.href}#rera`,
} as const;

/* The hero: three slides that change every ten seconds, as on tesla.com. */
export type Slide = {
  id: string;
  title: string;
  line: string;
  image: Img;
  primary: Cta;
  secondary: Cta;
  /* One small line above the title: what is on offer and where. */
  eyebrow: string;
  note: string;
};

export const heroSlides: Slide[] = [
  {
    id: "elements",
    eyebrow: "Now selling · Gunjur, East Bengaluru",
    title: "Pursuit of the Elements",
    line: "2, 3\u00a0&\u00a04 BHK homes and 4\u00a0&\u00a05 BHK villas on 20\u00a0acres",
    image: {
      src: "/images/pursuit-of-the-elements/towers.webp",
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
    eyebrow: "Since 2014 · East Bengaluru",
    title: "1,102 homes handed over",
    line: "Across five Disha communities in East Bengaluru",
    image: {
      src: "/images/central-park/clubhouse-dusk.jpg",
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
    eyebrow: "Now selling · Gunjur, East Bengaluru",
    title: "The Villas",
    line: "4 & 5 BHK independent villas at Pursuit of the Elements",
    image: {
      src: "/images/pursuit-of-the-elements/villas.webp",
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
    title: "Find a community",
    line: "One selling now, five handed over across East Bengaluru.",
  },
  life: {
    title: "Inside Pursuit of the Elements",
    line: "40+ amenities across 20 acres. Every image here is an artist’s impression.",
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
      src: "/images/pursuit-of-the-elements/play-lawn.webp",
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
      src: "/images/pursuit-of-sunshine/pool-aerial.webp",
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
      src: "/images/courtyard/pool-court.jpg",
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
      src: "/images/central-park/clubhouse-night.webp",
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
      src: "/images/park-west/facade.jpg",
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
      src: "/images/windsor-gardens/aerial.jpg",
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

/* The story panel: the team photograph, as tesla.com gives each topic a full screen. */
export const story = {
  eyebrow: "Since 2014",
  title: "Our story",
  line: "How two homebuyers became builders, in the founders’ own words.",
  image: {
    src: "/images/community/site-team-1600.webp",
    width: 1600,
    height: 1067,
    alt: "The Disha Habitat site and engineering team gathered on a landscaped lawn",
    position: "50% 45%",
    mobilePosition: "50% 50%",
  } satisfies Img,
  ctas: [{ label: "Read our story", href: links.story }, bookVisit] as Cta[],
};

/* Two half-width tiles, where tesla.com shows its offers: the two tools a buyer uses before a visit. */
export const promos = [
  {
    title: "Estimate your EMI",
    line: "Work out a monthly EMI from your own figures. Nothing you enter leaves your browser.",
    cta: { label: "Open the calculator", href: links.emi },
    image: {
      src: "/images/people/family-1-1600.webp",
      width: 1600,
      height: 1067,
      alt: "A Disha homeowner at home, a father holding his young daughter",
      position: "50% 40%",
    } satisfies Img,
  },
  {
    title: "The buyer’s checklist",
    line: "Khata, occupancy certificate, carpet area and more, explained before you buy.",
    cta: { label: "Open the checklist", href: links.checklist },
    image: {
      src: "/images/central-park/front-door.jpg",
      width: 1280,
      height: 1920,
      alt: "The front door of a home at Disha Central Park",
      position: "50% 40%",
    } satisfies Img,
  },
];

/* Life at Pursuit of the Elements, where tesla.com shows its energy products. All renders. */
export const life: { name: string; line: string; image: Img }[] = [
  {
    name: "The clubhouse",
    line: "1,35,000+ sq ft, with a rooftop heated pool",
    image: {
      src: "/images/pursuit-of-the-elements/clubhouse.webp",
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
      src: "/images/pursuit-of-the-elements/amphitheatre.webp",
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
      src: "/images/pursuit-of-the-elements/outdoor-cafe.webp",
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
      src: "/images/pursuit-of-the-elements/giant-chess.webp",
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
      src: "/images/pursuit-of-the-elements/courts-aerial.webp",
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
