import { CommunityCard, LifeCard } from "@/components/showroom/Cards";
import { CardCarousel } from "@/components/showroom/CardCarousel";
import { ClosingCta } from "@/components/showroom/ClosingCta";
import { CommunitiesRow } from "@/components/showroom/CommunitiesRow";
import { Hero } from "@/components/showroom/Hero";
import { PromoGrid } from "@/components/showroom/PromoGrid";
import { ProofPanel } from "@/components/showroom/ProofPanel";
import type { Metadata } from "next";
import { communities, heroSlides, life, rows } from "@/lib/content";
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
 * The homepage follows tesla.com's section by section: hero carousel, a proof panel with a film, a
 * row of large cards (here with the communities map beside them), two grey cards, a second row of
 * cards, then one clear next step.
 */
export default function Home() {
  return (
    <>
      <h1 className="sr-only">Disha Habitat: Pursuit of the Elements, and five communities in East Bengaluru</h1>
      <Hero slides={heroSlides} />
      <ProofPanel />
      <CommunitiesRow
        title={rows.communities.title}
        line={rows.communities.line}
        items={communities.map(({ slug, name, place }) => ({ slug, name, place }))}
      >
        {communities.map((c) => (
          <CommunityCard key={c.slug} c={c} />
        ))}
      </CommunitiesRow>
      <PromoGrid />
      <CardCarousel
        title={rows.life.title}
        line={rows.life.line}
        link={rows.life.link}
        keyboardScroll
        names={life.map((l) => l.name)}
      >
        {life.map((item) => (
          <LifeCard key={item.name} item={item} />
        ))}
      </CardCarousel>
      <ClosingCta />
    </>
  );
}
