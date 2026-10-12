import Image from "next/image";
import { ButtonLink, Label, Lines, MediaBadge, Reveal } from "@/components/ui";
import { elements } from "@/lib/elements";

/*
 * The featured project card: the community on sale now, at full bleed. The render fills the
 * screen; an ivory panel of verified facts overlaps its lower edge, and three renders follow
 * as detail crops of different sizes. Every image is an artist's impression and is labelled so.
 */
const details = ["clubhouse", "play-lawn", "amphitheatre"].map(
  (f) => elements.gallery.find((g) => g.src.includes(`/${f}.`))!,
);

export function Featured() {
  return (
    <section data-tone="dark" aria-labelledby="featured-title" className="surface-forest grain overflow-hidden pb-24 md:pb-36">
      {/* Full-bleed render */}
      <div className="parallax relative h-[88svh] min-h-[34rem]">
        <Image src={elements.cover.src} alt={elements.cover.alt} fill sizes="100vw" className="object-cover object-[50%_40%]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest via-forest/25 to-forest-deep/40" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-forest-deep/75 via-forest-deep/25 to-transparent" />
        <MediaBadge kind="render" className="left-5 top-24 md:left-10" />
        <div className="shell absolute inset-x-0 bottom-0 pb-44 md:pb-56">
          <Label n="01" className="text-paper/80">
            Now selling · {elements.locality}
          </Label>
          <Lines
            id="featured-title"
            className="serif mt-5 max-w-[14ch] text-[clamp(3.2rem,8.6vw,9.5rem)] leading-[0.88] tracking-[-0.03em]"
            lines={["Pursuit of", "the Elements"]}
          />
        </div>
      </div>

      <div className="shell relative z-10 -mt-36 grid gap-10 md:-mt-44 lg:grid-cols-12 lg:gap-8">
        {/* The five elements, set as a vertical index */}
        <div className="order-2 lg:order-1 lg:col-span-4 lg:pt-56">
          <p className="serif text-[clamp(1.8rem,2.6vw,2.4rem)] leading-tight text-brass">{elements.tagline}</p>
          <ol className="mt-8 border-t border-paper/15" aria-label="Inspired by the five elements">
            {elements.fiveElements.map((el, i) => (
              <Reveal as="li" key={el} delay={i * 70} className="flex items-baseline justify-between border-b border-paper/15 py-3">
                <span className="serif text-[clamp(1.6rem,2.2vw,2.1rem)] leading-none">{el}</span>
                <span className="label text-cyan">0{i + 1}</span>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* The verified facts, on ivory, overlapping the render */}
        <Reveal className="order-1 bg-paper p-6 text-ink shadow-[0_60px_120px_-60px_rgb(0_0_0/0.8)] md:p-10 lg:order-2 lg:col-span-8 xl:col-span-7 xl:col-start-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="label flex items-center gap-2 text-earth">
              <span className="size-2 bg-earth" />
              {elements.offer}
            </p>
            <p className="label text-mute">RERA registered · Phases I & II</p>
          </div>
          <p className="mt-6 max-w-2xl text-[1.12rem] leading-relaxed text-ink/80">{elements.intro}</p>
          <dl className="mt-8 grid grid-cols-2 border-t border-ink/15 sm:grid-cols-3">
            {elements.facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse border-b border-ink/10 py-5 pr-4">
                <dt className="label mt-2 text-[0.6rem] text-mute">{f.label}</dt>
                <dd className="serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={elements.href}>Explore the project</ButtonLink>
            <ButtonLink href={`${elements.href}#enquire`} variant="outline-dark">
              Book a site visit
            </ButtonLink>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-mute">
            {elements.rera.map((r) => `${r.phase}: ${r.no}`).join(" · ")}
          </p>
        </Reveal>
      </div>

      {/* Detail crops, deliberately unequal */}
      <div className="shell mt-16 grid grid-cols-2 gap-3 md:mt-24 md:grid-cols-12 md:gap-5">
        {details.map((m, i) => (
          <Reveal
            as="figure"
            key={m.src}
            variant="mask"
            delay={i * 120}
            className={
              i === 0
                ? "col-span-2 md:col-span-6"
                : i === 1
                  ? "md:col-span-3 md:mt-24"
                  : "md:col-span-3 md:-mt-10"
            }
          >
            <div className={`relative overflow-hidden ${i === 0 ? "aspect-[16/10]" : "aspect-[3/4]"}`}>
              <Image src={m.src} alt={m.alt} fill sizes="(min-width: 768px) 40vw, 50vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-3 text-sm text-paper/65">
              <span>{m.caption}</span>
              <span className="label text-[0.55rem] text-paper/45">Render</span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
