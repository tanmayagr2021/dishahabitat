import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Plus } from "lucide-react";
import { GalleryGrid } from "@/components/Lightbox";
import { EnquirySection } from "@/components/home/EnquirySection";
import { Eyebrow, MediaBadge, Reveal } from "@/components/ui";
import { getProject, projects } from "@/lib/projects";
import { homeowners } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/homes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name}, ${p.locality}. ${p.intro}`,
    openGraph: { images: [{ url: p.cover.src, width: p.cover.width, height: p.cover.height, alt: p.cover.alt }] },
  };
}

const galleryTiles = [
  "col-span-2 aspect-[16/10] md:col-span-8 md:aspect-[16/10]",
  "aspect-[4/5] md:col-span-4 md:aspect-auto",
  "aspect-[4/5] md:col-span-4 md:aspect-[4/5]",
  "col-span-2 aspect-[16/10] md:col-span-8 md:aspect-auto",
  "aspect-square md:col-span-6 md:aspect-[16/10]",
  "aspect-square md:col-span-6 md:aspect-[16/10]",
  "col-span-2 aspect-[16/10] md:col-span-4 md:aspect-[4/5]",
  "col-span-2 aspect-[16/10] md:col-span-4 md:aspect-[4/5]",
  "col-span-2 aspect-[16/10] md:col-span-4 md:aspect-[4/5]",
];

const wide = "col-span-2 aspect-[16/10] md:col-span-12 md:aspect-[21/9]";

/* Tile spans per image count, so every row closes cleanly. */
function tilesFor(count: number) {
  if (count === 1) return [wide];
  if (count === 3) return [galleryTiles[0], galleryTiles[1], wide];
  return galleryTiles;
}

export default async function ProjectPage(props: PageProps<"/homes/[slug]">) {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const words = homeowners.filter((h) => h.slug === p.slug);
  const mapQuery = encodeURIComponent(p.address ?? `${p.name}, ${p.locality}`);

  return (
    <>
      {/* Opening */}
      <section className="pt-28 md:pt-36">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="hero-rise text-xs text-ink-mute">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/homes" className="inline-flex min-h-10 items-center hover:text-ink">
                  Our homes
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink-soft">
                {p.name}
              </li>
            </ol>
          </nav>

          <div className="mt-4 grid gap-8 lg:grid-cols-12 lg:items-end">
            <h1
              className="display hero-rise text-[3.2rem] min-[400px]:text-[3.7rem] sm:text-[5.2rem] lg:col-span-8 xl:text-[7rem]"
              style={{ "--d": "100ms" } as CSSProperties}
            >
              {p.name.replace(/^Disha /, "")}
              <span className="mt-2 block text-[0.32em] italic leading-tight text-olive">by Disha Habitat</span>
            </h1>
            <div className="hero-rise lg:col-span-4 lg:pb-4" style={{ "--d": "220ms" } as CSSProperties}>
              <p className="flex items-center gap-2 text-sm text-ink-soft">
                <MapPin aria-hidden className="size-4 text-olive" strokeWidth={1.5} />
                {p.locality}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-ink-mute">
                Community {p.index} of 05 · Handover {p.timeline.handover}
              </p>
            </div>
          </div>
        </div>

        <div className="shell mt-10 md:mt-14">
          <figure className="hero-unveil" style={{ "--d": "200ms" } as CSSProperties}>
            <div className="relative aspect-[4/5] overflow-hidden bg-linen sm:aspect-[16/9] lg:aspect-[21/9]">
              <MediaBadge kind={p.cover.kind} />
              <Image src={p.cover.src} alt={p.cover.alt} fill priority sizes="100vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-xs text-ink-mute">{p.cover.caption}</figcaption>
          </figure>
        </div>
      </section>

      {/* Overview + facts */}
      <section aria-labelledby="overview-title" className="py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6">
            <Eyebrow className="text-ink-mute">About the community</Eyebrow>
            <h2 id="overview-title" className="sr-only">
              About {p.name}
            </h2>
            <p className="display mt-8 text-[1.9rem] leading-[1.15] text-ink sm:text-[2.4rem]">{p.intro}</p>
            {p.website && (
              <a
                href={p.website.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                Official project site: {p.website.label}
                <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5 lg:col-start-8">
            <dl className="grid grid-cols-2 border-t border-ink/15">
              {p.facts.map((f) => (
                <div key={f.label} className="border-b border-ink/15 py-5 pr-4">
                  <dt className="text-[0.66rem] uppercase tracking-[0.16em] text-ink-mute">{f.label}</dt>
                  <dd className="display mt-1.5 text-[1.6rem] leading-tight text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>

            <h3 className="eyebrow mt-12 text-ink-mute">Timeline</h3>
            <ol className="mt-5 grid grid-cols-3 gap-4 border-t border-ink/15 pt-5 text-sm">
              {[
                ["Start", p.timeline.start],
                ["Completion (OC)", p.timeline.completion],
                ["Handover", p.timeline.handover],
              ].map(([k, v]) => (
                <li key={k}>
                  <span className="block text-[0.66rem] uppercase tracking-[0.14em] text-ink-mute">{k}</span>
                  <span className="mt-1 block font-medium text-ink">{v}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-ink-mute">
              {p.timeline.months} months from start to finish, as published by Disha Habitat.
            </p>

            <div className="mt-12 border-t border-ink/15 pt-6">
              <h3 className="eyebrow text-ink-mute">Location</h3>
              {p.address ? (
                <address className="mt-3 not-italic leading-relaxed text-ink-soft">{p.address}</address>
              ) : (
                <p className="mt-3 text-ink-soft">{p.locality}</p>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                Search on Google Maps <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      {p.gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="bg-paper py-20 md:py-28">
          <div className="shell">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="gallery-title" className="display text-[2.6rem] sm:text-[3.4rem]">
                Gallery
              </h2>
              <p className="text-sm text-ink-mute">
                {p.gallery.length} {p.gallery.length === 1 ? "image" : "images"} · select to enlarge
              </p>
            </Reveal>
            <div className="mt-10">
              <GalleryGrid
                items={p.gallery}
                tileClasses={tilesFor(p.gallery.length)}
                gridClassName="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4"
                sizes="(min-width: 768px) 60vw, 100vw"
              />
            </div>
          </div>
        </section>
      )}

      {/* Signature spaces (Pursuit of Sunshine) */}
      {p.highlights && (
        <section aria-labelledby="highlights-title" className="py-20 md:py-28">
          <div className="shell">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <Reveal className="lg:col-span-7">
                <Eyebrow className="text-ink-mute">Signature spaces</Eyebrow>
                <h2 id="highlights-title" className="display mt-6 text-[2.6rem] sm:text-[3.6rem] xl:text-[4.2rem]">
                  An ode to the <em className="text-sun">Sun</em>.
                </h2>
              </Reveal>
              <Reveal delay={100} className="lg:col-span-4 lg:col-start-9">
                <p className="leading-relaxed text-ink-soft">
                  From your own sundeck at home or any of the outdoor arenas — every step here is a step closer to the
                  Sun’s bounty.
                </p>
              </Reveal>
            </div>
            <ul className="mt-14 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {p.highlights.map((h, n) => (
                <Reveal as="li" key={h.name} delay={(n % 3) * 80} className="border-t border-ink/15 py-7">
                  <h3 className="display text-[1.8rem] leading-tight text-ink">{h.name}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{h.text}</p>
                </Reveal>
              ))}
            </ul>

            {p.otherAmenities && (
              <Reveal className="mt-14 border-t border-ink/15 pt-8">
                <h3 className="eyebrow text-ink-mute">Also in the community</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.otherAmenities.map((a) => (
                    <li key={a} className="border border-ink/15 px-3.5 py-2 text-sm text-ink-soft">
                      {a}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Specifications */}
      {p.specifications && (
        <section aria-labelledby="specs-title" className="bg-linen py-20 md:py-28">
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-4">
              <h2 id="specs-title" className="display text-[2.6rem] sm:text-[3.4rem]">
                Specifications
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-mute">
                Selected items from the published project specification.
                {p.rera && (
                  <>
                    <br />
                    <br />
                    RERA No. {p.rera}
                  </>
                )}
              </p>
            </Reveal>
            <div className="lg:col-span-7 lg:col-start-6">
              {p.specifications.map((s, n) => (
                <details key={s.group} className="group border-t border-ink/20 last:border-b" open={n === 0}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
                    {s.group}
                    <Plus
                      aria-hidden
                      className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
                      strokeWidth={1.5}
                    />
                  </summary>
                  <ul className="space-y-2 pb-6 text-ink-soft">
                    {s.items.map((item) => (
                      <li key={item} className="flex gap-3 leading-relaxed">
                        <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-ink/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
              {p.salesPhone && (
                <p className="mt-8 text-sm text-ink-soft">
                  Project enquiries:{" "}
                  <a href={p.salesPhone.href} className="font-medium text-ink underline underline-offset-4">
                    {p.salesPhone.display}
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Homeowner words */}
      {words.length > 0 && (
        <section aria-labelledby="words-title" className="py-20 md:py-28">
          <div className="shell">
            <h2 id="words-title" className="eyebrow text-ink-mute">
              From homeowners at {p.name}
            </h2>
            <div className="mt-8 grid gap-12 md:grid-cols-2">
              {words.map((w) => (
                <Reveal as="figure" key={w.name} className="border-t border-ink/15 pt-8">
                  <blockquote className="display text-[1.9rem] leading-[1.15] text-ink sm:text-[2.3rem]">
                    “{w.quote}”
                  </blockquote>
                  <figcaption className="mt-6 text-sm text-ink-mute">
                    <span className="font-semibold text-ink">{w.name}</span> · Native of {w.native}
                  </figcaption>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <EnquirySection defaultInterest={p.name} />

      {/* Prev / next */}
      <nav aria-label="More communities" className="border-t border-rule bg-ivory">
        <div className="shell grid sm:grid-cols-2">
          <Link href={`/homes/${prev.slug}`} className="group flex min-h-28 items-center gap-5 border-b border-rule py-8 sm:border-b-0 sm:border-r sm:pr-8">
            <ArrowLeft aria-hidden className="size-5 shrink-0 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
            <span>
              <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-ink-mute">Previous</span>
              <span className="display mt-1 block text-[1.8rem] leading-tight">{prev.name}</span>
            </span>
          </Link>
          <Link href={`/homes/${next.slug}`} className="group flex min-h-28 items-center justify-end gap-5 py-8 text-right sm:pl-8">
            <span>
              <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-ink-mute">Next</span>
              <span className="display mt-1 block text-[1.8rem] leading-tight">{next.name}</span>
            </span>
            <ArrowRight aria-hidden className="size-5 shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </div>
      </nav>
    </>
  );
}
