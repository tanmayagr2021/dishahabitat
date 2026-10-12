import Image from "next/image";
import { Label, Lines, Reveal } from "@/components/ui";

/*
 * Architecture and life, as a photographic essay. Every photograph is of a community Disha
 * Habitat has handed over; captions name where it was taken. Sizes and crops vary on purpose:
 * one full-bleed opening, then layered pairs and tight details.
 */
type Shot = { src: string; alt: string; caption: string; position?: string };

const opening: Shot = {
  src: "/images/courtyard/pool-court.jpg",
  alt: "The pool court at Disha Courtyard, framed by terracotta and white blocks",
  caption: "The pool court, Disha Courtyard",
  position: "50% 60%",
};
const yoga: Shot = {
  src: "/images/courtyard/yoga-lawn.jpg",
  alt: "Residents practising yoga on the lawn at Disha Courtyard as a man walks past",
  caption: "Morning yoga on the lawn, Disha Courtyard",
};
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
const sundial: Shot = {
  src: "/images/pursuit-of-sunshine/sundial.webp",
  alt: "A large stone sundial set into a circular plaza",
  caption: "The Vrihat Samrat Yantra, Disha Pursuit of Sunshine",
};
const garden: Shot = {
  src: "/images/community/gardening.jpg",
  alt: "Children planting seedlings with a resident gardener",
  caption: "Planting day in a Disha community garden",
};

function Shot({
  s,
  className,
  aspect,
  sizes,
  delay = 0,
  parallax = false,
}: {
  s: Shot;
  className: string;
  aspect: string;
  sizes: string;
  delay?: number;
  parallax?: boolean;
}) {
  return (
    <Reveal as="figure" variant="mask" delay={delay} className={className}>
      <div className={`relative overflow-hidden ${aspect} ${parallax ? "parallax" : ""}`}>
        <Image src={s.src} alt={s.alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: s.position }} />
      </div>
      <figcaption className="label mt-3 text-[0.58rem] text-paper/55">{s.caption}</figcaption>
    </Reveal>
  );
}

export function LifeEssay() {
  return (
    <section data-tone="dark" aria-labelledby="life-title" className="surface-charcoal grain overflow-hidden pb-24 md:pb-36">
      {/* Opening: full bleed, the title set into the photograph's quiet lower band. */}
      <div className="parallax relative h-[92svh] min-h-[32rem]">
        <Image src={opening.src} alt={opening.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: opening.position }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/30" />
        <div className="shell absolute inset-x-0 bottom-0 pb-12 md:pb-16">
          <Label n="05" className="text-paper/80">
            Life inside
          </Label>
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
            <Lines
              id="life-title"
              className="serif text-[clamp(3rem,7.4vw,8rem)] leading-[0.9] tracking-[-0.03em] lg:col-span-8"
              lines={["Life, between", <em key="e">the buildings.</em>]}
            />
            <p className="max-w-sm text-[1.05rem] leading-relaxed text-paper/80 lg:col-span-4">
              Lawns, pools, a sundial, a kitchen garden. The shared spaces are where neighbours become a community. Every
              photograph here was taken in a community we have handed over.
            </p>
          </div>
          <p className="label mt-8 text-[0.58rem] text-paper/55">{opening.caption}</p>
        </div>
      </div>

      <div className="shell mt-16 grid grid-cols-6 gap-3 md:mt-28 md:grid-cols-12 md:gap-6">
        <Shot s={yoga} className="col-span-6 md:col-span-7" aspect="aspect-[16/10]" sizes="(min-width: 768px) 58vw, 100vw" parallax />
        <Shot s={chess} className="col-span-4 col-start-3 -mt-10 md:col-span-4 md:col-start-9 md:mt-40" aspect="aspect-[4/5]" sizes="(min-width: 768px) 32vw, 66vw" delay={150} />

        <Reveal className="col-span-6 py-10 md:col-span-5 md:col-start-2 md:py-24">
          <p className="serif text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[1.05]">
            “Home is where your daily journey starts… it’s not just a place but a source of love, affection and feeling.”
          </p>
          <p className="label mt-5 text-paper/55">Prasanta &amp; Lipsita · Residents, Disha Courtyard</p>
        </Reveal>
        <Shot s={stair} className="col-span-3 md:col-span-3 md:col-start-8 md:mt-12" aspect="aspect-[3/4]" sizes="(min-width: 768px) 24vw, 50vw" />
        <Shot s={sundial} className="col-span-3 mt-16 md:col-span-2 md:mt-40" aspect="aspect-square" sizes="(min-width: 768px) 16vw, 50vw" delay={120} />

        <Shot s={living} className="col-span-6 md:col-span-6 md:col-start-1 md:mt-10" aspect="aspect-[16/10]" sizes="(min-width: 768px) 50vw, 100vw" />
        <Shot s={garden} className="col-span-6 md:col-span-5 md:col-start-8 md:mt-36" aspect="aspect-[4/3]" sizes="(min-width: 768px) 42vw, 100vw" delay={150} parallax />
      </div>
    </section>
  );
}
