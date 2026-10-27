import Image from "next/image";
import { ComposeButton } from "@/components/ComposeButton";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Panel, Section } from "@/components/ds";
import { elements } from "@/lib/elements";
import { company, homemakers } from "@/lib/site";
import s from "./EnquirySection.module.css";

/*
 * The visit panel: the invitation, then two cards of equal height side by side: the three ways to
 * reach Disha, stacked, and the form. `n` is the old section number, still accepted.
 */
export function EnquirySection({ defaultInterest }: { defaultInterest?: string; n?: string }) {
  // On the project on sale, enquiries go to its own sales line and inbox; elsewhere, to the office.
  const forElements = defaultInterest === elements.name;
  const phones = forElements ? [elements.phone] : company.phones;
  const email = forElements ? elements.email : company.email;
  const topic = forElements ? elements.name : undefined;
  const guna = homemakers[0];
  return (
    <Section id="enquire" tone="surface" labelledBy="enquire-title">
      <div className={s.intro}>
        <h2 id="enquire-title" className={`display ${s.title}`}>
          Let’s meet for coffee.
        </h2>
        <p className={s.line}>
          It’s the favourite invitation of our founder {guna.short}. It means he wants to explain things properly, as plainly as you need.
        </p>
        <p className={s.byline}>
          <Image src={guna.portrait} alt="" width={96} height={96} sizes="48px" className={s.face} />
          <span>
            {guna.name}
            <small>{guna.role}</small>
          </span>
        </p>
      </div>
      <div className={s.grid}>
        <ul className={s.reach} aria-label="Other ways to reach us">
          <li>
            <span className={s.label}>{forElements ? "Call sales" : "Call"}</span>
            {phones.map((p) => (
              <a key={p.href} href={p.href} className={s.value}>
                {p.display}
              </a>
            ))}
            <span className={s.note}>{forElements ? `${elements.shortName} sales team` : "Our corporate office"}</span>
          </li>
          <li>
            <span className={s.label}>WhatsApp</span>
            <ComposeButton channel="whatsapp" topic={topic} className={s.value}>
              Message us
            </ComposeButton>
            <span className={s.note}>Write here and it opens in WhatsApp, ready to send</span>
          </li>
          <li>
            <span className={s.label}>Email</span>
            <ComposeButton channel="email" topic={topic} className={s.value}>
              {/* A long address may wrap, but only after the @. */}
              {email.split("@")[0]}@<wbr />
              {email.split("@")[1]}
            </ComposeButton>
            <span className={s.note}>Write here and it opens in your email app</span>
          </li>
        </ul>
        <Panel className={s.form}>
          <h3 className={`display ${s.formTitle}`}>Book a site visit</h3>
          <p className={s.formLine}>Tell us a little about what you’re looking for. You’ll see the message before you send it.</p>
          <EnquiryForm defaultInterest={defaultInterest} />
        </Panel>
      </div>
    </Section>
  );
}
