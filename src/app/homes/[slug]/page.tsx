import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Plus } from "lucide-react";
import { GalleryGrid } from "@/components/Lightbox";
import { PageHero } from "@/components/PageHero";
import { EnquirySection } from "@/components/home/EnquirySection";
import { Reveal, SectionMark } from "@/components/ui";
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
  const timeline = [
    ["Construction start", p.timeline.start],
    ["Completion (as per OC)", p.timeline.completion],
    ["Handover", p.timeline.handover],
  ];

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Link href="/homes" className="hover:text-ivory">
              Our homes
            </Link>{" "}
            / Community {p.index}
          </>
        }
        title={
          <>
            {p.name.replace(/^Disha /, "")}
            <span className="mt-3 block text-[0.3em] italic leading-tight text-brass-light">by Disha Habitat</span>
          </>
        }
        intro={
          <p className="flex items-center gap-2">
            <MapPin aria-hidden className="size-4 text-brass-light" strokeWidth={1.5} />
            {p.locality}
          </p>
        }
        image={p.cover}
      />

      {/* Facts band */}
      <section data-tone="dark" aria-label="Key facts" className="topo bg-ink text-ivory [--topo-opacity:0.14]">
        <div className="shell">
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {p.facts.slice(0, 4).map((f, n) => (
              <Reveal
                key={f.label}
                delay={n * 80}
                className="border-b border-ivory/12 py-8 pr-4 md:border-b-0 md:border-l md:py-12 md:pl-6 md:first:border-l-0 md:first:pl-0"
              >
                <dt className="eyebrow text-ivory/50">{f.label}</dt>
                <dd className="display mt-3 text-[2.1rem] leading-none text-ivory sm:text-[2.8rem]">{f.value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Overview */}
      <section aria-labelledby="overview-title" className="bg-ivory py-20 md:py-32">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <SectionMark n="01" label="About the community" />
            <h2 id="overview-title" className="sr-only">
              About {p.name}
            </h2>
            <p className="display mt-8 text-[2.1rem] leading-[1.1] text-ink sm:text-[2.8rem] xl:text-[3.3rem]">{p.intro}</p>
            {p.facts.length > 4 && (
              <dl className="mt-10 grid gap-x-8 sm:grid-cols-3">
                {p.facts.slice(4).map((f) => (
                  <div key={f.label} className="border-t border-ink/15 py-4">
                    <dt className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-ink-mute">{f.label}</dt>
                    <dd className="mt-1 font-medium text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
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

          <Reveal delay={150} className="lg:col-span-4 lg:col-start-9">
            <h3 className="eyebrow text-ink-mute">Timeline</h3>
            <ol className="relative mt-6 space-y-7 border-l border-ink/20 pl-6">
              {timeline.map(([k, v]) => (
                <li key={k} className="relative">
                  <span aria-hidden className="absolute -left-[29px] top-1.5 size-[9px] rounded-full bg-brass-deep" />
                  <span className="block text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-ink-mute">{k}</span>
                  <span className="display mt-1 block text-[1.6rem] leading-tight text-ink">{v}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-ink-mute">
              {p.timeline.months} months from start to finish, as published by Disha Habitat.
            </p>

            <div className="mt-12 border-t border-ink/15 pt-6">
              <h3 className="eyebrow text-ink-mute">Location</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{p.address ?? p.locality}</p>
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
        <section aria-labelledby="gallery-title" className="bg-stone py-20 md:py-28">
          <div className="shell">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionMark n="02" label="Gallery" />
                <h2 id="gallery-title" className="display mt-6 text-[2.8rem] sm:text-[3.8rem]">
                  Inside <em className="text-brass-deep">{p.shortName}</em>
                </h2>
              </div>
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
        <section
          data-tone="dark"
          aria-labelledby="highlights-title"
          className="topo bg-forest-900 py-20 text-ivory [--topo-opacity:0.2] md:py-32"
        >
          <div className="shell">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <Reveal className="lg:col-span-7">
                <SectionMark n="03" label="Signature spaces" tone="dark" />
                <h2 id="highlights-title" className="display mt-6 text-[2.8rem] sm:text-[4rem] xl:text-[5rem]">
                  An ode to the <em className="text-brass-light">Sun.</em>
                </h2>
              </Reveal>
              <Reveal delay={100} className="lg:col-span-4 lg:col-start-9">
                <p className="leading-relaxed text-ivory/70">
                  From your own sundeck at home or any of the outdoor arenas — every step here is a step closer to the
                  Sun’s bounty.
                </p>
              </Reveal>
            </div>
            <ul className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {p.highlights.map((h, n) => (
                <Reveal as="li" key={h.name} delay={(n % 3) * 80} className="border-t border-ivory/15 py-8">
                  <h3 className="display text-[2rem] leading-tight text-ivory">{h.name}</h3>
                  <p className="mt-2 leading-relaxed text-ivory/65">{h.text}</p>
                </Reveal>
              ))}
            </ul>
            {p.otherAmenities && (
              <Reveal className="mt-12 border-t border-ivory/15 pt-8">
                <h3 className="eyebrow text-ivory/50">Also in the community</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.otherAmenities.map((a) => (
                    <li key={a} className="border border-ivory/20 px-3.5 py-2 text-sm text-ivory/80">
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
        <section aria-labelledby="specs-title" className="bg-ivory py-20 md:py-28">
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-4">
              <SectionMark n="04" label="Built to last" />
              <h2 id="specs-title" className="display mt-6 text-[2.8rem] sm:text-[3.6rem]">
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
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-ink [&::-webkit-details-marker]:hidden">
                    <span className="display text-[1.8rem] leading-none">{s.group}</span>
                    <Plus
                      aria-hidden
                      className="size-5 shrink-0 transition-transform duration-500 group-open:rotate-45"
                      strokeWidth={1.25}
                    />
                  </summary>
                  <ul className="space-y-2 pb-6 text-ink-soft">
                    {s.items.map((item) => (
                      <li key={item} className="flex gap-3 leading-relaxed">
                        <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-brass-deep" />
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
        <section aria-labelledby="words-title" className="bg-paper py-20 md:py-28">
          <div className="shell">
            <SectionMark n="—" label={`Homeowners at ${p.shortName}`} />
            <h2 id="words-title" className="sr-only">
              From homeowners at {p.name}
            </h2>
            <div className="mt-10 grid gap-12 md:grid-cols-2">
              {words.map((w) => (
                <Reveal as="figure" key={w.name} className="border-t border-ink/15 pt-8">
                  <span aria-hidden className="display block text-[5rem] leading-[0.5] text-brass">
                    “
                  </span>
                  <blockquote className="display mt-4 text-[2rem] leading-[1.1] text-ink sm:text-[2.5rem]">
                    {w.quote}
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

      <EnquirySection defaultInterest={p.name} mark="—" />

      {/* Previous / next as image cards */}
      <nav aria-label="More communities" className="grid bg-ink sm:grid-cols-2">
        {[
          { label: "Previous", item: prev, Icon: ArrowLeft },
          { label: "Next", item: next, Icon: ArrowRight },
        ].map(({ label, item, Icon }) => (
          <Link
            key={label}
            href={`/homes/${item.slug}`}
            className="group relative flex min-h-56 items-end overflow-hidden p-6 text-ivory md:min-h-72 md:p-10"
          >
            <span className="img-zoom absolute inset-0">
              <Image src={item.cover.src} alt="" fill sizes="50vw" className="object-cover opacity-45" />
            </span>
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
            <span className="relative flex w-full items-end justify-between gap-4">
              <span>
                <span className="eyebrow block text-brass-light">{label}</span>
                <span className="display mt-2 block text-[2.2rem] leading-tight md:text-[2.8rem]">{item.name}</span>
              </span>
              <Icon aria-hidden className="size-6 shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={1.25} />
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
