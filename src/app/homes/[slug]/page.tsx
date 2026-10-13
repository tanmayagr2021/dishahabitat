import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, MapPin, Plus } from "lucide-react";
import { GalleryGrid } from "@/components/Lightbox";
import { DayInTheSun } from "@/components/DayInTheSun";
import { PageHero } from "@/components/PageHero";
import { EnquirySection } from "@/components/home/EnquirySection";
import { Label, Lines, Reveal } from "@/components/ui";
import { getProject, projectsByHandover, projectsNewestFirst } from "@/lib/projects";
import { homeowners } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectsByHandover.map((p) => ({ slug: p.slug }));
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

/* "January 2023" → months since year 0, for placing dates on a scaled track. */
const monthIndex = (s: string) => {
  const d = new Date(`1 ${s}`);
  return d.getFullYear() * 12 + d.getMonth();
};

export default async function ProjectPage(props: PageProps<"/homes/[slug]">) {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = projectsNewestFirst.indexOf(p);
  const next = projectsNewestFirst[(i + 1) % projectsNewestFirst.length];
  const words = homeowners.filter((h) => h.slug === p.slug);
  const mapQuery = encodeURIComponent(p.address ?? `${p.name}, ${p.locality}`);

  // A scaled timeline: start, handover and OC completion placed by date.
  const t0 = monthIndex(p.timeline.start);
  const marks = [
    { k: "Construction start", v: p.timeline.start },
    { k: "Handover", v: p.timeline.handover },
    { k: "Completion (as per OC)", v: p.timeline.completion },
  ].map((m) => ({ ...m, at: monthIndex(m.v) - t0 }));
  const span = Math.max(...marks.map((m) => m.at)) || 1;
  const startYear = Number(p.timeline.start.split(" ")[1]);
  const years = Array.from(
    { length: Number(p.timeline.completion.split(" ")[1]) - startYear + 1 },
    (_, n) => startYear + n,
  ).filter((y) => (y * 12 - t0) / span > 0.04 && (y * 12 - t0) / span < 0.96);

  return (
    <div style={{ "--accent": p.hue } as CSSProperties}>
      <PageHero
        label={
          <>
            <Link href="/homes" className="hover:text-paper">
              Our homes
            </Link>
            <span aria-hidden className="mx-3 inline-block h-px w-6 bg-current align-middle opacity-40" />
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="size-2 bg-[var(--accent)]" />
              {p.index} · {p.locality}
            </span>
          </>
        }
        title={
          p.shortName.includes(" ") ? (
            <>
              {p.shortName.split(" ").slice(0, -1).join(" ")} <em>{p.shortName.split(" ").at(-1)}</em>
            </>
          ) : (
            p.shortName
          )
        }
        intro={p.intro}
        image={p.cover}
        morph={`cover-${p.slug}`}
        aside={
          <dl className="grid shrink-0 grid-cols-3 gap-8 md:gap-12">
            {[
              ["Homes", p.facts.find((f) => f.label === "Homes")?.value],
              ["Land", p.facts.find((f) => f.label === "Project size")?.value],
              ["Handover", String(p.handoverYear)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label text-paper/60">{k}</dt>
                <dd className="serif mt-2 text-[1.8rem] leading-none md:text-[2.2rem]">{v}</dd>
              </div>
            ))}
          </dl>
        }
      />

      {/* Overview: the facts and a timeline drawn to scale */}
      <section data-tone="light" aria-labelledby="overview-title" className="surface-ivory py-16 md:py-24">
        <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Label n="01" className="text-ink/70">
              The community
            </Label>
            <h2 id="overview-title" className="sr-only">
              About {p.name}
            </h2>
            <dl className="mt-8 border-b border-ink/20">
              {p.facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-6 border-t border-ink/20 py-4">
                  <dt className="label text-ink/70">{f.label}</dt>
                  <dd className="serif text-right text-[1.6rem] leading-tight">{f.value}</dd>
                </div>
              ))}
            </dl>
            {p.website && (
              <a
                href={p.website.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                Official project site: {p.website.label}
                <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Label className="text-ink/70">Timeline</Label>
            <Reveal className="mt-10">
              <div className="relative h-24">
                <div className="absolute inset-x-0 top-1/2 h-px bg-ink/20" />
                <div
                  className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-[var(--accent)]"
                  style={{ width: `${(marks[2].at / span) * 100}%` }}
                />
                {years.map((y) => (
                  <span
                    key={y}
                    aria-hidden
                    className="label absolute top-[calc(50%+14px)] -translate-x-1/2 text-ink/60"
                    style={{ left: `${((y * 12 - t0) / span) * 100}%` }}
                  >
                    {y}
                  </span>
                ))}
                {marks.map((m, n) => (
                  <span
                    key={m.k}
                    aria-hidden
                    className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 border-2 border-paper bg-ink"
                    style={{ left: `${(m.at / span) * 100}%`, zIndex: 3 - n }}
                  />
                ))}
              </div>
              <ol className="mt-8 grid gap-6 sm:grid-cols-3">
                {[...marks].sort((a, b) => a.at - b.at).map((m) => (
                  <li key={m.k} className="border-t border-ink/20 pt-4">
                    <span className="label block text-ink/70">{m.k}</span>
                    <span className="serif mt-2 block text-[1.8rem] leading-tight">{m.v}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 flex items-baseline gap-3">
                <span className="serif text-[3.6rem] leading-none">{p.timeline.months}</span>
                <span className="text-ink/70">months from start to finish, as published.</span>
              </p>
            </Reveal>

            <div className="mt-14 border-t border-ink/20 pt-6">
              <Label className="text-ink/70">Location</Label>
              <p className="mt-3 flex gap-2 text-[1.05rem] leading-relaxed">
                <MapPin aria-hidden className="mt-1 size-4 shrink-0" strokeWidth={1.5} />
                {p.address ?? p.locality}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                Search on Google Maps <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {p.gallery.length > 0 && (
        <section data-tone="light" aria-labelledby="gallery-title" className="surface-stone py-16 md:py-24">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Label n="02" className="text-mute">
                  Gallery
                </Label>
                <Lines
                  id="gallery-title"
                  className="serif mt-6 text-[clamp(2.3rem,4.2vw,4.2rem)]"
                  lines={[
                    <>
                      Inside <em>{p.shortName}</em>
                    </>,
                  ]}
                />
              </div>
              <p className="label text-mute">
                {p.gallery.length} {p.gallery.length === 1 ? "image" : "images"} · select to enlarge
              </p>
            </div>
            <div className="mt-12">
              <GalleryGrid
                items={p.gallery}
                tileClasses={tilesFor(p.gallery.length)}
                gridClassName="grid grid-cols-2 gap-2 md:grid-cols-12 md:gap-3"
                sizes="(min-width: 768px) 60vw, 100vw"
              />
            </div>
          </div>
        </section>
      )}

      {p.slug === "disha-pursuit-of-sunshine" && <DayInTheSun />}

      {/* Signature spaces (Pursuit of Sunshine) */}
      {p.highlights && (
        <section data-tone="dark" aria-labelledby="highlights-title" className="surface-forest grain relative py-16 md:py-24">
          <div className="shell">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Label n="04" className="text-paper/60">
                  Signature spaces
                </Label>
                <Lines
                  id="highlights-title"
                  className="serif mt-6 text-[clamp(2.4rem,4.6vw,4.6rem)]"
                  lines={["An ode", <em key="e">to the Sun.</em>]}
                />
              </div>
              <p className="leading-relaxed text-paper/70 lg:col-span-4 lg:col-start-9">
                From your own sundeck at home or any of the outdoor arenas, every step here is a step closer to the Sun’s
                bounty.
              </p>
            </div>
            <ol className="mt-16 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {p.highlights.map((h, n) => (
                <Reveal as="li" key={h.name} delay={(n % 3) * 80} className="group border-t border-paper/15 py-8">
                  <span className="label flex items-center gap-3 text-paper/50">
                    <span className="h-[3px] w-6 bg-[var(--accent)] transition-[width] duration-500 group-hover:w-12" />
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <h3 className="serif mt-4 text-[1.9rem] leading-tight">{h.name}</h3>
                  <p className="mt-3 leading-relaxed text-paper/65">{h.text}</p>
                </Reveal>
              ))}
            </ol>
            {p.otherAmenities && (
              <div className="mt-12 border-t border-paper/15 pt-8">
                <h3 className="label text-paper/50">Also in the community</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.otherAmenities.map((a) => (
                    <li key={a} className="border border-paper/20 px-4 py-2 text-sm text-paper/80">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Specifications */}
      {p.specifications && (
        <section data-tone="light" aria-labelledby="specs-title" className="surface-ivory py-16 md:py-24">
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <Label n="05" className="text-mute">
                Built to last
              </Label>
              <h2 id="specs-title" className="serif mt-6 text-[clamp(2.6rem,4.4vw,4.2rem)]">
                Specifications
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">
                Selected items from the published project specification.
                {p.rera && (
                  <span className="label mt-6 block text-ink">RERA No. {p.rera}</span>
                )}
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              {p.specifications.map((s, n) => (
                <details key={s.group} className="group border-t border-ink/20 last:border-b" open={n === 0}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-6 [&::-webkit-details-marker]:hidden">
                    <span className="serif text-[1.9rem] leading-none">{s.group}</span>
                    <span className="inline-flex size-10 items-center justify-center border border-ink/20 transition-[transform,background-color,color] duration-500 group-open:rotate-45 group-open:bg-ink group-open:text-paper">
                      <Plus aria-hidden className="size-4" strokeWidth={1.5} />
                    </span>
                  </summary>
                  <ul className="space-y-2.5 pb-8 text-mute">
                    {s.items.map((item) => (
                      <li key={item} className="flex gap-3 leading-relaxed">
                        <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 bg-[var(--accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
              {p.salesPhone && (
                <p className="mt-8 text-sm text-mute">
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
        <section data-tone="light" aria-labelledby="words-title" className="surface-stone py-16 md:py-24">
          <div className="shell">
            <Label className="text-mute">Homeowners at {p.shortName}</Label>
            <h2 id="words-title" className="sr-only">
              From homeowners at {p.name}
            </h2>
            <div className={`mt-10 grid gap-14 ${words.length > 1 ? "md:grid-cols-2" : "max-w-5xl"}`}>
              {words.map((w) => (
                <Reveal as="figure" key={w.name} className="border-t border-ink/15 pt-8">
                  <blockquote className="serif text-[clamp(2rem,3.8vw,3.6rem)] leading-[1.04]">“{w.quote}”</blockquote>
                  <figcaption className="mt-8 flex flex-wrap gap-x-5 gap-y-1 text-sm text-mute">
                    <span className="font-medium text-ink">{w.name}</span>
                    <span>Native of {w.native}</span>
                  </figcaption>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <EnquirySection defaultInterest={p.name} n="" />

      {/* Next community: the photograph carries through to its page. */}
      <nav aria-label="Next community" className="surface-deep" data-tone="dark">
        <Link href={`/homes/${next.slug}`} className="bloom-on-hover group relative flex min-h-[70svh] items-end overflow-hidden">
          <ViewTransition name={`cover-${next.slug}`} share="morph" default="none">
            <span className="absolute inset-0 block">
              <Image
                src={next.cover.src}
                alt=""
                fill
                sizes="100vw"
                className="mono-img object-cover opacity-70 transition-[filter,transform,opacity] duration-[1400ms] ease-out-expo group-hover:scale-105 group-hover:opacity-90"
              />
            </span>
          </ViewTransition>
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <span className="shell relative flex w-full items-end justify-between gap-6 pb-12 md:pb-16">
            <span>
              <span className="label flex items-center gap-3 text-paper/70">
                <span className="size-2 " style={{ background: next.hue }} />
                Next community · {next.locality}
              </span>
              <span className="serif mt-4 block text-[clamp(2.3rem,4.4vw,4.4rem)] leading-[0.95]">{next.shortName}</span>
            </span>
            <span className="mb-3 inline-flex size-16 shrink-0 items-center justify-center bg-paper text-ink transition-transform duration-500 group-hover:translate-x-2 md:size-20">
              <ArrowRight aria-hidden className="size-6" strokeWidth={1.25} />
            </span>
          </span>
        </Link>
      </nav>
    </div>
  );
}
