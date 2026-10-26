import type { Metadata } from "next";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accordion, CtaBand, FactList, Gallery, Quote, Section, SectionHead, Tag } from "@/components/ds";
import { PhotoHero } from "@/components/ds";
import { ArrowRight } from "@/components/showroom/Icons";
import { links } from "@/lib/content";
import { elements } from "@/lib/elements";
import { pageMeta } from "@/lib/launch";
import { getProject, projectsByHandover, projectsNewestFirst } from "@/lib/projects";
import { homeowners } from "@/lib/site";
import { Count } from "../Count";
import s from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectsByHandover.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/homes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMeta({
    title: p.name,
    description: `${p.name}, ${p.locality}: ${p.facts.find((f) => f.label === "Homes")?.value} homes, handed over in ${p.handoverYear}. Photographs, facts and timeline.`,
    path: `/homes/${p.slug}`,
    image: { url: `/images/og/${p.slug}.jpg`, width: 1200, height: 630, alt: p.cover.alt },
  });
}

/* "January 2023" → months since year 0, for counting the months between milestones. */
const monthIndex = (d: string) => {
  const date = new Date(`1 ${d}`);
  return date.getFullYear() * 12 + date.getMonth();
};

/* "264" or "31 months": the leading whole number counts up. Anything else stays as written. */
const count = (text = ""): string => {
  const m = /^(\d+)(\s.*|)$/.exec(text);
  return m ? ((<><Count to={Number(m[1])} />{m[2]}</>) as unknown as string) : text;
};

const factValue = (facts: { label: string; value: string }[], label: string) => facts.find((f) => f.label === label)?.value;

/*
 * A community Disha has handed over, laid out like a tesla.com model page: the photograph and its
 * three figures, what it is, how long it took, the pictures, the specification, the people who live
 * there, and where to go next.
 */
