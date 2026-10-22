import { CardCarousel } from "@/components/CardCarousel";
import { CommunityCard, LifeCard } from "@/components/Cards";
import { ClosingCta } from "@/components/ClosingCta";
import { CommunitiesRow } from "@/components/CommunitiesRow";
import { Hero } from "@/components/Hero";
import { PromoGrid } from "@/components/PromoGrid";
import { ProofPanel } from "@/components/ProofPanel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { communities, heroSlides, life, rows } from "@/lib/content";

/*
 * The page follows tesla.com's homepage section by section: hero carousel, a proof panel with a film,
 * a row of large cards (here with the communities map beside them), two grey cards, a second row of cards, then one clear next step, footnotes and
 * one line of links.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
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
      </main>
      <SiteFooter />
    </>
  );
}
