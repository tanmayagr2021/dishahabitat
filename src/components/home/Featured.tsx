import Image from "next/image";
import { ButtonLink, Lines, MediaBadge, Reveal } from "@/components/ui";
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
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_70%,rgb(8_22_15/0.55),transparent_80%)]" />
        <MediaBadge kind="render" className="left-5 top-24 md:left-10" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-48 text-center md:pb-60">
          <p className="flex items-center justify-center gap-3 text-[0.95rem] text-paper/85">
            <span aria-hidden className="h-px w-8 bg-paper/50" />
            Now selling · {elements.locality}
            <span aria-hidden className="h-px w-8 bg-paper/50" />
          </p>
          <Lines
            id="featured-title"
            className="serif mx-auto mt-5 text-[clamp(2.8rem,6.4vw,6.4rem)] leading-[1.02] [text-shadow:0_2px_40px_rgb(0_0_0/0.3)]"
            lines={["Disha Pursuit of", <em key="e">the Elements</em>]}
          />
          <p className="mx-auto mt-4 max-w-xl text-[1.05rem] text-paper/85">
            2, 3 &amp; 4 BHK apartments and 4 &amp; 5 BHK villas on 20 acres
          </p>
        </div>
      </div>

      {/* The verified facts, on a translucent card over the render's lower edge */}
      <div className="shell relative z-10 -mt-36 md:-mt-44">
        <Reveal className="card-dark grid gap-10 p-6 md:p-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem]">
              <span className="font-medium text-brass">{elements.offer}</span>
              <span className="text-paper/55">RERA registered, Phases I & II</span>
            </p>
            <p className="mt-5 text-[1.1rem] leading-relaxed text-paper/85">{elements.intro}</p>
            <p className="serif mt-6 text-[1.6rem] text-paper">
              <em>{elements.tagline}</em>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={elements.href} variant="paper">
                Explore the project
              </ButtonLink>
              <ButtonLink href={`${elements.href}#enquire`} variant="outline-light">
                Book a site visit
              </ButtonLink>
            </div>
          </div>
          <dl className="grid grid-cols-2 content-start gap-px overflow-hidden rounded-xl border border-paper/10 bg-paper/10 lg:col-span-6">
            {elements.facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse bg-forest/80 p-5">
                <dt className="mt-1.5 text-sm text-paper/60">{f.label}</dt>
                <dd className="serif text-[clamp(1.5rem,2.2vw,2rem)] leading-tight">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <p className="mt-4 text-xs leading-relaxed text-paper/50">{elements.rera.map((r) => `${r.phase}: ${r.no}`).join(" · ")}</p>
      </div>

      {/* Three renders, one row, same size */}
      <div className="shell mt-16 md:mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="text-[0.95rem] text-paper/70">Inspired by the five elements — space, fire, air, water and earth.</p>
          <p className="text-sm text-paper/50">Artist’s impressions</p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3 md:gap-6">
          {details.map((m, i) => (
            <Reveal as="figure" key={m.src} variant="mask" delay={i * 100}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={m.src} alt={m.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-sm text-paper/70">{m.caption}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
