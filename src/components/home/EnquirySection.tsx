import { ComposeButton } from "@/components/ComposeButton";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Panel, Section } from "@/components/ds";
import { elements } from "@/lib/elements";
import { company, homemakers } from "@/lib/site";
import s from "./EnquirySection.module.css";

/* `n` is the old section number; it is accepted so existing callers keep working. */
export function EnquirySection({ defaultInterest }: { defaultInterest?: string; n?: string }) {
  // On the project on sale, enquiries go to its own sales line and inbox; elsewhere, to the office.
  const forElements = defaultInterest === elements.name;
  const phones = forElements ? [elements.phone] : company.phones;
  const email = forElements ? elements.email : company.email;
  const guna = homemakers[0];
  return (
    <Section id="enquire" tone="surface" labelledBy="enquire-title">
      <div className={s.grid}>
        <div className={s.text}>
          <h2 id="enquire-title" className={`display ${s.title}`}>
            Let’s meet for coffee.
          </h2>
          <p className={s.line}>
            It’s the favourite invitation of our founder {guna.short}. It means he wants to explain things properly, as plainly as you need.
          </p>
          <dl className={s.reach}>
            <div>
              <dt>Call</dt>
              <dd>
                {phones.map((p) => (
                  <a key={p.href} href={p.href}>
                    {p.display}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt>Write</dt>
              <dd>
                <ComposeButton channel="email" topic={forElements ? elements.name : undefined} className={s.write}>
                  {email}
                </ComposeButton>
              </dd>
            </div>
          </dl>
        </div>
        <Panel className={s.form}>
          <h3 className={`display ${s.formTitle}`}>Book a site visit</h3>
          <p className={s.formLine}>Tell us a little about what you’re looking for. You’ll see the message before you send it.</p>
          <EnquiryForm defaultInterest={defaultInterest} />
        </Panel>
      </div>
    </Section>
  );
}
