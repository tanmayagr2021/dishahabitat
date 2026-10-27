import { elements } from "@/lib/elements";
import { projects } from "@/lib/projects";

export type Community = {
  slug: string;
  name: string;
  locality: string;
  href: string;
  image: { src: string; alt: string; width: number; height: number };
  /* Row label to value. Only real fields are present; a missing key shows as a dash. */
  values: Record<string, string>;
};

const pick = (facts: readonly { label: string; value: string }[], label: string) => facts.find((f) => f.label === label)?.value;

const fromProject = (p: (typeof projects)[number]): Community => ({
  slug: p.slug,
  name: p.shortName,
  locality: p.locality,
  href: `/homes/${p.slug}`,
  image: p.cover,
  values: Object.fromEntries(
    Object.entries({
      Status: "Handed over",
      Location: p.locality,
      Homes: pick(p.facts, "Homes"),
      Land: pick(p.facts, "Project size"),
      "Home types": pick(p.facts, "Home types"),
      Floors: pick(p.facts, "Floors"),
      "Saleable area": pick(p.facts, "Saleable area"),
      "Built-up area": pick(p.facts, "Built-up area"),
      "Signature feature": pick(p.facts, "Signature feature"),
      Started: p.timeline.start,
      "Handed over": p.timeline.handover,
      "Start to finish": `${p.timeline.months} months`,
    }).filter((e): e is [string, string] => Boolean(e[1])),
  ),
});

const ec = (label: string) => pick(elements.facts, label);

const selling: Community = {
  slug: elements.slug,
  name: elements.shortName,
  locality: elements.locality,
  href: elements.href,
  image: elements.cover,
  values: Object.fromEntries(
    Object.entries({
      Status: elements.status,
      Location: elements.locality,
      Land: ec("Land"),
      "Home types": ec("Apartments") && `${ec("Apartments")} apartments`,
      Villas: ec("Villas") && `${ec("Villas")} villas`,
      Towers: "7",
      Floors: "Up to 29",
      Clubhouse: ec("Clubhouse"),
      Amenities: ec("Amenities"),
    }).filter((e): e is [string, string] => Boolean(e[1])),
  ),
};

export const communities: Community[] = [selling, ...[...projects].reverse().map(fromProject)];

/* Row order; a row appears only when a selected community has a value. */
export const rowOrder = [
  "Status",
  "Location",
  "Homes",
  "Home types",
  "Villas",
  "Land",
  "Towers",
  "Floors",
  "Saleable area",
  "Built-up area",
  "Clubhouse",
  "Amenities",
  "Signature feature",
  "Started",
  "Handed over",
  "Start to finish",
];

export const defaults = [elements.slug, "disha-courtyard", "disha-central-park"];
