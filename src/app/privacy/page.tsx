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
          <p className={s.updated}>Last updated 27 October 2026.</p>

          <h2>Cookies and analytics</h2>
          <p>
            This website runs no analytics and no advertising or tracking tools. If we ever add one, it will stay switched off until you accept it
            in the notice at the bottom of the page. Your choice is saved in your browser, and you can change it at any time.{" "}
            <CookieSettingsLink className="text-link" />
          </p>

          <h2>What is saved in your browser</h2>
          <p>The site saves two small items on your device only. Neither is a tracking cookie, and neither is sent to us.</p>
          <ul>
            <li>
              <code>disha-consent</code>: your cookie choice and the date you made it.
            </li>
            <li>
              <code>disha-checklist-v1</code>: the points you have ticked on the homebuyer’s checklist, so you can come back to it. “Start over”
              clears it, as does clearing your browser’s site data.
            </li>
          </ul>
          <p>
            While the site is being reviewed, a Feedback tab may appear. If you send feedback with it, the site also saves a random number (
            <code>disha-visitor</code>) so that notes from the same browser can be read together. It is sent only with your feedback.
          </p>

          <h2>When you send us a message</h2>
          <p>
            The site visit booker, the message form and the enquiry form open WhatsApp or your email app with the message ready, and you choose
            whether to send it. When you press a Send button (or Continue on the enquiry form), we also keep what you entered: your name, number,
            email if you gave one, what you asked about, the date and time you chose, the page you sent it from, the page that linked you there and
            your browser type. We keep it on our website’s servers so that we can reply
            even if your message does not reach us. We use it only to reply to you about your enquiry or site visit, and we do not sell it or give it
            to anyone else. A message you send on WhatsApp or by email reaches Disha Habitat like any other message, and WhatsApp and your email
            provider handle it under their own policies.
          </p>

          <h2>Our website host</h2>
          <p>
            Like any website, ours is served by a hosting company, whose servers log every request (such as your IP address, the pages asked for
            and your browser type) to run the site and keep it secure. When you send a request, your IP address is also used for a short while,
            in memory only, to stop the same connection sending too many; it is not stored with your request. The fonts, photographs and the map
            of our communities are served from this site itself (the map is drawn from OpenStreetMap data), so opening a page contacts no other
            company.
          </p>

          <h2>Calculators</h2>
          <p>
            The EMI calculator and the affordability tool work out their figures on your device. What you enter there is never sent anywhere. The
            commute checker only opens Google Maps, with the place you typed, when you press its button.
          </p>

          <h2>Maps and links</h2>
          <p>
            Other services are contacted only when you tap a link to them: Google Maps (directions and the commute checker), WhatsApp, your email
            app, Instagram, Facebook, LinkedIn, YouTube, MyGate, the Pursuit of the Elements project website and the Karnataka RERA website. They open in a new tab or app and have their own
            privacy policies. Nothing from them loads on this site until you follow the link.
          </p>

          <h2>Your rights</h2>
          <p>
            To see, correct or delete what we hold about you, write to <a href={`mailto:${company.email}`}>{company.email}</a> or see our{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </Section>
    </>
  );
}
