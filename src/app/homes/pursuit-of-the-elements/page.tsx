import type { Metadata } from "next";
import { type CSSProperties, ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { CommuteLazy } from "@/components/CommuteLazy";
import { ComposeButton } from "@/components/ComposeButton";
import { FactList, Gallery, Section, SectionHead, Tag } from "@/components/ds";
import { EnquirySection } from "@/components/home/EnquirySection";
import { PhotoHero } from "@/components/ds";
import { ArrowRight } from "@/components/showroom/Icons";
import { links } from "@/lib/content";
import { elements as e } from "@/lib/elements";
import { pageMeta } from "@/lib/launch";
import { award, homesHandedOver } from "@/lib/proof";
import { formatIndian } from "@/lib/site";
import { Count } from "../Count";
import { ElementsStory } from "./ElementsStory";
import s from "./page.module.css";
import { StickyVisit } from "./StickyVisit";

export const metadata: Metadata = pageMeta({
  title: e.name,
  description: `${e.name}, Gunjur, East Bengaluru: 2, 3 & 4 BHK apartments and 4 & 5 BHK villas on 20 acres. RERA registered.`,
  path: e.href,
  image: { url: "/images/og/pursuit-of-the-elements.jpg", width: 1200, height: 630, alt: e.cover.alt },
});

/* Nine pictures fill the gallery's three-column mosaic with no gap in the last row, so the weakest of the ten, a lounge corner, is left out here. */
const gallery = e.gallery.filter((g) => !g.src.endsWith("/lounge.webp"));

const NEW_TAB = <span className="sr-only">(opens in a new tab)</span>;

/*
 * The project on sale, laid out like a tesla.com model page: the photograph and its three figures,
 * the idea told as you scroll, the homes, the pictures, the amenities, the papers, the drive, and one enquiry form.
 */
export default function ElementsPage() {
  return (
    <>
      <ViewTransition name={`community-${e.slug}`} share="morph" default="none">
        <PhotoHero
          eyebrow={`${e.status} · ${e.locality}`}
          title={e.shortName}
          line={`${e.offer} and 4 & 5 BHK villas. ${e.tagline}`}
          image={e.cover}
          note="Artist’s impression"
          specs={[
            // The figures count up; PhotoHero prints them as given.
            { value: (<><Count to={20} /> acres</>) as unknown as string, label: "Land" },
            { value: (<><Count to={40} />+</>) as unknown as string, label: "Amenities" },
            { value: (<><Count to={7} /> towers</>) as unknown as string, label: "Up to 29 floors" },
          ]}
          actions={[
            { label: "Book a visit", href: "#enquire" },
            { label: "Message us on WhatsApp", href: e.whatsapp },
          ]}
        />
      </ViewTransition>

      <div className={s.strip}>
        <p className={s.stripText}>
          Karnataka RERA
          {e.rera.map((r) => (
            <span key={r.no}>
              {r.phase} <span className={s.no}>{r.no}</span>
            </span>
          ))}
        </p>
        <a className="text-link" href={links.rera} target="_blank" rel="noopener noreferrer">
          Verify on the RERA portal <ArrowRight />
          {NEW_TAB}
        </a>
      </div>

      <ElementsStory />

      <Section tone="surface" labelledBy="homes-title">
        <div className="reveal">
          <SectionHead
            id="homes-title"
            title="Seven towers, and independent villas"
            line="2, 3 and 4 BHK apartments, and 4 and 5 BHK villas. Ask us for the floor plans and carpet areas of the home you’re considering."
          />
        </div>
        <div className={s.glance}>
          <div className={s.col}>
            <h3 className={s.groupTitle}>The project</h3>
            <div className="reveal">
              <FactList facts={e.facts} />
            </div>
            <div className={s.colFoot}>
              <p className={s.price}>Prices depend on the home and the floor, so our sales team shares the current ones on request.</p>
              <div className={s.actions}>
                <ComposeButton channel="whatsapp" topic="Current prices" className="btn btn-soft">
                  Ask for current prices
                </ComposeButton>
                <Link className="text-link" href="/plan">
                  Estimate your monthly EMI <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
          <div className={s.col}>
            <h3 className={s.groupTitle}>The towers and villas</h3>
            <ul className={`${s.towers} reveal-stagger`}>
              {e.towers.map((t) => (
                <li key={t.name}>
                  <h4 className={`display ${s.towerName}`}>
                    {t.name} <span className={s.which}>{t.which}</span>
                  </h4>
                  <p>{t.floors}</p>
                </li>
              ))}
            </ul>
            <div className={s.colFoot}>
              <div className={s.actions}>
                <ComposeButton channel="whatsapp" topic="Floor plans and carpet areas" className="btn btn-dark">
                  Get floor plans on WhatsApp
                </ComposeButton>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="gallery" labelledBy="gallery-title">
        <div className="reveal">
          <SectionHead
            id="gallery-title"
            title="A look inside"
            line={`${gallery.length} artist’s impressions. Select one to see it larger.`}
          />
        </div>
        <div className={s.gallery}>
          <Gallery items={gallery} />
        </div>
      </Section>

      <Section tone="surface" labelledBy="plan-title">
        <div className="reveal">
          <SectionHead id="plan-title" title="The master plan" line="Seven towers, the villas, the clubhouse and the landscaped grounds." />
        </div>
        <a href={e.masterPlan.src} target="_blank" rel="noopener noreferrer" className={s.plan}>
          <Image
            src={e.masterPlan.src}
            alt={e.masterPlan.alt}
            width={e.masterPlan.width}
            height={e.masterPlan.height}
            sizes="(min-width: 1440px) 1344px, calc(100vw - 32px)"
            quality={82}
            loading="lazy"
            className={s.planImg}
          />
          <span className="sr-only">Open the master plan full size (opens in a new tab)</span>
        </a>
      </Section>

      <Section labelledBy="amenities-title">
        <div className="reveal">
          <SectionHead
            id="amenities-title"
            title="Over 40 amenities, indoors and out"
            line="Not ten or twenty, but more than 40 mindful amenities (a selection below), created to bring you outdoors and closer to nature."
          />
        </div>
        <h3 className={s.groupTitle}>The clubhouse, 1,35,000+ sq ft</h3>
        <ul className={`${s.list} reveal-stagger`} style={{ "--rows": Math.ceil(e.clubhouse.length / 2) } as CSSProperties}>
          {e.clubhouse.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <h3 className={`${s.groupTitle} ${s.outdoorTitle}`}>Outdoors</h3>
        <ul className={s.pills}>
          {e.outdoor.map((a) => (
            <li key={a}>
              <Tag tone="grey">{a}</Tag>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="papers" tone="surface" labelledBy="papers-title" className={s.anchor}>
        <div className={s.check}>
          <div className={s.checkText}>
            <div className="reveal">
              <SectionHead id="papers-title" title="Check us" line="Ask us for any document you want to see." />
            </div>
            <ul className={`${s.checkLinks} reveal-stagger`}>
              <li>
                <a className="text-link" href={e.updates} target="_blank" rel="noopener noreferrer">
                  Construction photographs, every quarter (latest {e.latestUpdate}) <ArrowRight />
                  {NEW_TAB}
                </a>
              </li>
              <li>
                <Link className="text-link" href="/homes">
                  {formatIndian(homesHandedOver)} homes handed over in five communities since 2014 <ArrowRight />
                </Link>
              </li>
            </ul>
          </div>
          <figure className={s.award}>
            <Image
              src={award.image}
              alt={`${award.title} ${award.honour} for ${e.name}`}
              width={315}
              height={227}
              sizes="(min-width: 1024px) 315px, 60vw"
              className={s.awardImg}
            />
            <figcaption>
              {award.title}: {award.honour}, {award.citation}.
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section id="commute" labelledBy="commute-title" className={s.anchor}>
        <div className="reveal">
          <SectionHead
            id="commute-title"
            title="Check the drive before you decide"
            line="Traffic changes by the hour, so we won’t quote a number. See today’s real route from the site."
          />
        </div>
        <CommuteLazy />
      </Section>

      <EnquirySection defaultInterest={e.name} n="" />
      <StickyVisit />
    </>
  );
}
