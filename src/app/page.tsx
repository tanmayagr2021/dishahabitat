import { CommunityCard } from "@/components/showroom/Cards";
import { ClosingCta } from "@/components/showroom/ClosingCta";
import { CommunitiesRow } from "@/components/showroom/CommunitiesRow";
import { Hero } from "@/components/showroom/Hero";
import { PromoGrid } from "@/components/showroom/PromoGrid";
import { ProofPanel } from "@/components/showroom/ProofPanel";
import type { Metadata } from "next";
import { communities, heroSlides, rows } from "@/lib/content";
import { pageMeta } from "@/lib/launch";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Disha Habitat | Homes in East Bengaluru",
    description:
      "Pursuit of the Elements, now selling in Gunjur, and 1,102 homes handed over across five Disha Habitat communities in East Bengaluru since 2014.",
    path: "/",
  }),
  title: { absolute: "Disha Habitat | Homes in East Bengaluru" },
};

/*
 * Hero, the communities with their map, the award, two grey cards (story, checklist), one closing step.
 * The amenity carousel is gone: the project page shows the same pictures.
 */
export default function Home() {
  return (
    <>
      <h1 className="sr-only">Disha Habitat: Pursuit of the Elements, and five communities in East Bengaluru</h1>
      <Hero slides={heroSlides} />
      <CommunitiesRow
        title={rows.communities.title}
        line={rows.communities.line}
        items={communities.map(({ slug, name, place }) => ({ slug, name, place }))}
      >
        {communities.map((c) => (
          <CommunityCard key={c.slug} c={c} />
        ))}
      </CommunitiesRow>
      <ProofPanel />
      <PromoGrid />
      <ClosingCta />
    </>
  );
}
