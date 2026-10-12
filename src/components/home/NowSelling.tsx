import Image from "next/image";
import { Phone } from "lucide-react";
import { ButtonLink, Label, MediaBadge, Reveal } from "@/components/ui";
import { elements } from "@/lib/elements";

/* The project on sale now, introduced plainly: what, where, how big, and how to ask. */
export function NowSelling() {
  const strip = elements.gallery.slice(0, 3);
  return (
    <section data-tone="light" aria-labelledby="now-title" className="bg-paper py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <Label n="01" className="text-mute">
              Now selling in Gunjur
            </Label>
            <h2 id="now-title" className="serif mt-5 text-[clamp(2.6rem,5.4vw,5.2rem)]">
              {elements.shortName}. <em className="text-mute">{elements.tagline}</em>
            </h2>
          </div>
          <ul className="flex flex-wrap gap-2 lg:col-span-4 lg:justify-end" aria-label="Inspired by the five elements">
            {elements.fiveElements.map((e) => (
              <li key={e} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-sm">
                {e}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal variant="bloom" className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-paper-3 lg:col-span-7 lg:aspect-auto">
            <Image
              src={elements.cover.src}
              alt={elements.cover.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <MediaBadge kind="render" />
          </Reveal>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <p className="text-[1.1rem] leading-relaxed text-ink/80">{elements.intro}</p>
            <dl className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
              {elements.facts.map((f) => (
                <div key={f.label} className="border-t border-ink/15 py-4">
                  <dt className="label text-mute">{f.label}</dt>
                  <dd className="serif mt-1.5 text-[1.5rem] leading-tight">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={elements.href}>Explore the project</ButtonLink>
              <a
                href={elements.phone.href}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-ink/20 px-6 text-[0.95rem] font-medium hover:bg-ink hover:text-paper"
              >
                <Phone aria-hidden className="size-4" strokeWidth={1.6} />
                {elements.phone.display}
              </a>
            </div>
            <p className="text-xs leading-relaxed text-mute">
              {elements.offer}, as announced by Disha Habitat. RERA:{" "}
              {elements.rera.map((r) => `${r.phase} ${r.no}`).join(" · ")}
            </p>
          </div>
        </div>

        <ul className="mt-3 grid grid-cols-3 gap-3">
          {strip.map((m, i) => (
            <Reveal as="li" key={m.src} delay={i * 80}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-paper-3">
                  <Image src={m.src} alt={m.alt} fill sizes="33vw" className="object-cover" />
                </div>
                <figcaption className="mt-2 text-sm text-mute">{m.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
        <p className="mt-4 text-xs text-mute">All images of Pursuit of the Elements are artist’s impressions.</p>
      </div>
    </section>
  );
}
