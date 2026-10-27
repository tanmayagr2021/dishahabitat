import type { Metadata } from "next";
import Link from "next/link";
import { ComposeButton } from "@/components/ComposeButton";
import { Breadcrumbs, PageIntro, Section, SectionHead } from "@/components/ds";
import { SocialCards } from "@/components/Socials";
import { VisitBooker } from "@/components/VisitBooker";
import { elements } from "@/lib/elements";
import { pageMeta } from "@/lib/launch";
import { siteDirectionsUrl } from "@/lib/proof";
import { company } from "@/lib/site";
import s from "./page.module.css";

export const metadata: Metadata = pageMeta({
  title: "Contact and site visits",
  description: "Book a site visit, call, WhatsApp or write to Disha Habitat, Whitefield Main Road, Bengaluru.",
  path: "/contact",
});

const officeDirections = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.legalName}, ${company.office.lines.join(", ")}`)}`;

export default function ContactPage() {
  return (
    <>
      <PageIntro
        above={<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Contact" }]} />}
        title="Let’s meet for coffee."
        line="It’s Guna’s favourite invitation. Visit a site, sit down with us at the office, or simply ask a question. Whatever suits you."
      >
        <div className={s.hero}>
          <a href="#book" className="btn btn-primary">
            Book a site visit
          </a>
          <ComposeButton channel="whatsapp" className="btn btn-soft">
            Message us on WhatsApp
          </ComposeButton>
        </div>
      </PageIntro>

      <Section space="tight" label="Ways to reach us">
        <ul className={`${s.reach} reveal-stagger`}>
          <li>
            <p className={s.label}>Call sales</p>
            <a href={elements.phone.href} className={s.value}>
              {elements.phone.display}
            </a>
            <p className={s.note}>Pursuit of the Elements and new enquiries</p>
          </li>
          <li>
            <p className={s.label}>WhatsApp</p>
            <ComposeButton channel="whatsapp" className={s.value}>
              Message us
            </ComposeButton>
            <p className={s.note}>Write here and it opens in WhatsApp, ready to send</p>
          </li>
          <li>
            <p className={s.label}>Call the office</p>
            <a href={company.phones[0].href} className={s.value}>
              {company.phones[0].display}
            </a>
            <p className={s.note}>Our corporate office</p>
          </li>
          <li>
            <p className={s.label}>Email</p>
            <ComposeButton channel="email" className={s.value}>
              {company.email}
            </ComposeButton>
            <p className={s.note}>Write here and it opens in your email app</p>
          </li>
        </ul>
      </Section>

      <Section tone="surface" labelledBy="book-title">
        <div className="reveal">
          <SectionHead
            id="book-title"
            title="Book a site visit"
            line="Four short steps. Send the request from your own WhatsApp or email, and someone from Disha confirms the time with you."
          />
        </div>
        <div className={s.layout}>
          <div id="book" className={s.booker}>
            <VisitBooker />
          </div>
          <aside className={s.places} aria-labelledby="find-title">
            <h3 id="find-title" className={s.label}>
              Where to find us
            </h3>
            <article>
              <p className={s.label}>Sales site, now selling</p>
              <h4 className={`display ${s.place}`}>
                <Link href={elements.href}>{elements.shortName}</Link>
              </h4>
              <p className={s.note}>{elements.locality}</p>
              <a href={siteDirectionsUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                Get directions<span className="sr-only"> to {elements.shortName} (opens in a new tab)</span>
              </a>
            </article>
            <article>
              <p className={s.label}>Corporate office</p>
              <h4 className={`display ${s.place}`}>{company.legalName}</h4>
              <address className={s.note}>{company.office.lines.join(", ")}</address>
              <a href={officeDirections} target="_blank" rel="noopener noreferrer" className="text-link">
                Get directions<span className="sr-only"> to the office (opens in a new tab)</span>
              </a>
            </article>
            <Link href="/homes" className="text-link">
              All communities
            </Link>
          </aside>
        </div>
      </Section>

      <Section tone="surface" labelledBy="follow-title">
        <div className="reveal">
          <SectionHead id="follow-title" title="Follow along" line="Life at Disha, day to day." />
        </div>
        <SocialCards />
      </Section>
    </>
  );
}
