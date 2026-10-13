/*
 * Every Disha Habitat community in one shape, for the cards and the project explorer.
 * Built only from lib/projects.ts and lib/elements.ts, no figure here is new. Where a fact is
 * not published (e.g. the number of homes at Pursuit of the Elements) it is left null and the
 * interface omits it rather than guessing.
 */
import { elements } from "@/lib/elements";
import { projectsByHandover, type Media, type Project } from "@/lib/projects";

export type PortfolioItem = {
  slug: string;
  href: string;
  name: string;
  shortName: string;
  locality: string;
  hue: string;
  status: "Now selling" | "Delivered";
  handoverYear: number | null;
  homes: number | null;
  acres: number;
  configurations: string | null;
  intro: string;
  /* A photograph chosen for the cards; `gallery` for the explorer. */
  image: { src: string; alt: string; kind: Media["kind"]; position?: string };
  gallery: Media[];
  facts: { label: string; value: string }[];
};

const fact = (p: Project, label: string) => p.facts.find((f) => f.label === label)?.value;

/* The strongest photograph of each delivered community, for the cards. */
const cardImage: Record<string, { src: string; alt: string; position?: string }> = {
  "disha-pursuit-of-sunshine": {
    src: "/images/pursuit-of-sunshine/towers.webp",
    alt: "The two residential towers of Disha Pursuit of Sunshine above a line of trees",
    position: "40% 50%",
  },
  "disha-courtyard": {
    src: "/images/courtyard/facade-pool.jpg",
    alt: "A Disha Courtyard tower rising behind the pool deck and palms",
    position: "50% 45%",
  },
  "disha-central-park": {
    src: "/images/central-park/clubhouse-dusk.jpg",
    alt: "The glass clubhouse at Disha Central Park lit up at dusk above the pool",
    position: "55% 55%",
  },
  "disha-park-west": {
    src: "/images/park-west/facade.jpg",
    alt: "Disha Park West’s mustard and white residential block",
    position: "40% 50%",
  },
  "disha-windsor-gardens": {
    src: "/images/windsor-gardens/aerial.jpg",
    alt: "Aerial view of Disha Windsor Gardens among coconut palms",
    position: "50% 50%",
  },
};

const delivered: PortfolioItem[] = [...projectsByHandover].reverse().map((p) => ({
  slug: p.slug,
  href: `/homes/${p.slug}`,
  name: p.name,
  shortName: p.shortName,
  locality: p.locality,
  hue: p.hue,
  status: "Delivered",
  handoverYear: p.handoverYear,
  homes: Number(fact(p, "Homes") ?? 0) || null,
  acres: parseFloat(fact(p, "Project size") ?? "0"),
  configurations: fact(p, "Homes offered") ?? null,
  intro: p.intro,
  image: { ...cardImage[p.slug], kind: "photo" },
  gallery: [p.cover, ...p.gallery.filter((g) => g.kind !== "plan")].slice(0, 5),
  facts: [
    { label: "Homes", value: fact(p, "Homes") ?? "" },
    { label: "Land", value: fact(p, "Project size") ?? "" },
    { label: "Handed over", value: String(p.handoverYear) },
  ],
}));

const current: PortfolioItem = {
  slug: elements.slug,
  href: elements.href,
  name: elements.name,
  shortName: elements.shortName,
  locality: elements.locality,
  hue: elements.hue,
  status: "Now selling",
  handoverYear: null,
  homes: null,
  acres: 20,
  configurations: "2, 3 & 4 BHK apartments · 4 & 5 BHK villas",
  intro: elements.intro,
  image: { src: elements.cover.src, alt: elements.cover.alt, kind: "render" },
  gallery: [elements.cover, ...elements.gallery.slice(0, 4)],
  facts: [
    { label: "Land", value: "20 acres" },
    { label: "Towers", value: "7, up to 29 floors" },
    { label: "Amenities", value: "40+" },
  ],
};

export const portfolio: PortfolioItem[] = [current, ...delivered];
export const deliveredPortfolio = delivered;
export const getPortfolioItem = (slug: string) => portfolio.find((p) => p.slug === slug)!;
