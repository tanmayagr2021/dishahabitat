import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CommuteChecker } from "@/components/CommuteChecker";
import { ComposeButton } from "@/components/ComposeButton";
import { FactList, Gallery, PhotoHero, Section, SectionHead, Tag } from "@/components/ds";
import { EnquirySection } from "@/components/home/EnquirySection";
import { ArrowRight } from "@/components/showroom/Icons";
import { links } from "@/lib/content";
import { elements as e } from "@/lib/elements";
import { pageMeta } from "@/lib/launch";
import { award, homesHandedOver, reraSearch } from "@/lib/proof";
import { formatIndian } from "@/lib/site";
import s from "./page.module.css";
import { StickyVisit } from "./StickyVisit";

export const metadata: Metadata = pageMeta({
  title: e.name,
  description: `${e.name}, Gunjur, East Bengaluru: 2, 3 & 4 BHK apartments and 4 & 5 BHK villas on 20 acres. RERA registered.`,
  path: e.href,
  image: { url: "/images/og/pursuit-of-the-elements.jpg", width: 1200, height: 630, alt: e.cover.alt },
});

const NEW_TAB = <span className="sr-only">(opens in a new tab)</span>;

/*
 * The project on sale, laid out like a tesla.com model page: the photograph and its three figures,
 * the idea, the homes, the pictures, the amenities, the papers, the drive, and one enquiry form.
 */
export default function ElementsPage() {
  return (
    <>
      <PhotoHero
        eyebrow={`${e.status} · ${e.locality}`}
        title={e.shortName}
        line={`${e.offer} and 4 & 5 BHK villas. ${e.tagline}`}
        image={e.cover}
        note="Artist’s impression"
        specs={[
          { value: "20 acres", label: "Land" },
          { value: "40+", label: "Amenities" },
          { value: "7 towers", label: "Up to 29 floors" },
        ]}
        actions={[
          { label: "Book a visit", href: "#enquire" },
          { label: "Message us on WhatsApp", href: e.whatsapp },
        ]}
      />

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

      <Section labelledBy="idea-title">
        <div className={s.idea}>
          <div className={s.ideaText}>
            <h2 id="idea-title" className="eyebrow">
              Inspired by the five elements
            </h2>
            <ul className={`display ${s.elements}`} aria-label="The five elements">
              {e.fiveElements.map((el) => (
                <li key={el}>{el}</li>
              ))}
            </ul>
            <p className={s.copy}>{e.intro}</p>
            <p className={s.copy}>Come home to Disha Pursuit of the Elements and let it all come to you.</p>
          </div>
          <div>
            <FactList facts={e.facts} />
            <p className={s.price}>Prices depend on the home and the floor, so our sales team shares the current ones on request.</p>
            <div className={s.priceActions}>
              <ComposeButton channel="whatsapp" topic="Current prices" className="btn btn-soft">
                Ask for current prices
              </ComposeButton>
              <Link className="text-link" href="/plan">
                Estimate your monthly EMI <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="surface" labelledBy="homes-title">
        <div className={s.homes}>
          <div className={s.homesText}>
            <SectionHead
              id="homes-title"
              title="Seven towers, and independent villas"
              line="2, 3 and 4 BHK apartments, and 4 and 5 BHK villas. Ask us for the floor plans and carpet areas of the home you’re considering."
            />
            <ComposeButton channel="whatsapp" topic="Floor plans and carpet areas" className="btn btn-dark">
              Get floor plans on WhatsApp
            </ComposeButton>
          </div>
          <ul className={s.towers}>
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

      <Section id="gallery" labelledBy="gallery-title">
        <SectionHead
          id="gallery-title"
          title="A look inside"
          line={`${e.gallery.length} artist’s impressions. Select one to see it larger.`}
        />
        <Gallery items={e.gallery} />
      </Section>

      <Section tone="surface" labelledBy="plan-title">
        <SectionHead id="plan-title" title="The master plan" line="Seven towers, the villas, the clubhouse and the landscaped grounds." />
        <a href={e.masterPlan.src} target="_blank" rel="noopener noreferrer" className={s.plan}>
          <Image
            src={e.masterPlan.src}
            alt={e.masterPlan.alt}
            width={e.masterPlan.width}
            height={e.masterPlan.height}
            sizes="(min-width: 1440px) 1344px, 100vw"
            quality={82}
            className={s.planImg}
          />
          <span className="sr-only">Open the master plan full size (opens in a new tab)</span>
        </a>
      </Section>

      <Section labelledBy="amenities-title">
        <SectionHead
          id="amenities-title"
          title="Over 40 amenities, indoors and out"
          line="Not ten or twenty, but more than 40 mindful amenities (a selection below), created to bring you outdoors and closer to nature."
        />
        <div className={s.amenities}>
          <div>
            <h3 className={s.groupTitle}>The clubhouse, 1,35,000+ sq ft</h3>
            <ul className={s.list}>
              {e.clubhouse.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={s.groupTitle}>Outdoors</h3>
            <ul className={s.pills}>
              {e.outdoor.map((a) => (
                <li key={a}>
                  <Tag tone="grey">{a}</Tag>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="papers" labelledBy="papers-title" className={s.anchor}>
        <div className={s.check}>
          <div className={s.checkText}>
            <SectionHead
              id="papers-title"
              title="Check us"
              line="Ask us for any document you want to see."
            />
            <ul className={s.checkLinks}>
              <li>
                <a className="text-link" href={reraSearch} target="_blank" rel="noopener noreferrer">
                  Verify both phases on Karnataka RERA <ArrowRight />
                  {NEW_TAB}
                </a>
              </li>
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

      <Section id="commute" tone="surface" labelledBy="commute-title" className={s.anchor}>
        <SectionHead
          id="commute-title"
          title="Check the drive before you decide"
          line="Traffic changes by the hour, so we won’t quote a number. See today’s real route from the site."
        />
        <CommuteChecker />
      </Section>

      <EnquirySection defaultInterest={e.name} n="" />
      <StickyVisit />
    </>
  );
}