export default async function CommunityPage(props: PageProps<"/homes/[slug]">) {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = projectsNewestFirst.indexOf(p);
  const next = projectsNewestFirst[(i + 1) % projectsNewestFirst.length];
  const words = homeowners.filter((h) => h.slug === p.slug);
  const mapQuery = encodeURIComponent(p.address ?? `${p.name}, ${p.locality}`);

  /* The timeline: three milestones at equal spacing, with the real months between them. */
  const marks = [
    { k: "Construction start", v: p.timeline.start },
    { k: "Handover", v: p.timeline.handover },
    { k: "Completion (as per OC)", v: p.timeline.completion },
  ]
    .map((m) => ({ ...m, at: monthIndex(m.v) }))
    .sort((a, b) => a.at - b.at);
  const gaps = marks.slice(1).map((m, n) => m.at - marks[n].at);

  return (
    <>
      <ViewTransition name={`community-${p.slug}`} share="morph" default="none">
        <PhotoHero
          eyebrow={`Handed over ${p.handoverYear}`}
          title={p.shortName}
          line={p.locality}
          image={p.cover}
          specs={[
            // Whole numbers count up; PhotoHero prints each value as given.
            { label: "Homes", value: count(factValue(p.facts, "Homes")) },
            { label: "Land", value: factValue(p.facts, "Project size") ?? "" },
            { label: "Start to finish", value: count(`${p.timeline.months} months`) },
          ]}
          actions={[
            { label: `See ${elements.shortName}`, href: elements.href },
            { label: "Book a visit", href: links.bookVisit },
          ]}
        />
      </ViewTransition>

      <Section labelledBy="about-title">
        <div className={s.about}>
          <div className={s.aboutText}>
            <div className={s.aboutLead}>
              <h2 id="about-title" className="eyebrow">
                About {p.shortName}
              </h2>
              <p className={`display ${s.lead}`}>{p.intro}</p>
            </div>
            <div className={s.links}>
              {p.website && (
                <a className="text-link" href={p.website.href} target="_blank" rel="noopener noreferrer">
                  {p.website.label}
                  <ArrowRight />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              <a
                className="text-link"
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Find it on Google Maps
                <ArrowRight />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
          <div className={`${s.facts} reveal`}>
            <FactList
              facts={[
                ...p.facts,
                ...(p.rera ? [{ label: "Karnataka RERA", value: p.rera }] : []),
                ...(p.address ? [{ label: "Address", value: p.address }] : []),
              ]}
            />
          </div>
        </div>
      </Section>

      <Section tone="surface" labelledBy="timeline-title">
        <div className="reveal">
          <SectionHead
            id="timeline-title"
            title="From ground-breaking to keys"
            line={`${p.timeline.months} months from the start of construction to completion, as published.`}
          />
        </div>
        <ol className={s.marks}>
          {marks.map((m, n) => (
            <li key={m.k}>
              <span className={s.track} aria-hidden="true">
                <span className={s.dot} />
                {n < gaps.length && (
                  <span className={s.seg}>
                    <span className={s.gap}>{gaps[n] === 0 ? "Same month" : `${gaps[n]} ${gaps[n] === 1 ? "month" : "months"}`}</span>
                  </span>
                )}
              </span>
              <span className={s.markLabel}>{m.k}</span>
              <span className={s.markValue}>{m.v}</span>
            </li>
          ))}
        </ol>
      </Section>

      {p.gallery.length > 0 && (
        <Section id="gallery" labelledBy="gallery-title">
          <div className="reveal">
            <SectionHead
              id="gallery-title"
              title={`Inside ${p.shortName}`}
              line={`${p.gallery.length} ${p.gallery.length === 1 ? "photograph" : "photographs"}. Select one to see it larger.`}
            />
          </div>
          <div className={s.gallery} data-count={p.gallery.length}>
            <Gallery items={p.gallery} layout={p.gallery.length >= 3 && p.gallery.length % 3 === 0 ? "mosaic" : "grid"} />
          </div>
        </Section>
      )}

      {p.highlights && (
        <Section tone="surface" labelledBy="highlights-title">
          <div className="reveal">
            <SectionHead
              id="highlights-title"
              title="Signature spaces"
              line="From your own sundeck to the open-air arenas, every step here is a step closer to the sun."
            />
          </div>
          <ol className={`${s.highlights} reveal-stagger`}>
            {p.highlights.map((h, n) => (
              <li key={h.name}>
                <span className={s.num}>{String(n + 1).padStart(2, "0")}</span>
                <h3 className={s.hName}>{h.name}</h3>
                <p>{h.text}</p>
              </li>
            ))}
          </ol>
          {p.otherAmenities && (
            <div className={s.also}>
              <h3 className={s.alsoTitle}>Also in the community</h3>
              <ul>
                {p.otherAmenities.map((a) => (
                  <li key={a}>
                    <Tag tone="grey">{a}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {p.specifications && (
        <Section labelledBy="specs-title">
          <div className="reveal">
            <SectionHead id="specs-title" title="Specifications" line="Selected items from the published project specification." />
          </div>
          <Accordion
            items={p.specifications.map((sp) => ({
              title: sp.group,
              body: (
                <ul className={s.specItems}>
                  {sp.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ),
            }))}
          />
        </Section>
      )}

      {words.length > 0 && (
        <Section tone="surface" labelledBy="words-title">
          <h2 id="words-title" className="sr-only">
            From homeowners at {p.name}
          </h2>
          <div className={s.words} data-count={words.length}>
            {words.map((w) => (
              <Quote key={w.name} quote={w.quote} name={w.name} detail={`Native of ${w.native}`} />
            ))}
          </div>
        </Section>
      )}

      <CtaBand
        title={`Families live at ${p.shortName} today. Looking for a home like theirs?`}
        line={`${elements.shortName} is selling now in ${elements.locality}: the last few 2, 3 & 4 BHK homes and 4 & 5 BHK villas, by the same people.`}
        actions={[
          { label: "Book a visit", href: links.bookVisit },
          { label: `See ${elements.shortName}`, href: elements.href },
        ]}
      />

      <nav aria-label="Next community" className={s.nextWrap}>
        <ViewTransition name={`community-${next.slug}`} share="morph" default="none">
          <Link href={`/homes/${next.slug}`} className={s.next} data-tone="dark">
            <Image src={next.cover.src} alt="" fill sizes="100vw" quality={78} className={s.nextImg} />
            <span className={s.nextShade} aria-hidden="true" />
            <span className={s.nextText}>
              <span className={s.nextEyebrow}>Next community · {next.locality}</span>
              <span className={`display ${s.nextName}`}>{next.shortName}</span>
            </span>
            <span className={s.nextArrow} aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
        </ViewTransition>
      </nav>
    </>
  );
}
