import type { Metadata } from "next";
import { pageMeta } from "@/lib/launch";
import Link from "next/link";
import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight, Award, HardHat, KeyRound, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { GalleryGrid } from "@/components/Lightbox";
import { PageHero } from "@/components/PageHero";
import { ComposeButton } from "@/components/ComposeButton";
import { EnquirySection } from "@/components/home/EnquirySection";
import { ButtonLink, Label, Lines, Reveal, SlashBreaks } from "@/components/ui";
import { elements as e } from "@/lib/elements";
import { CommuteChecker } from "@/components/CommuteChecker";
import { award, homesHandedOver, reraSearch } from "@/lib/proof";
import { formatIndian } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: e.name,
  description: `${e.name}, ${e.locality}. ${e.offer}. ${e.intro}`,
  path: e.href,
  image: { url: e.cover.src, width: e.cover.width, height: e.cover.height, alt: e.cover.alt },
});

const galleryTiles = [
  "col-span-2 aspect-[16/10] md:col-span-8 md:aspect-[16/10]",
  "aspect-[4/5] md:col-span-4 md:aspect-auto",
  "aspect-[4/5] md:col-span-4 md:aspect-[4/5]",
  "col-span-2 aspect-[16/10] md:col-span-8 md:aspect-auto",
  "aspect-square md:col-span-6 md:aspect-[16/10]",
  "aspect-square md:col-span-6 md:aspect-[16/10]",
  "col-span-2 aspect-[16/10] md:col-span-4 md:aspect-[4/5]",
  "col-span-2 aspect-[16/10] md:col-span-4 md:aspect-[4/5]",
  "col-span-2 aspect-[16/10] md:col-span-4 md:aspect-[4/5]",
  "col-span-2 aspect-[16/10] md:col-span-6 md:aspect-[16/10]",
  "col-span-2 aspect-[16/10] md:col-span-6 md:aspect-[16/10]",
];

