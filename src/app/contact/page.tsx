import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { VisitBooker } from "@/components/VisitBooker";
import { ComposeButton } from "@/components/ComposeButton";
import { SocialCards } from "@/components/Socials";
import { Lines, Reveal } from "@/components/ui";
import { company } from "@/lib/site";
import { elements } from "@/lib/elements";
import { projectsByHandover } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Contact and site visits",
  description: "Book a site visit, call, WhatsApp or write to Disha Habitat, Whitefield Main Road, Bengaluru.",
};

const mapQuery = encodeURIComponent(`${company.legalName}, ${company.office.lines.join(", ")}`);

const channels = [
  { Icon: Phone, title: "Call sales", value: elements.phone.display, note: "Pursuit of the Elements and new enquiries", href: elements.phone.href, cta: "Call now" },
  { Icon: MessageCircle, title: "WhatsApp", value: elements.phone.display, note: "Write your message here; it opens in WhatsApp ready to send", compose: "whatsapp" as const, cta: "Write a message" },
  { Icon: Phone, title: "Call the office", value: company.phones[0].display, note: `or ${company.phones[1].display}`, href: company.phones[0].href, cta: "Call now" },
  { Icon: Mail, title: "Email", value: company.email, note: "Write your message here; it opens in your email app", compose: "email" as const, cta: "Write an email" },
];

const next = [
  { n: "1", title: "Send your request", text: "Choose where and when. Your details go straight to our sales team on WhatsApp." },
  { n: "2", title: "We confirm the time", text: "Someone from Disha calls or messages you to confirm the visit and answer first questions." },
  { n: "3", title: "Meet us", text: "Walk the site or sit down for coffee. We’ll explain everything, as plainly as you need." },
];

