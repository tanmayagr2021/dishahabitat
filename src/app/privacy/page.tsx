import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this website does and does not do with your information.",
};

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
          Questions? Write to{" "}
          <Link href="/contact" className="underline underline-offset-4">
            {company.email}
          </Link>{" "}
          via our contact page.
        </p>
      </div>
    </section>
  );
}
