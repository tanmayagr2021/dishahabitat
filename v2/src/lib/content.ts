/*
 * Everything V2 says about Disha Habitat. Facts are copied from the V1 site's verified data
 * (../src/lib/projects.ts, elements.ts, site.ts and proof.ts), which in turn come from
 * dishahabitat.com and the official project sites, inspected October 2026. Nothing is estimated.
 * The prose lines in `thresholds` are original copy and make no factual claims.
 */

export type Picture = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  /* Where the subject sits, so every crop keeps it in view. */
  focus: string;
  /* An artist's impression must always say so. */
  render?: boolean;
};

export type ThresholdKey = "gate" | "courtyard" | "door";

export type Threshold = {
  key: ThresholdKey;
  numeral: string;
  name: string;
  picture: Picture;
};

export const thresholds: Record<ThresholdKey, Threshold> = {
  gate: {
    key: "gate",
    numeral: "I",
    name: "The gate",
    picture: {
      src: "/images/thresholds/gate.jpg",
      width: 1900,
      height: 1200,
      alt: "A parent and a small child walk hand in hand through three concrete portals towards a sunlit, tree-lined courtyard",
      caption: "Coming home, at a Disha Habitat community",
      focus: "49% 58%",
    },
  },
  courtyard: {
    key: "courtyard",
    numeral: "II",
    name: "The courtyard",
    picture: {
      src: "/images/thresholds/courtyard.jpg",
      width: 1920,
      height: 1480,
      alt: "Apartment blocks with white lattice screens and terracotta walls gather around a garden and a lit swimming pool at dusk",
      caption: "Disha Courtyard, Hagadur Village",
      focus: "58% 62%",
    },
  },
  door: {
    key: "door",
    numeral: "III",
    name: "The door",
    picture: {
      src: "/images/thresholds/door.jpg",
      width: 1070,
      height: 1201,
      alt: "An older man in a blue kurta smiles as he opens the front door of flat B 220, while two children peek through the glass beside it",
      caption: "Flat B 220, at a Disha Habitat community",
      focus: "60% 40%",
    },
  },
};

export type Community = {
  slug: string;
  name: string;
  locality: string;
  /* One line of verified facts. */
  facts: string;
  status: string;
  current?: boolean;
  picture: Picture;
};

/* Newest first: the community on sale now, then every delivered one by handover date. */
export const communities: Community[] = [
  {
    slug: "pursuit-of-the-elements",
    name: "Pursuit of the Elements",
    locality: "Gunjur, East Bengaluru",
    facts: "20 acres · 2, 3 & 4 BHK apartments · 4 & 5 BHK villas",
    status: "Now selling",
    current: true,
    picture: {
      src: "/images/communities/elements-render.webp",
      width: 1600,
      height: 900,
      alt: "Artist’s impression of the towers of Disha Pursuit of the Elements rising behind landscaped gardens and a water channel",
      caption: "Disha Pursuit of the Elements, Gunjur. Artist’s impression",
      focus: "50% 50%",
      render: true,
    },
  },
  {
    slug: "disha-pursuit-of-sunshine",
    name: "Pursuit of Sunshine",
    locality: "Budigere Road",
    facts: "322 homes · 4 acres",
    status: "Handed over June 2025",
    picture: {
      src: "/images/communities/sunshine.webp",
      width: 1313,
      height: 739,
      alt: "The residential towers of Disha Pursuit of Sunshine rising above a line of trees",
      caption: "Disha Pursuit of Sunshine, Budigere Road",
      focus: "45% 50%",
    },
  },
  {
    slug: "disha-courtyard",
    name: "Courtyard",
    locality: "Hagadur Village",
    facts: "264 homes · 3.6 acres",
    status: "Handed over April 2021",
    picture: {
      src: "/images/communities/courtyard.jpg",
      width: 1613,
      height: 1075,
      alt: "The white and terracotta blocks of Disha Courtyard with lattice screens against a clear sky",
      caption: "Disha Courtyard, Hagadur Village",
      focus: "40% 45%",
    },
  },
  {
    slug: "disha-central-park",
    name: "Central Park",
    locality: "Panathur–Varthur Road",
    facts: "306 homes · 3.5 acres",
    status: "Handed over July 2018",
    picture: {
      src: "/images/communities/central-park.jpg",
      width: 1920,
      height: 1274,
      alt: "The glass clubhouse of Disha Central Park lit up at dusk, its pool glowing in front",
      caption: "Disha Central Park, Panathur–Varthur Road",
      focus: "45% 55%",
    },
  },
  {
    slug: "disha-park-west",
    name: "Park West",
    locality: "Bengaluru",
    facts: "118 homes · 1.5 acres",
    status: "Handed over July 2018",
    picture: {
      src: "/images/communities/park-west.jpg",
      width: 1440,
      height: 960,
      alt: "The blocks of Disha Park West rising behind the community’s entrance sign under a blue sky",
      caption: "Disha Park West",
      focus: "55% 45%",
    },
  },
  {
    slug: "disha-windsor-gardens",
    name: "Windsor Gardens",
    locality: "Panathur–Varthur Road",
    facts: "92 homes · 1.25 acres",
    status: "Handed over September 2015",
    picture: {
      src: "/images/communities/windsor-gardens.jpg",
      width: 1313,
      height: 739,
      alt: "Aerial view of the low-rise blocks of Disha Windsor Gardens among coconut palms",
      caption: "Disha Windsor Gardens, Panathur–Varthur Road",
      focus: "50% 50%",
    },
  },
];

/* 322 + 264 + 306 + 118 + 92, the five delivered communities. */
export const homesHandedOver = 1102;

export const company = {
  name: "Disha Habitat",
  founded: 2014,
  region: "East Bengaluru",
  copyright: "Disha Habitat Projects LLP",
  office: "#43/2, 2nd floor, Whitefield Main Road, Bengaluru 560066",
  email: "info@dishahabitat.com",
  /* The published sales line for Pursuit of the Elements, the community on sale. */
  sales: { display: "+91 95053 33333", tel: "tel:+919505333333" },
} as const;