export default function ContactPage() {
  return (
    <>
      {/* Opening: the invitation and every way to reach us */}
      <section data-tone="dark" aria-labelledby="contact-title" className="surface-deep grain relative overflow-hidden pb-16 pt-36 md:pb-20 md:pt-44">
        <Image src="/images/central-park/clubhouse-dusk.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-25" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-deep/70 via-forest-deep/80 to-forest-deep" />
        <div className="shell">
          <div className="max-w-3xl">
            <p className="eyebrow anim-fade text-paper/70">Contact and site visits</p>
            <h1 id="contact-title" className="serif anim-rise mt-5 text-[clamp(2.8rem,6vw,5.6rem)] leading-[1.02]">
              Let’s meet <em>for coffee.</em>
            </h1>
            <p className="anim-fade-up mt-6 max-w-xl text-[1.1rem] leading-relaxed text-paper/80" style={{ "--d": "250ms" } as CSSProperties}>
              It’s our founder’s favourite invitation. Visit a site, sit down with us at the office, or simply ask a question. Whatever
              suits you.
            </p>
            <div className="anim-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--d": "400ms" } as CSSProperties}>
              <a href="#book" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-paper px-6 font-semibold text-ink transition-colors hover:bg-white">
                Book a site visit
              </a>
              <ComposeButton
                channel="whatsapp"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-paper/30 bg-white/5 px-6 font-medium transition-colors hover:border-paper/60"
              >
                <MessageCircle aria-hidden className="size-4 text-[#5ad17a]" /> Message us on WhatsApp
              </ComposeButton>
            </div>
          </div>

          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 80}>
                {(() => {
                  const body = (
                    <>
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-paper/10">
                        <c.Icon aria-hidden className="size-[1.1rem]" strokeWidth={1.6} />
                      </span>
                      <span className="mt-5 text-sm text-paper/60">{c.title}</span>
                      <span className="mt-1 break-all text-[1.15rem] font-medium">{c.value}</span>
                      <span className="mt-1 text-sm text-paper/55">{c.note}</span>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brass">
                        {c.cta} <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </>
                  );
                  const cls = "card-dark group flex h-full w-full flex-col p-5 text-left transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-paper/30";
                  return "compose" in c && c.compose ? (
                    <ComposeButton channel={c.compose} className={cls}>
                      {body}
                    </ComposeButton>
                  ) : (
                    <a href={"href" in c ? c.href : undefined} className={cls}>
                      {body}
                    </a>
                  );
                })()}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Booking */}
      <section id="book" data-tone="light" aria-labelledby="book-title" className="surface-ivory py-20 md:py-28">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="eyebrow text-mute">Book a site visit</p>
            <Lines id="book-title" className="serif mt-4 text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[1.04]" lines={["Four steps,", <em key="e">under a minute.</em>]} />
            <div className="mt-8">
              <VisitBooker />
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-4 lg:pt-[7.5rem]">
            <div className="card p-6">
              <h2 className="serif text-[1.6rem]">What happens next</h2>
              <ol className="mt-5 space-y-5">
                {next.map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-paper">{s.n}</span>
                    <div>
                      <p className="font-semibold">{s.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-mute">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="card overflow-hidden">
              <iframe
                title="Map of the Disha Habitat office on Whitefield Main Road"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-56 w-full border-0 grayscale-[30%]"
              />
              <div className="p-5">
                <p className="text-sm text-mute">Corporate office</p>
                <address className="mt-1 not-italic leading-relaxed">
                  <span className="font-semibold">{company.legalName}</span>
                  <br />
                  {company.office.lines.join(", ")}
                </address>
                <a
                  href={company.office.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
                >
                  Get directions <ArrowUpRight aria-hidden className="size-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Social */}
      <section data-tone="light" aria-labelledby="follow-title" className="surface-stone py-14 md:py-16">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-mute">Follow along</p>
              <h2 id="follow-title" className="serif mt-3 text-[clamp(1.9rem,3vw,2.6rem)] leading-tight">
                Life at Disha, <em>day to day.</em>
              </h2>
            </div>
          </div>
          <div className="mt-8">
            <SocialCards />
          </div>
        </div>
      </section>

      {/* Where the communities are */}
      <section data-tone="dark" aria-labelledby="sites-title" className="surface-forest grain py-20 md:py-28">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-paper/65">Our communities</p>
              <Lines id="sites-title" className="serif mt-4 text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[1.04]" lines={["Where to", <em key="e">find us.</em>]} />
            </div>
            <Link href="/homes" className="inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-paper/80 hover:text-paper">
              Compare all communities <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal as="li" className="sm:col-span-2 lg:col-span-1">
              <Link href={elements.href} className="card-dark group flex h-full gap-4 p-3">
                <span className="relative block aspect-square w-24 shrink-0 overflow-hidden rounded-lg">
                  <Image src={elements.cover.src} alt="" fill sizes="96px" className="object-cover" />
                </span>
                <span className="py-1">
                  <span className="rounded-full bg-cyan px-2 py-0.5 text-[0.7rem] font-semibold text-forest-deep">Now selling</span>
                  <span className="serif mt-2 block text-[1.4rem] leading-tight">{elements.shortName}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-sm text-paper/65">
                    <MapPin aria-hidden className="size-3.5" /> {elements.locality}
                  </span>
                </span>
              </Link>
            </Reveal>
            {projectsByHandover.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i + 1) * 60}>
                <div className="card-dark flex h-full gap-4 p-3">
                  <Link href={`/homes/${p.slug}`} className="relative block aspect-square w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image src={p.cover.src} alt="" fill sizes="96px" className="object-cover" />
                    <span className="sr-only">{p.name}</span>
                  </Link>
                  <span className="min-w-0 py-1">
                    <span className="text-xs text-paper/55">Delivered {p.handoverYear}</span>
                    <Link href={`/homes/${p.slug}`} className="serif mt-1 block text-[1.4rem] leading-tight hover:underline">
                      {p.shortName}
                    </Link>
                    <span className="mt-1 block text-sm leading-snug text-paper/65">{p.address ?? p.locality}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.address ?? p.locality}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brass"
                    >
                      Directions <ArrowUpRight aria-hidden className="size-3.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
