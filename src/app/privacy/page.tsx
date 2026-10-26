import type { Metadata } from "next";
import Link from "next/link";
import { CookieSettingsLink } from "@/components/consent/ConsentBanner";
import { Breadcrumbs, PageIntro, Section } from "@/components/ds";
import { pageMeta } from "@/lib/launch";
import { company } from "@/lib/site";
import s from "./page.module.css";

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description: "What this website does and does not do with your information.",
  path: "/privacy",
});

/* A plain statement of what this website actually does with information. It describes the site as built. */
export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        above={<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />}
        title="Privacy"
        line="What this website does, and does not do, with your information."
      />
      <Section width="measure">
        <div className={s.body}>
          <h2>Cookies and analytics</h2>
          <p>
            This website runs no analytics and no advertising or tracking tools. If we ever add one, it will stay switched off until you accept it
            in the notice at the bottom of the page. Your choice is saved in your browser, and you can change it at any time.{" "}
            <CookieSettingsLink className="text-link" />
          </p>

          <h2>What is saved in your browser</h2>
          <p>The site saves a few small items on your device only. None of them is a tracking cookie.</p>
          <ul>
            <li>
              <code>disha-consent</code>: your cookie choice and the date you made it.
            </li>
            <li>
              <code>disha-checklist-v1</code>: the points you have ticked on the homebuyer’s checklist, so you can come back to it. “Start over”
              clears it, as does clearing your browser’s site data.
            </li>
            <li>
              <code>disha-visitor</code>: a random number, saved only when you send a note with the Feedback tab, so we can see which notes came
              from the same person.
            </li>
          </ul>

          <h2>When you send us a message</h2>
          <p>
            The site visit booker, the message form and the enquiry form open WhatsApp or your email app with the message ready, and you choose
            whether to send it. When you press Send, or Continue on the enquiry form, we also keep the details you entered (your name, number, email,
            what you asked about and the date and time you chose) so that we can reply even if the message does not reach us. We use them only to
            reply to you about your enquiry or site visit, and we do not sell or share them. A message you send on WhatsApp or by email reaches
            Disha Habitat like any other message.
          </p>

          <h2>The Feedback tab</h2>
          <p>
            If you use the Feedback tab, your note is sent to us with the page and the part of the page you pointed at, your screen size and, if
            you add them, your name and email. We use it to improve the website.
          </p>

          <h2>Calculators</h2>
          <p>The EMI calculator and the other planning tools work out their figures on your device. What you enter is never sent anywhere.</p>

          <h2>Maps and links</h2>
          <p>
            Some links open Google Maps, WhatsApp, Instagram, Facebook, LinkedIn or YouTube in a new tab. Those services have their own privacy
            policies. Nothing from them loads on this site until you follow the link.
          </p>

          <h2>Your rights</h2>
          <p>
            Questions, or want us to delete your messages? Write to <a href={`mailto:${company.email}`}>{company.email}</a> or see our{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </Section>
    </>
  );
}
