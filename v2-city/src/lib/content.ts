/*
 * Everything V2 says about Disha Habitat. Facts are copied from the V1 site's verified data
 * (../src/lib/projects.ts, elements.ts and site.ts), which come from dishahabitat.com and the
 * official project sites, inspected October 2026. Map positions come from OpenStreetMap; see
 * lib/atlas.generated.ts and CONCEPTS.md for how each plot was identified.
 */

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  focus: string;
  render?: boolean;
};

export type Community = {
  slug: string;
  name: string;
  locality: string;
  /* The year that names the chapter: handover, or "Now" for the community on sale. */
  year: string;
  homes?: number;
  acres: string;
  homeTypes?: string;
  built?: { start: string; handover: string };
  current?: boolean;
  /* False when the location is not published and no mapped plot exists. */
  mapped: boolean;
  photo: Photo;
};

/* In the order they were handed over; the community on sale comes last. */
export const communities: Community[] = [
  {
    slug: "disha-windsor-gardens",
    name: "Windsor Gardens",
    locality: "Panathur–Varthur Road",
    year: "2015",
    homes: 92,
    acres: "1.25 acres",
    built: { start: "January 2014", handover: "September 2015" },
    mapped: true,
    photo: {
      src: "/images/windsor-gardens.jpg",
      width: 1313,
      height: 739,
      alt: "Aerial view of the low-rise blocks of Disha Windsor Gardens among coconut palms, with the city skyline behind",
      caption: "Disha Windsor Gardens from above",
      focus: "50% 55%",
    },
  },
  {
    slug: "disha-central-park",
    name: "Central Park",
    locality: "Panathur–Varthur Road",
    year: "2018",
    homes: 306,
    acres: "3.5 acres",
    built: { start: "April 2015", handover: "July 2018" },
    mapped: true,
    photo: {
      src: "/images/central-park.jpg",
      width: 1920,
      height: 1274,
      alt: "The glass clubhouse of Disha Central Park lit at dusk, cantilevered over its pool",
      caption: "The clubhouse at dusk, Disha Central Park",
      focus: "45% 55%",
    },
  },
  {
    slug: "disha-park-west",
    name: "Park West",
    locality: "Bengaluru",
    year: "2018",
    homes: 118,
    acres: "1.5 acres",
    built: { start: "January 2016", handover: "July 2018" },
    mapped: false,
    photo: {
      src: "/images/park-west.jpg",
      width: 1440,
      height: 960,
      alt: "Disha Park West’s mustard and white residential block in warm afternoon light",
      caption: "Disha Park West",
      focus: "50% 45%",
    },
  },
  {
    slug: "disha-courtyard",
    name: "Courtyard",
    locality: "Hagadur Village",
    year: "2021",
    homes: 264,
    acres: "3.6 acres",
    built: { start: "December 2018", handover: "April 2021" },
    mapped: true,
    photo: {
      src: "/images/courtyard.jpg",
      width: 1920,
      height: 1480,
      alt: "Disha Courtyard’s white and terracotta blocks gathered around a lit pool and landscaped lawn at dusk",
      caption: "The central court, Disha Courtyard",
      focus: "60% 60%",
    },
  },
  {
    slug: "disha-pursuit-of-sunshine",
    name: "Pursuit of Sunshine",
    locality: "Budigere Road",
    year: "2025",
    homes: 322,
    acres: "4 acres",
    homeTypes: "2 & 3 BHK",
    built: { start: "January 2023", handover: "June 2025" },
    mapped: true,
    photo: {
      src: "/images/pursuit-of-sunshine.webp",
      width: 1313,
      height: 739,
      alt: "The residential towers of Disha Pursuit of Sunshine rising above a line of trees",
      caption: "The towers, Disha Pursuit of Sunshine",
      focus: "45% 50%",
    },
  },
  {
    slug: "pursuit-of-the-elements",
    name: "Pursuit of the Elements",
    locality: "Gunjur, East Bengaluru",
    year: "Now",
    acres: "20 acres",
    homeTypes: "2, 3 & 4 BHK apartments · 4 & 5 BHK villas",
    current: true,
    mapped: true,
    photo: {
      src: "/images/pursuit-of-the-elements-render.webp",
      width: 1600,
      height: 900,
      alt: "Artist’s impression of the towers of Disha Pursuit of the Elements behind landscaped gardens and a water channel",
      caption: "Disha Pursuit of the Elements. Artist’s impression",
      focus: "50% 50%",
      render: true,
    },
  },
];

export const mapped = communities.filter((c) => c.mapped);

/* Running total of homes handed over, as each mapped chapter is reached (Park West counted in 2018). */
export function handedOverBy(slug: string) {
  const i = communities.findIndex((c) => c.slug === slug);
  return communities
    .slice(0, i + 1)
    .concat(slug === "disha-central-park" ? [communities[2]!] : [])
    .reduce((n, c) => n + (c.homes ?? 0), 0);
}

export const homesHandedOver = communities.reduce((n, c) => n + (c.homes ?? 0), 0); // 1,102

export const company = {
  name: "Disha Habitat",
  founded: 2014,
  region: "East Bengaluru",
  copyright: "Disha Habitat Projects LLP",
  office: "#43/2, 2nd floor, Whitefield Main Road, Bengaluru 560066",
  email: "info@dishahabitat.com",
  /* The published sales line for Pursuit of the Elements. */
  sales: { display: "+91 95053 33333", tel: "tel:+919505333333" },
  rera: [
    { phase: "Phase I", no: "PRM/KA/RERA/1251/308/PR/280324/006756" },
    { phase: "Phase II", no: "PRM/KA/RERA/1251/308/PR/060924/007003" },
  ],
} as const;

/* V2 is the homepage only; every other page lives on the full site. Change when the domain moves. */
export const fullSite = "https://dishahabitat.vercel.app";
export const communityHref = (slug: string) => `${fullSite}/homes/${slug}`;
const visitMessage = "Hello Disha Habitat, I would like to plan a visit to Pursuit of the Elements in Gunjur.";
export const whatsappVisit = `https://api.whatsapp.com/send?phone=919505333333&text=${encodeURIComponent(visitMessage)}`;
