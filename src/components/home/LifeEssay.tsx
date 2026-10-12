import Image from "next/image";
import { Label, Lines, Reveal } from "@/components/ui";

/*
 * Architecture and life, as a photographic essay. Every photograph is of a community Disha
 * Habitat has handed over; captions name where it was taken. Sizes and crops vary on purpose:
 * one full-bleed opening, then layered pairs and tight details.
 */
type Shot = { src: string; alt: string; caption: string; position?: string };

const chess: Shot = {
  src: "/images/courtyard/giant-chess.jpg",
  alt: "A young boy standing among giant chess pieces",
  caption: "The giant chessboard, Disha Courtyard",
  position: "55% 50%",
};
const stair: Shot = {
  src: "/images/central-park/staircase.jpg",
  alt: "An open white staircase rising beside a reflecting pool",
  caption: "Stair and water, Disha Central Park",
  position: "32% 50%",
};
const living: Shot = {
  src: "/images/central-park/living-room.jpg",
  alt: "A warmly lit living room with a leather sofa and wall art",
  caption: "A home at Disha Central Park",
};
const garden: Shot = {
  src: "/images/community/gardening.jpg",
  alt: "Children planting seedlings with a resident gardener",
  caption: "Planting day in a Disha community garden",
};

function Shot({ s, aspect, sizes, delay = 0 }: { s: Shot; aspect: string; sizes: string; delay?: number }) {
  return (
    <Reveal as="figure" variant="mask" delay={delay}>
      <div className={`relative overflow-hidden rounded-xl ${aspect}`}>
        <Image src={s.src} alt={s.alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: s.position }} />
      </div>
      <figcaption className="mt-3 text-sm text-paper/65">{s.caption}</figcaption>
    </Reveal>
  );
}

const play: Shot = {
  src: "/images/windsor-gardens/play-area.jpg",
  alt: "The children’s play area at Disha Windsor Gardens",
  caption: "The play area, Disha Windsor Gardens",
};

export function LifeEssay() {
  return (
    <section data-tone="dark" aria-labelledby="life-title" className="surface-charcoal grain py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label className="text-paper/60">Life inside</Label>
            <Lines
              id="life-title"
              className="serif mt-5 text-[clamp(2.3rem,4.4vw,4.4rem)] leading-[1.02]"
              lines={["Life, between", <em key="e">the buildings.</em>]}
            />
          </div>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-paper/75 lg:col-span-4 lg:col-start-9">
            Lawns, stairs, a chessboard, a kitchen garden. Every photograph here was taken in a community we have handed over.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3 md:gap-6">
          <Shot s={chess} aspect="aspect-[4/5]" sizes="(min-width: 640px) 33vw, 100vw" />
          <Shot s={stair} aspect="aspect-[4/5]" sizes="(min-width: 640px) 33vw, 100vw" delay={100} />
          <Shot s={garden} aspect="aspect-[4/5]" sizes="(min-width: 640px) 33vw, 100vw" delay={200} />
        </div>

        <Reveal className="mx-auto max-w-3xl py-16 text-center md:py-24">
          <p className="serif text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.15]">
            “Home is where your daily journey starts… it’s not just a place but a source of love, affection and feeling.”
          </p>
          <p className="mt-5 text-sm text-paper/60">Prasanta &amp; Lipsita · Residents, Disha Courtyard</p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 md:gap-6">
          <Shot s={living} aspect="aspect-[3/2]" sizes="(min-width: 640px) 50vw, 100vw" />
          <Shot s={play} aspect="aspect-[3/2]" sizes="(min-width: 640px) 50vw, 100vw" delay={100} />
        </div>
      </div>
    </section>
  );
}
