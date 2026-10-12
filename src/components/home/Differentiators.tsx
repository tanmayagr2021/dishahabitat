import Image from "next/image";
import { Eyebrow, Reveal } from "@/components/ui";

/* Each point paraphrases something Disha Habitat publishes about itself (see docs/CONTENT-SOURCES.md). */
const points = [
  {
    title: "Built by former homebuyers",
    text: "We started out as prospective homebuyers ourselves. We know what a huge deal it is to invest yourself in a home of your own, and we build with that in mind.",
  },
  {
    title: "Promises inked in black",
    text: "No coloured cover-ups. What we commit to is written plainly, and our approach is clear white.",
  },
  {
    title: "Mindfully priced",
    text: "Our homes are mindful living spaces that are priced mindfully too.",
  },
  {
    title: "Built to a clear timeline",
    text: "Windsor Gardens went from start to completion in 23 months, and Pursuit of Sunshine in 26 — both by the dates recorded on their occupancy certificates.",
  },
  {
    title: "A gardener’s eye",
    text: "Our founder Guna is a practising horticulturist, and you will find that passion in the greens of every Disha Habitat community.",
  },
  {
    title: "Always a conversation away",
    text: "“Let’s meet for coffee.” Our founders sit down with homeowners and explain decisions plainly, until the details are as clear to you as they are to our engineers.",
  },
];

export function Differentiators() {
  return (
    <section aria-labelledby="why-title" className="bg-paper py-24 md:py-32 lg:py-40">
      <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow className="text-ink-mute">The Disha difference</Eyebrow>
            <h2 id="why-title" className="display mt-6 text-[2.9rem] sm:text-[3.6rem] xl:text-[4.2rem]">
              Mindfulness, <br />
              <em className="text-olive">down to the brick.</em>
            </h2>
          </Reveal>
          <Reveal delay={150} as="figure" className="mt-12 hidden lg:block">
            <div className="relative aspect-[4/5] w-[85%] overflow-hidden">
              <Image
                src="/images/courtyard/facade.jpg"
                alt="Looking up at a Disha Courtyard block with terracotta panels and white lattice screens"
                fill
                sizes="35vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-ink-mute">Terracotta and lattice, Disha Courtyard</figcaption>
          </Reveal>
        </div>

        <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {points.map((p, i) => (
            <Reveal as="li" key={p.title} delay={(i % 2) * 100} className="border-t border-ink/15 py-8 md:py-10">
              <span className="display text-[2.4rem] leading-none text-sun">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
