import { GalleryGrid, type GalleryItem } from "@/components/Lightbox";
import { Reveal, SectionMark } from "@/components/ui";
import { getProject } from "@/lib/projects";

function pick(slug: string, src: string): GalleryItem {
  const p = getProject(slug)!;
  const media = [p.cover, ...p.gallery].find((m) => m.src === src)!;
  return { ...media, project: p.name };
}

/* Photographs not used elsewhere on the homepage, so the gallery adds rather than repeats. */
const items: GalleryItem[] = [
  pick("disha-pursuit-of-sunshine", "/images/pursuit-of-sunshine/pool-aerial.webp"),
  pick("disha-pursuit-of-sunshine", "/images/pursuit-of-sunshine/treehouse.webp"),
  pick("disha-pursuit-of-sunshine", "/images/pursuit-of-sunshine/cafe.webp"),
  pick("disha-pursuit-of-sunshine", "/images/pursuit-of-sunshine/entrance-aerial.webp"),
  pick("disha-pursuit-of-sunshine", "/images/pursuit-of-sunshine/games-room.webp"),
  pick("disha-pursuit-of-sunshine", "/images/pursuit-of-sunshine/render-surya-stambh.jpg"),
];

/* Bento composition: one dominant frame, then a steady three-up rhythm. */
const tiles = [
  "col-span-2 aspect-[16/11] md:col-span-7 md:row-span-2 md:aspect-auto",
  "aspect-[4/5] md:col-span-5 md:aspect-[16/11]",
  "aspect-[4/5] md:col-span-5 md:aspect-[16/11]",
  "col-span-2 aspect-[16/10] md:col-span-4 md:aspect-[4/5]",
  "aspect-square md:col-span-4 md:aspect-[4/5]",
  "aspect-square md:col-span-4 md:aspect-[4/5]",
];

export function LifeGallery() {
  return (
    <section aria-labelledby="life-title" className="bg-ivory py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionMark n="08" label="Life at Disha" />
            <h2 id="life-title" className="display mt-8 text-[2.6rem] text-ink sm:text-[3.8rem] xl:text-[5rem]">
              Where every nook rings with <em className="text-brass-deep">happy voices.</em>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <p className="leading-relaxed text-ink-soft">
              Moments from Disha Pursuit of Sunshine — the pool, the treehouse, the café and the games room. Select any
              image to see it larger. Renders are marked as artist’s impressions.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 md:mt-20">
          <GalleryGrid
            items={items}
            tileClasses={tiles}
            gridClassName="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
