import type { Metadata } from "next";
import { pageMeta } from "@/lib/launch";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { company } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description: "What this website does and does not do with your information.",
  path: "/privacy",
});

/* A plain statement of what this website actually does with information. It describes the site as built. */
const points = [
  {
    title: "We do not store what you type",
    text: "The site visit booker, the message form and the enquiry forms do not send anything to a server. When you press Send, your own WhatsApp or email app opens with the message, and you choose whether to send it.",
  },
  {
    title: "Your checklist stays on your device",
    text: "Progress on the homebuyer’s checklist is saved in your browser only, so you can come back to it. “Start over” clears it, as does clearing your browser’s site data.",
  },
  {
    title: "The EMI calculator runs in your browser",
    text: "Figures you enter are calculated on your device and are never sent anywhere.",
  },
  {
    title: "When you send us a message",
    text: "If you choose to send a WhatsApp message or an email, it reaches Disha Habitat like any other message. We use your name, number and email only to reply to you about your enquiry or site visit, and we do not sell or share them.",
  },
  {
    title: "The opening film",
    text: "So the logo film plays only once per visit, your browser remembers for that visit that you have seen it. Nothing else is recorded.",
  },
  {
    title: "Maps and links",
    text: "The contact page shows a Google Map, and some links open WhatsApp, Instagram, Facebook, LinkedIn or YouTube. Those services have their own privacy policies.",
  },
];

export default function PrivacyPage() {
  return (
    <section data-tone="light" className="surface-ivory pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="shell max-w-3xl">
        <Breadcrumbs tone="light" trail={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
        <h1 className="serif mt-6 t-hero-sm leading-[1.04]">Privacy</h1>
        <p className="mt-4 text-[1.08rem] leading-relaxed text-mute">What this website does, and does not do, with your information.</p>
        <ul className="mt-10 space-y-4">
          {points.map((p) => (
            <li key={p.title} className="card p-6">
              <h2 className="serif text-[1.5rem] leading-tight">{p.title}</h2>
              <p className="mt-2 leading-relaxed text-ink/75">{p.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-mute">
          Questions, or want us to delete your messages? Write to{" "}
          <a href={`mailto:${company.email}`} className="underline underline-offset-4">
            {company.email}
          </a>{" "}
          or see our{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
