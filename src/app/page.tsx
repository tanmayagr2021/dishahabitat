import type { Metadata } from "next";
import { ClosingCta } from "@/components/showroom/ClosingCta";
import { Hero } from "@/components/showroom/Hero";
import { MapSection } from "@/components/showroom/MapSection";
import { PhotoPanel } from "@/components/showroom/PhotoPanel";
import { PromoGrid } from "@/components/showroom/PromoGrid";
import { ProofPanel } from "@/components/showroom/ProofPanel";
import { communities, communityHref, heroSlides, links, rows, story } from "@/lib/content";
import { pageMeta } from "@/lib/launch";
import s from "./page.module.css";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Disha Habitat | Homes in East Bengaluru",
    description:
      "Pursuit of the Elements, now selling in Gunjur, and 1,102 homes handed over across five Disha Habitat communities in East Bengaluru since 2014.",
    path: "/",
  }),
  title: { absolute: "Disha Habitat | Homes in East Bengaluru" },
};

/* The communities already handed over, newest first. The one on sale is the hero's. */
const handedOver = communities.filter((c) => c.eyebrow.startsWith("Handed over"));

/*
 * As tesla.com's home page: one full-screen picture after another, each with its title and its two
 * buttons, then two half-width tiles, then the map and the closing step. The hero keeps its three
 * slides (the sale, the record, the villas) so the page does not spend three screens before the first community.
 */
export default function Home() {
  return (
    <div className={s.page}>
      <h1 className="sr-only">Disha Habitat: Pursuit of the Elements, and five communities in East Bengaluru</h1>
      <Hero slides={heroSlides} />
      {handedOver.map((c, i) => (
        <PhotoPanel
          key={c.slug}
          id={i === 0 ? "handed-over" : c.slug}
          morph={`community-${c.slug}`}
          image={c.image}
          eyebrow={c.eyebrow}
          title={c.name}
          line={`${c.place} · ${c.line}`}
          about={c.name}
          ctas={[{ label: "Explore", href: communityHref(c.slug) }, { label: "Book a visit", href: links.bookVisit }]}
        />
      ))}
      <PhotoPanel id="story" image={story.image} eyebrow={story.eyebrow} title={story.title} line={story.line} ctas={story.ctas} />
      <PromoGrid />
      <MapSection
        title={rows.communities.title}
        line={rows.communities.line}
        items={communities.map(({ slug, name, place, eyebrow }) => ({ slug, name, place, eyebrow }))}
      />
      <ProofPanel />
      <ClosingCta />
    </div>
  );
}
