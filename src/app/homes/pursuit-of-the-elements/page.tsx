import type { Metadata } from "next";
import { type CSSProperties, ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { CommuteLazy } from "@/components/CommuteLazy";
import { ComposeButton } from "@/components/ComposeButton";
import { Gallery, PhotoHero, Section, SectionHead } from "@/components/ds";
import { SlashBreak } from "@/components/ds/SlashBreak";
import { EnquirySection } from "@/components/home/EnquirySection";
import { ArrowRight } from "@/components/showroom/Icons";
import { links } from "@/lib/content";
import { elements as e } from "@/lib/elements";
import { pageMeta } from "@/lib/launch";
import { award, homesHandedOver } from "@/lib/proof";
import { formatIndian } from "@/lib/site";
import { Count } from "../Count";
import { FeaturePanel } from "../FeaturePanel";
import { SubNav } from "../SubNav";
import { ElementsStory } from "./ElementsStory";
import { PlanViewer } from "./PlanViewer";
import s from "./page.module.css";

export const metadata: Metadata = pageMeta({
  title: e.name,
  description: `${e.name}, Gunjur, East Bengaluru: 2, 3 & 4 BHK apartments and 4 & 5 BHK villas on 20 acres. RERA registered.`,
  path: e.href,
  image: { url: "/images/og/pursuit-of-the-elements.jpg", width: 1200, height: 630, alt: e.cover.alt },
});

const NEW_TAB = <span className="sr-only">(opens in a new tab)</span>;

const nav = [
  { id: "overview", label: "Overview" },
  { id: "homes", label: "Homes" },
  { id: "amenities", label: "Amenities" },
  { id: "plan", label: "Master plan" },
  { id: "location", label: "Location" },
  { id: "check", label: "Check us" },
  { id: "enquire", label: "Visit", phoneHidden: true },
];

/* The three renders that have a panel of their own are not repeated in the gallery; the lounge corner, the weakest, is left out. */
const panelled = ["/clubhouse.webp", "/villas.webp", "/courts-aerial.webp", "/lounge.webp"];
const gallery = e.gallery.filter((g) => !panelled.some((p) => g.src.endsWith(p)));
const picture = (name: string) => e.gallery.find((g) => g.src.endsWith(`/${name}.webp`))!;

/* The figures the hero does not show. */
const glance = [
  { label: "Clubhouse", value: "1,35,000+", unit: "sq ft" },
  { label: "Apartments", value: "2, 3 & 4", unit: "BHK" },
  { label: "Villas", value: "4 & 5", unit: "BHK" },
  { label: "Tallest tower", value: <Count to={29} />, unit: "floors" },
];

/*
 * The project on sale, laid out like a tesla.com model page: the photograph and its figures, then a
 * bar that follows you down the page. Homes, the idea told as you scroll, three full-bleed features,
 * the master plan, the drive, the papers, and one enquiry form.
 */
export default function ElementsPage() {
  return (
    <div className={s.page}>
      <ViewTransition name={`community-${e.slug}`} share="morph" default="none">
        <PhotoHero
          eyebrow={`${e.status} · ${e.locality}`}
          title={e.shortName}
          line="2, 3 & 4 BHK homes and 4 & 5 BHK villas"
          image={e.cover}
          note="Artist’s impression"
          specs={[
            { value: <Count to={20} />, unit: "acres", label: "Land" },
            { value: <><Count to={40} />+</>, label: "Amenities" },
            { value: <Count to={7} />, unit: "towers", label: "Up to 29 floors" },
          ]}
          actions={[
            { label: "Book a visit", href: "#enquire" },
            { label: "Message us on WhatsApp", href: e.whatsapp },
          ]}
        />
      </ViewTransition>

      <SubNav items={nav} label="On this page" cta={{ label: "Book a visit", href: "#enquire" }} />

      <Section id="overview" labelledBy="glance-title" className={s.anchor}>
        <h2 id="glance-title" className="eyebrow">
          At a glance
        </h2>
        <dl className={`${s.glance} reveal-stagger`}>
          {glance.map((g) => (
            <div key={g.label} className={s.fig}>
              <dt>{g.label}</dt>
              <dd>
                {g.value}
                <span className={s.unit}>{g.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <div id="homes" className={s.anchor}>
        <Section tone="surface" labelledBy="homes-title">
          <div className={s.homes}>
            <div className={s.homesText}>
              <div className="reveal">
                <SectionHead
                  id="homes-title"
                  title="Seven towers, and independent villas"
                  line="2, 3 and 4 BHK apartments, and 4 and 5 BHK villas. Ask us for the floor plans and carpet areas of the home you’re considering."
                />
              </div>
              <div className={s.foot}>
                <p className={s.price}>Prices depend on the home and the floor, so our sales team shares the current ones on request.</p>
                <div className={s.actions}>
                  <ComposeButton channel="whatsapp" topic="Current prices" className="btn btn-dark">
                    Ask for current prices
                  </ComposeButton>
                  <ComposeButton channel="whatsapp" topic="Floor plans and carpet areas" className="btn btn-soft">
                    Get floor plans on WhatsApp
                  </ComposeButton>
                  <Link className="text-link" href="/plan">
                    Estimate your monthly EMI <ArrowRight />
                  </Link>
                </div>
              </div>
            </div>
            <ul className={`${s.towers} reveal-stagger`}>
              {e.towers.map((t) => (
                <li key={t.name}>
                  <h3 className={`display ${s.towerName}`}>
                    {t.name} <span className={s.which}>{t.which}</span>
                  </h3>
                  <p>{t.floors}</p>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <ElementsStory />

        <FeaturePanel
          id="villas"
          image={picture("villas")}
          eyebrow="4 & 5 BHK villas"
          title="Independent villas, inside the community"
          line="Rows of independent 4 and 5 BHK villas, set among gardens."
          position="50% 55%"
        >
          <ComposeButton channel="whatsapp" topic="Villas" className="text-link">
            Ask about the villas <ArrowRight />
          </ComposeButton>
        </FeaturePanel>
      </div>

      <div id="amenities" className={s.anchor}>
        <Section space="tight" labelledBy="amenities-title">
          <div className="reveal">
            <SectionHead
              id="amenities-title"
              title="Over 40 amenities, indoors and out"
              line="Not ten or twenty, but more than 40 mindful amenities (a selection below), created to bring you outdoors and closer to nature."
            />
          </div>
        </Section>

        <FeaturePanel
          id="clubhouse"
          image={picture("clubhouse")}
          eyebrow="1,35,000+ sq ft"
          title="A clubhouse to spend the day in"
          line="A heated pool on the roof, courts, a banquet hall and a library under one roof."
          position="50% 40%"
        >
          <a className="text-link" href="#clubhouse-list">
            Everything in the clubhouse <ArrowRight />
          </a>
        </FeaturePanel>
        <Section id="clubhouse-list" space="tight" labelledBy="clubhouse-list-title" className={s.anchor}>
          <h3 id="clubhouse-list-title" className={s.groupTitle}>
            In the clubhouse
          </h3>
          <ul className={`${s.list} reveal-stagger`} style={{ "--rows": Math.ceil(e.clubhouse.length / 2) } as CSSProperties}>
            {e.clubhouse.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Section>

        <FeaturePanel
          id="outdoors"
          image={picture("courts-aerial")}
          eyebrow="Outdoors"
          title="Courts, lawns and gardens"
          line="Tennis, futsal, cricket and skating, with lawns and gardens around them."
          position="50% 50%"
        >
          <a className="text-link" href="#outdoor-list">
            Everything outdoors <ArrowRight />
          </a>
        </FeaturePanel>
        <Section id="outdoor-list" space="tight" labelledBy="outdoor-list-title" className={s.anchor}>
          <h3 id="outdoor-list-title" className={s.groupTitle}>
            Outdoors
          </h3>
          <ul className={s.pills}>
            {e.outdoor.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Section>

        <Section id="gallery" tone="surface" labelledBy="gallery-title" className={s.anchor}>
          <div className="reveal">
            <SectionHead
              id="gallery-title"
              title="A look inside"
              line={`${gallery.length} more artist’s impressions. Select one to see it larger.`}
            />
          </div>
          <div className={s.gallery}>
            <Gallery items={gallery} layout="grid" />
          </div>
        </Section>
      </div>

      <Section id="plan" labelledBy="plan-title" className={s.anchor}>
        <div className="reveal">
          <SectionHead id="plan-title" title="The master plan" line="Seven towers, the villas, the clubhouse and the landscaped grounds." />
        </div>
        <PlanViewer src={e.masterPlan.src} alt={e.masterPlan.alt} width={e.masterPlan.width} height={e.masterPlan.height} />
      </Section>

      <Section id="location" tone="surface" labelledBy="commute-title" className={s.anchor}>
        <div className="reveal">
          <SectionHead
            id="commute-title"
            title="Check the drive before you decide"
            line="Traffic changes by the hour, so we won’t quote a number. See today’s real route from the site."
          />
        </div>
        <CommuteLazy />
      </Section>

      <Section id="check" labelledBy="papers-title" className={s.anchor}>
        <div className={s.check}>
          <div className={s.checkText}>
            <div className="reveal">
              <SectionHead id="papers-title" title="Check us" line="Ask us for any document you want to see." />
            </div>
            <div className={s.rera} id="rera">
              <p className={s.reraTitle}>Karnataka RERA</p>
              <ul className={s.reraList}>
                {e.rera.map((r) => (
                  <li key={r.no}>
                    {r.phase} <span className={s.no}><SlashBreak code={r.no} /></span>
                  </li>
                ))}
              </ul>
              <a className="text-link" href={links.rera} target="_blank" rel="noopener noreferrer">
                Verify on the RERA portal <ArrowRight />
                {NEW_TAB}
              </a>
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

      <EnquirySection defaultInterest={e.name} n="" />
    </div>
  );
}