export default function ElementsPage() {
  return (
    <div style={{ "--accent": e.hue } as CSSProperties}>
      <PageHero
        label={
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-2 bg-cyan" />
            {e.status} · {e.locality}
          </span>
        }
        title={
          <>
            Pursuit of the <em>Elements</em>
          </>
        }
        intro={
          <>
            <span className="serif block text-[1.8rem] italic leading-tight text-paper">{e.tagline}</span>
            <span className="mt-3 block">
              {e.offer} and 4 & 5 BHK villas, on 20 acres at Gunjur in East Bengaluru.
            </span>
            <span className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1 backdrop-blur-sm">
                <ShieldCheck aria-hidden className="size-3.5" /> RERA registered
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brass px-3 py-1 font-semibold text-forest-deep">
                <Award aria-hidden className="size-3.5" /> {award.title}
              </span>
            </span>
          </>
        }
        image={e.cover}
        aside={
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <ButtonLink href="#enquire" variant="paper">
              Book a site visit
            </ButtonLink>
            <ComposeButton
              channel="whatsapp"
              topic={e.name}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-paper/30 bg-white/[0.04] px-5 text-[0.95rem] font-medium backdrop-blur-sm hover:border-paper/60"
            >
              Message us on WhatsApp
            </ComposeButton>
          </div>
        }
      />

      {/* At a glance */}
      <section data-tone="dark" aria-labelledby="glance-title" className="surface-forest grain py-16 md:py-20">
        <div className="shell">
          <h2 id="glance-title" className="sr-only">
            At a glance
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 md:grid-cols-3 lg:grid-cols-6">
            {e.facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 60} className="border-t border-paper/25 py-5">
                <dt className="label text-paper/65">{f.label}</dt>
                <dd className="serif mt-2 text-[1.9rem] leading-tight">{f.value}</dd>
              </Reveal>
            ))}
          </dl>

          <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <Label n="01" className="text-paper/65">
                The idea
              </Label>
              <Lines
                id="idea-title"
                className="serif mt-5 t-section"
                lines={["Inspired by", <em key="e">the five elements.</em>]}
              />
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="The five elements">
                {e.fiveElements.map((el, i) => (
                  <li key={el} className="serif text-[clamp(1.7rem,3vw,2.8rem)] leading-tight">
                    {el}
                    {i < e.fiveElements.length - 1 && <span aria-hidden className="ml-6 text-cyan">·</span>}
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-2xl text-[1.12rem] leading-relaxed text-paper/85">{e.intro}</p>
              <p className="mt-4 max-w-2xl text-[1.12rem] leading-relaxed text-paper/85">
                Come home to Disha Pursuit of the Elements and let it all come to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The homes */}
      <section data-tone="dark" aria-labelledby="homes-title" className="surface-charcoal grain py-16 md:py-20">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Label n="02" className="text-paper/60">
              The homes
            </Label>
            <Lines
              id="homes-title"
              className="serif mt-5 t-section"
              lines={["Seven towers", <em key="e">and a row of villas.</em>]}
            />
            <p className="mt-6 max-w-sm leading-relaxed text-paper/70">
              2, 3 and 4 BHK apartments, and 4 and 5 BHK villas. Ask us for the floor plans of the home you’re
              considering.
            </p>
          </div>
          <ul className="lg:col-span-7 lg:col-start-6">
            {e.towers.map((t) => (
              <li key={t.name} className="grid gap-1 border-t border-paper/15 py-5 last:border-b sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
                <p>
                  <span className="serif text-[1.9rem] leading-tight">{t.name}</span>
                  <span className="ml-3 text-paper/60">{t.which}</span>
                </p>
                <p className="text-sm text-paper/65 sm:text-right">{t.floors}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section data-tone="light" aria-labelledby="gallery-title" className="surface-stone py-16 md:py-20">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label n="03" className="text-mute">
                Gallery
              </Label>
              <h2 id="gallery-title" className="serif mt-5 t-section">
                A look <em>inside</em>
              </h2>
            </div>
            <p className="text-sm text-mute">Artist’s impressions · select any image to enlarge</p>
          </div>
          <div className="mt-10">
            <GalleryGrid
              items={[...e.gallery, e.masterPlan]}
              tileClasses={galleryTiles}
              gridClassName="grid grid-cols-2 gap-2 md:grid-cols-12 md:gap-3"
              sizes="(min-width: 768px) 60vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section data-tone="light" aria-labelledby="amenities-title" className="surface-ivory py-16 md:py-20">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Label n="04" className="text-mute">
              Amenities
            </Label>
            <Lines
              id="amenities-title"
              className="serif mt-5 t-section"
              lines={["Over 40,", <em key="e">indoors and out.</em>]}
            />
            <p className="mt-6 max-w-sm leading-relaxed text-mute">
              Not ten or twenty, but more than 40 mindful amenities, created to bring you outdoors and closer to nature.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h3 className="serif text-[1.9rem]">
              The clubhouse <span className="text-mute">· 1,35,000+ sq ft</span>
            </h3>
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
              {e.clubhouse.map((a) => (
                <li key={a} className="flex items-center gap-3 border-t border-ink/12 py-3">
                  <span aria-hidden className="size-1.5 shrink-0 bg-earth" />
                  {a}
                </li>
              ))}
            </ul>
            <h3 className="serif mt-12 text-[1.9rem]">Outdoors</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {e.outdoor.map((a) => (
                <li key={a} className="border border-ink/15 px-4 py-2 text-[0.95rem]">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Commute */}
      <section id="commute" data-tone="light" aria-labelledby="commute-title" className="surface-stone scroll-mt-24 py-16 md:py-20">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Label n="05" className="text-mute">
                Your commute
              </Label>
              <Lines id="commute-title" className="serif mt-5 t-section" lines={["Check the drive", <em key="e">before you decide.</em>]} />
            </div>
            <p className="max-w-md leading-relaxed text-mute lg:col-span-4 lg:col-start-9">
              Gunjur sits between Whitefield and Sarjapur Road in East Bengaluru. Bengaluru traffic changes by the hour, so we
              won’t quote you a number. See today’s real route instead.
            </p>
          </div>
          <div className="mt-10">
            <CommuteChecker />
          </div>
        </div>
      </section>

      {/* Papers, progress and proof */}
      <section id="papers" data-tone="light" aria-labelledby="papers-title" className="surface-ivory scroll-mt-24 py-16 md:py-20">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Label n="06" className="text-mute">
                Papers and progress
              </Label>
              <Lines id="papers-title" className="serif mt-5 t-section" lines={["Check everything.", <em key="e">We’d want you to.</em>]} />
            </div>
            <p className="max-w-md leading-relaxed text-mute lg:col-span-4 lg:col-start-9">
              The registration numbers, the construction photographs and our record on every community we have built. Ask us for
              any document you want to see.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <article className="card flex flex-col p-6">
              <ShieldCheck aria-hidden className="size-6 text-forest" strokeWidth={1.6} />
              <h3 className="serif mt-4 text-[1.5rem] leading-tight">RERA registered</h3>
              <ul className="mt-3 space-y-3">
                {e.rera.map((r) => (
                  <li key={r.no}>
                    <span className="block text-sm font-semibold">{r.phase}</span>
                    <span className="block text-[0.82rem] tabular-nums text-mute"><SlashBreaks text={r.no} /></span>
                  </li>
                ))}
              </ul>
              <a href={reraSearch} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-semibold underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                Verify on Karnataka RERA <ArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </article>

            <article className="card flex flex-col p-6">
              <HardHat aria-hidden className="size-6 text-forest" strokeWidth={1.6} />
              <h3 className="serif mt-4 text-[1.5rem] leading-tight">Progress, every quarter</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-mute">
                Photographs of every tower and the villas, published each quarter. The latest is {e.latestUpdate}.
              </p>
              <a href={e.updates} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-semibold underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                See construction updates <ArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </article>

            <article className="card flex flex-col p-6">
              <KeyRound aria-hidden className="size-6 text-forest" strokeWidth={1.6} />
              <h3 className="serif mt-4 text-[1.5rem] leading-tight">Our record</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-mute">
                {formatIndian(homesHandedOver)} homes handed over across five communities since 2014. Every start and handover date is published.
              </p>
              <Link href="/#record" className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-semibold underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                See every timeline
              </Link>
            </article>

            <article className="surface-forest flex flex-col overflow-hidden rounded-2xl p-6">
              <Award aria-hidden className="size-6 text-brass" strokeWidth={1.6} />
              <h3 className="serif mt-4 text-[1.5rem] leading-tight">{award.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-paper/75">
                {award.honour}: {e.shortName}, {award.citation}.
              </p>
              <div className="mt-auto pt-5">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-ink">
                  <Image src={award.image} alt={`${award.title} ${award.honour} for ${e.name}`} fill sizes="(min-width: 1024px) 20vw, 90vw" className="object-cover" />
                </div>
              </div>
            </article>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-ink/10 pt-8 md:flex-row md:items-center">
            <div>
              <p className="label text-mute">Talk to the sales team</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1">
                <a href={e.phone.href} className="inline-flex min-h-11 items-center gap-2 text-[1.1rem] font-medium">
                  <Phone aria-hidden className="size-4" strokeWidth={1.6} /> {e.phone.display}
                </a>
                <ComposeButton channel="email" topic={e.name} className="inline-flex min-h-11 items-center break-all text-left text-mute hover:text-ink">
                  {e.email}
                </ComposeButton>
                <a href={e.website.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-mute hover:text-ink">
                  {e.website.label} <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </div>
            <ComposeButton
              channel="whatsapp"
              topic="Documents and approvals"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-forest px-5 font-semibold text-paper hover:bg-forest-2"
            >
              <MessageCircle aria-hidden className="size-4" strokeWidth={1.8} /> Ask for any document
            </ComposeButton>
          </div>
        </div>
      </section>

      <EnquirySection defaultInterest={e.name} n="" />

      <nav aria-label="Our delivered communities" data-tone="light" className="surface-ivory py-12">
        <div className="shell flex flex-wrap items-center justify-between gap-4">
          <p className="text-mute">Five communities delivered since 2014.</p>
          <Link href="/homes" className="font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
            See all our homes
          </Link>
        </div>
      </nav>
    </div>
  );
}
