/*
 * Company-level content. Every value here was taken from the public pages of
 * dishahabitat.com or dishapursuitofsunshine.com (inspected October 2026).
 * See docs/CONTENT-SOURCES.md before changing any fact.
 */

export const company = {
  name: "Disha Habitat",
  legalName: "Disha Habitat Ventures Pvt. Ltd.",
  founded: 2014,
  copyrightYear: 2026,
  region: "East Bengaluru",
  tagline: "Come home to mindful living spaces",
  office: {
    lines: ["#43/2, 2nd floor, Whitefield Main Road", "Bengaluru 560066"],
    mapUrl: "https://maps.app.goo.gl/indMTyrEEACtvXnz6",
  },
  email: "info@dishahabitat.com",
  phones: [
    { display: "+91 97401 03333", href: "tel:+919740103333" },
    { display: "+91 97403 03333", href: "tel:+919740303333" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com/dishahabitat" },
    { label: "Facebook", href: "https://www.facebook.com/DishaHabitat/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/disha-habitat/" },
    { label: "YouTube", href: "https://www.youtube.com/channel/UCjP2EbQ0EQnB7tCUB-GGAEQ" },
  ],
  brandFilm: {
    title: "Disha Habitat | Come home to mindful living spaces",
    youtubeUrl: "https://www.youtube.com/watch?v=EFDhOmvK108",
  },
} as const;

/* "This is us" figures, published on dishahabitat.com/the-core. */
export const stats = [
  { value: 5, suffix: "", label: "Communities created" },
  { value: 1000, suffix: "+", label: "Happy families" },
  { value: 20000, suffix: "+", label: "Walk-ins" },
  { value: 2025000, suffix: "+", label: "Sq ft delivered" },
  { value: 3200000, suffix: "+", label: "Sq ft in the making" },
] as const;

/* Indian digit grouping, as the company itself publishes figures (20,25,000). */
export function formatIndian(n: number) {
  return n.toLocaleString("en-IN");
}

/* "What a home means..." — homeowner words published on the dishahabitat.com homepage. */
export const homeowners = [
  {
    quote:
      "Home is where your daily journey starts… it’s not just a place but a source of love, affection and feeling.",
    name: "Prasanta & Lipsita",
    native: "Govindapur, Odisha",
    resident: "Disha Courtyard",
    slug: "disha-courtyard",
  },
  {
    quote:
      "Home is a safe haven and a comfort zone… A place to build memories and the family’s future.",
    name: "Bala",
    native: "Gundlapalli, Andhra Pradesh",
    resident: "Disha Park West",
    slug: "disha-park-west",
  },
  {
    quote: "A House + Love = Home",
    name: "Prasanth",
    native: "Guruvayur, Kerala",
    resident: "Disha Windsor Gardens",
    slug: "disha-windsor-gardens",
  },
  {
    quote:
      "When birds fly back to their nests leaving you alone, when the rain pours like it will wash away everything, there is a place called home… that reassures you.",
    name: "K Ratna Dileep Kumar",
    native: "Malkipuram, Andhra Pradesh",
    resident: "Disha Central Park",
    slug: "disha-central-park",
  },
  {
    quote: "Home is a place where you forget all your worries and live stress free.",
    name: "Hrishabh Kumar & Sonachhi Bajpai",
    native: "Tekari, Bihar",
    resident: "Disha Courtyard",
    slug: "disha-courtyard",
  },
] as const;

/* Founders, from dishahabitat.com/homemakers. Quotes are verbatim; bios are condensed. */
export const homemakers = [
  {
    name: "Gunaranjan J",
    role: "Founder & Director",
    signature: "“Let’s meet for coffee.”",
    bio: [
      "If you know Guna, the invitation means he wants to explain something properly — until you leave as informed as any engineer, architect or site supervisor on the project.",
      "A software professional for a decade and a half before turning to homes, he is also a practising horticulturist. You will find that passion in every Disha Habitat venture.",
    ],
  },
  {
    name: "K Raja Sekhar",
    role: "Founder & Director",
    signature:
      "“Whatever you do, give it a hundred percent of yourself. Even if it’s something you have never tried before.”",
    bio: [
      "For Raja, precision is as natural as breathing. He speaks plainly about structural intricacies until the simple maths of a building becomes clear.",
      "From turnkey telecom-infrastructure projects to a long association with HCL Technologies, he brings the same humility and perseverance to every brick laid.",
    ],
  },
] as const;

/* The company's own poem, from the dishahabitat.com homepage: opening and closing lines. */
export const poem = {
  opening: ["I dream of a place for you and me", "Where we smile as the sun rises"],
  closing: "I dream of a place we can call home.",
} as const;
