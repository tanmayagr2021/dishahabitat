/*
 * Company-level content. Every value here was taken from the public pages of
 * dishahabitat.com or dishapursuitofsunshine.com (inspected October 2026).
 * See docs/CONTENT-SOURCES.md before changing any fact.
 */

export const company = {
  name: "Disha Habitat",
  legalName: "Disha Habitat Ventures Pvt. Ltd.",
  /* The footer of dishahabitat.com reads "© 2026, Disha Habitat Projects LLP". */
  copyrightHolder: "Disha Habitat Projects LLP",
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
  { value: 20000, suffix: "+", label: "Site visits" },
  { value: 2025000, suffix: "+", label: "Sq ft delivered" },
  { value: 3200000, suffix: "+", label: "Sq ft in the making" },
] as const;

/* Indian digit grouping, as the company itself publishes figures (20,25,000). */
export function formatIndian(n: number) {
  return n.toLocaleString("en-IN");
}

/* "What a home means...", homeowner words published on the dishahabitat.com homepage. */
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
    short: "Guna",
    role: "Founder & Director",
    portrait: "/images/people/gunaranjan-j.jpg",
    signature: "“Let’s meet for coffee.”",
    bio: [
      "If you know Guna, the invitation means he wants to explain something properly, until you leave as informed as any engineer, architect or site supervisor on the project.",
      "A software professional for a decade and a half before turning to homes, he is also a practising horticulturist. You will find that passion in every Disha Habitat venture.",
    ],
  },
  {
    name: "K Raja Sekhar",
    short: "Raja",
    role: "Founder & Director",
    portrait: "/images/people/k-raja-sekhar.jpg",
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

/* "This is us", dishahabitat.com/the-core (verbatim, lightly edited). */
export const thisIsUs = [
  "We have been in the business since 2014, operating largely in East Bengaluru. Our first four properties were fully sold out without any concentrated brand marketing. Our home buyers have been our brand ambassadors thus far.",
  "Our build quality and mindfulness have been our biggest strengths. We have a resident community of 1,000-plus members, which grows with each new project.",
  "Our homes are mindful living spaces that are priced mindfully too. From apartments to independent villas, every home is created with the same care. We understand what a huge deal it is to invest yourself in a home of your own.",
] as const;

/* The founders' fuller profiles, from dishahabitat.com/homemakers (condensed, in their words). */
export const homemakerProfiles: Record<string, string[]> = {
  "Gunaranjan J": [
    "If you know Guna, an invitation to coffee means one of two things: an explanation is owed and he has taken it upon himself to give it, or you have voiced a concern and he is here with a solution. Either way, you leave as knowledgeable as any engineer, architect, site supervisor, electrician or plumber on the project.",
    "He is passionately involved in the smallest details of every Disha Habitat project, and the involvement is contagious. The line between information and knowledge, so elemental to investing in a home financially and emotionally, blurs within minutes of meeting him.",
    "Before his true calling of creating mindful homes, Guna spent a decade and a half as a software professional: ERP, SAP, data warehousing, project management, consulting for global businesses in the USA. He is also a practising horticulturist, and you will find that passion in every Disha Habitat venture.",
  ],
  "K Raja Sekhar": [
    "At first, Raja comes across as a reserved man of few words, until the conversation turns to the subject he is most immersed in: what it means to create a mindful living space.",
    "For most of us, precision is academic. In Raja’s world it is as natural as breathing. He speaks plainly about structural intricacies until the simple maths of a building becomes clear, with a calm that comes from once being on the other side of the fence himself. Ask him and he will tell you he is still learning.",
    "From mobile tower infrastructure for telecom companies such as Airtel, Vodafone, Idea and Reliance, with turnkey civil, electrical, tower and DG commissioning projects, to a long association with HCL Technologies, Raja has come a long way from his humble home. Every brick laid at a Disha Habitat living space speaks for the same humility and perseverance.",
  ],
};

/* Photographs of the Disha family: homeowners at home and the people who build. */
export const dishaFamily = [
  { src: "/images/people/family-1.jpg", alt: "A Disha homeowner family at home, a father holding his young daughter", kind: "Homeowners" },
  { src: "/images/people/family-2.jpg", alt: "Three generations of a Disha homeowner family together in their living room", kind: "Homeowners" },
  { src: "/images/people/team-1.jpg", alt: "Women of the Disha Habitat team standing together outdoors", kind: "The team" },
  { src: "/images/people/family-3.jpg", alt: "A Disha homeowner family of six gathered together", kind: "Homeowners" },
  { src: "/images/people/team-2.jpg", alt: "The Disha Habitat site team seated together outdoors", kind: "The team" },
  { src: "/images/people/family-4.jpg", alt: "A Disha homeowner family with a newborn and a toddler", kind: "Homeowners" },
  { src: "/images/people/team-4.jpg", alt: "Members of the Disha Habitat team looking over plans together", kind: "The team" },
  { src: "/images/people/team-3.jpg", alt: "The Disha Habitat team standing on the giant chessboard at a Disha community", kind: "The team" },
] as const;

export const socialHandle = "@dishahabitat";
