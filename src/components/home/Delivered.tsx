import { ArrowLink, Label, Lines } from "@/components/ui";
import { CompactProjectCard, EditorialProjectCard, InteractiveProjectCard } from "@/components/ProjectCards";
import { getPortfolioItem } from "@/lib/portfolio";

/*
 * The delivered communities, with hierarchy instead of a grid: the newest at large scale, an
 * offset tall card beside it, one editorial spread, and the two smallest as compact rows.
 */
export function Delivered() {
  const sunshine = getPortfolioItem("disha-pursuit-of-sunshine");
  const courtyard = getPortfolioItem("disha-courtyard");
  const centralPark = getPortfolioItem("disha-central-park");
  const parkWest = getPortfolioItem("disha-park-west");
  const windsor = getPortfolioItem("disha-windsor-gardens");

  return (
    <section data-tone="light" aria-labelledby="delivered-title" className="surface-ivory py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label n="04" className="text-mute">
              Delivered
            </Label>
            <Lines
              id="delivered-title"
              className="serif mt-8 text-[clamp(2.8rem,6vw,6.4rem)] leading-[0.92] tracking-[-0.025em]"
              lines={["Five communities,", <em key="e">handed over.</em>]}
            />
          </div>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-ink/70 lg:col-span-4 lg:col-start-9">
            Each one photographed as it stands today. Select a community for its timeline, its photographs and the words of
            the families who live there.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:mt-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <InteractiveProjectCard p={sunshine} morph />
          </div>
          <div className="lg:col-span-4 lg:mt-32">
            <InteractiveProjectCard p={courtyard} aspect="aspect-[3/4]" sizes="(min-width: 1024px) 30vw, 100vw" morph delay={150} />
          </div>
        </div>

        <div className="mt-20 md:mt-32">
          <EditorialProjectCard p={centralPark} index="03" />
        </div>

        <div className="mt-20 border-t border-ink/15 pt-6 md:mt-28">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="label text-mute">Where it started</p>
            <ArrowLink href="/homes" className="text-ink">
              All our homes, side by side
            </ArrowLink>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-2 md:gap-6">
            <CompactProjectCard p={parkWest} />
            <CompactProjectCard p={windsor} />
          </div>
        </div>
      </div>
    </section>
  );
}
