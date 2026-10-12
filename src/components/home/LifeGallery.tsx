import { GalleryGrid, type GalleryItem } from "@/components/Lightbox";
import { Eyebrow, Reveal } from "@/components/ui";
import { getProject } from "@/lib/projects";

function pick(slug: string, src: string): GalleryItem {
  const p = getProject(slug)!;
  const media = [p.cover, ...p.gallery].find((m) => m.src === src)!;
  return { ...media, project: p.name };
}

const items: GalleryItem[] = [
  pick("disha-pursuit-of-sunshine", "/images/pursuit-of-sunshine/pool-aerial.webp"),
  pick("disha-courtyard", "/images/courtyard/giant-chess.jpg"),
  pick("disha-central-park", "/images/central-park/clubhouse-night.jpg"),
  pick("disha-pursuit-of-sunshine", "/images/pursuit-of-sunshine/sundial.webp"),
  {
    src: "/images/community/independence-day.jpg",
    width: 780,
    height: 576,
    alt: "Children gathered with the Indian flag and balloons at a community celebration",
    caption: "Independence Day, together",
    kind: "photo",
    project: "Disha Habitat community",
  },
  pick("disha-courtyard", "/images/courtyard/yoga-lawn.jpg"),
  pick("disha-pursuit-of-sunshine", "/images/pursuit-of-sunshine/treehouse.webp"),
  pick("disha-central-park", "/images/central-park/staircase.jpg"),
];

/* Bento composition: varied spans give the grid an editorial rhythm. */
const tiles = [
  "col-span-2 aspect-[16/10] md:col-span-7 md:row-span-2 md:aspect-auto",
  "aspect-[4/5] md:col-span-5 md:aspect-[16/11]",
  "aspect-[4/5] md:col-span-5 md:aspect-[16/11]",
  "col-span-2 aspect-[16/10] md:col-span-4 md:aspect-[4/5]",
  "aspect-square md:col-span-4 md:aspect-[4/5]",
  "aspect-square md:col-span-4 md:aspect-[4/5]",
  "col-span-2 aspect-[16/10] md:col-span-6 md:aspect-[16/10]",
  "col-span-2 aspect-[16/10] md:col-span-6 md:aspect-[16/10]",
];

export function LifeGallery() {
  return (
    <section aria-labelledby="life-title" className="py-24 md:py-32 lg:py-40">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6">
            <Eyebrow className="text-ink-mute">Life at Disha</Eyebrow>
            <h2 id="life-title" className="display mt-6 text-[2.9rem] sm:text-[3.8rem] xl:text-[4.8rem]">
              Where every nook rings with <em className="text-olive">happy voices</em>.
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <p className="leading-relaxed text-ink-soft">
              Real moments, photographed in our communities — pools and lawns, sundials and treehouses, and the
              neighbours who make them home. Select any image to see it larger.
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
