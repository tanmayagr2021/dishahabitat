"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { SlashBreaks } from "@/components/ui";
import { elements } from "@/lib/elements";
import { homemakers, formatIndian } from "@/lib/site";
import { commuteDestinations, directionsUrl, homesHandedOver, quickestBuild, residentRating } from "@/lib/proof";

/*
 * The heart of the home page: the visitor's own wish list for a home, in their words, and the
 * founders' answer to each, with proof beside it. Research behind it (docs/RESEARCH-BRIEF.md):
 * buyers decide on facts but need to picture the life first; specific, concrete answers persuade;
 * proof must sit next to every claim. Every figure here is published or linked to its source.
 */
type Need = {
  key: string;
  wish: string;
  answer: string;
  figure: ReactNode;
  figureNote: string;
  image: { src: string; alt: string; render?: boolean };
  link: { href: string; label: string; external?: boolean };
  extra?: ReactNode;
};

const needs: Need[] = [
  {
    key: "keys",
    wish: "Keys on the day they promise.",
    answer: `We have never left a community unfinished. ${formatIndian(homesHandedOver)} homes across five communities are lived in today, and we publish when each one started and when its keys were handed over.`,
    figure: formatIndian(homesHandedOver),
    figureNote: `homes handed over since 2014. Quickest build: ${quickestBuild.name}, ${quickestBuild.months} months.`,
    image: { src: "/images/central-park/front-door.jpg", alt: "The front door of a home at Disha Central Park" },
    link: { href: "#record", label: "See every timeline" },
  },
  {
    key: "papers",
    wish: "Papers I don’t have to worry about.",
    answer: `${elements.shortName} is registered with Karnataka RERA in two phases, and both numbers are printed on every page we publish. Bring our checklist of must-knows and ask us about any of them.`,
    figure: "RERA",
    figureNote: "registered, Phase I and Phase II",
    image: { src: "/images/checklist/khata.webp", alt: "Property papers laid out on a desk" },
    link: { href: "/checklist", label: "The homebuyer’s checklist" },
    extra: (
      <ul className="mt-5 space-y-2">
        {elements.rera.map((r) => (
          <li key={r.no} className="flex items-start gap-2 text-[0.82rem] leading-snug text-ink/70">
            <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-forest" strokeWidth={1.8} />
            <span>
              <span className="font-semibold text-ink">{r.phase}</span> <span><SlashBreaks text={r.no} /></span>
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    key: "commute",
    wish: "A commute I can live with.",
    answer: `${elements.shortName} is in ${elements.locality}, between Whitefield and Sarjapur Road. Don’t take our word for the drive: check today’s real time to where you work.`,
    figure: "Gunjur",
    figureNote: "East Bengaluru, between Whitefield and Sarjapur Road",
    image: { src: "/images/pursuit-of-the-elements/courts-aerial.webp", alt: "Artist’s impression of Pursuit of the Elements from above", render: true },
    link: { href: `${elements.href}#commute`, label: "Check your commute" },
    extra: (
      <div className="mt-5 flex flex-wrap gap-2">
        {commuteDestinations.slice(0, 4).map((d) => (
          <a
            key={d.label}
            href={directionsUrl(d.query)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white/50 px-3 py-1.5 text-[0.8rem] font-medium text-ink transition-colors hover:border-forest hover:bg-forest hover:text-paper"
          >
            {d.label} <ArrowUpRight aria-hidden className="size-3.5" />
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        ))}
      </div>
    ),
  },
  {
    key: "green",
    wish: "Green, quiet and safe for the children.",
    answer: `${elements.shortName} sits on 20 acres, with ${elements.outdoor.length} outdoor spaces: a lily pond, a kitchen garden, an aroma garden, a sculpture park and lawns to run on. Guna is a practising horticulturist, and every garden we plant shows it.`,
    figure: "20 acres",
    figureNote: `${elements.outdoor.length} outdoor spaces, 40+ amenities in all`,
    image: { src: "/images/pursuit-of-the-elements/play-lawn.webp", alt: "Artist’s impression of the children’s play lawn at Pursuit of the Elements", render: true },
    link: { href: elements.href, label: `Explore ${elements.shortName}` },
  },
  {
    key: "neighbours",
    wish: "Neighbours who feel like family.",
    answer: `More than 1,000 families live in Disha homes. Our first four communities sold out by word of mouth, and the evenings bring everyone together, from Shreya Ghoshal to Shankar Ehsaan Loy.`,
    figure: residentRating.score,
    figureNote: `out of ${residentRating.outOf}: how residents rate ${residentRating.community} on ${residentRating.source} (${residentRating.checked})`,
    image: { src: "/images/people/family-2.jpg", alt: "Three generations of a Disha homeowner family together in their living room" },
    link: { href: residentRating.href, label: `Read the reviews on ${residentRating.source}`, external: true },
  },
  {
    key: "explain",
    wish: "Someone who’ll explain everything.",
    answer: "“Let’s meet for coffee” is Guna’s favourite invitation. It means he will explain until you leave as informed as any engineer on the project, and Raja will take you through the structure until the maths of the building is clear.",
    figure: "2",
    figureNote: "founders you can meet, in person, before you decide",
    image: { src: "/images/people/founders.jpg", alt: "Disha Habitat founders Gunaranjan J and K Raja Sekhar" },
    link: { href: "/contact#book", label: "Meet us for coffee" },
  },
];

export function BuyerNeeds() {
  const [active, setActive] = useState(0);
  const n = needs[active];

  return (
    <section id="looking" data-tone="light" aria-labelledby="looking-title" className="layer surface-ivory py-16 md:py-24">
      <div className="shell">
        <div className="max-w-3xl">
          <p className="eyebrow text-mute">What you’re looking for</p>
          <h2 id="looking-title" className="serif mt-5 t-section leading-[1.04] text-balance">
            You’re not looking for a house. <em>Neither were we.</em>
          </h2>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink/75">
            In 2014 we were homebuyers too, with the same list you probably have. Pick anything on it, and we’ll show you what
            we did about it.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* The visitor's list */}
          <div className="lg:col-span-5">
            <p className="font-[family-name:var(--font-caveat)] text-[1.6rem] leading-none text-earth">my list for a home…</p>
            <ul className="mt-4 space-y-2" aria-label="What you’re looking for in a home">
              {needs.map((it, i) => {
                const on = i === active;
                return (
                  <li key={it.key}>
                    <button
                      type="button"
                      id={`need-tab-${it.key}`}
                      aria-expanded={on}
                      aria-controls="need-panel need-panel-m"
                      onClick={() => setActive(i)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                          e.preventDefault();
                          const next = (i + (e.key === "ArrowDown" ? 1 : -1) + needs.length) % needs.length;
                          setActive(next);
                          document.getElementById(`need-tab-${needs[next].key}`)?.focus();
                        }
                      }}
                      className={`group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-[background-color,border-color,box-shadow] duration-300 ${
                        on ? "border-forest bg-forest text-paper shadow-[0_18px_40px_-22px_rgb(15_38_32/0.7)]" : "border-ink/10 bg-white/40 text-ink hover:border-ink/30 hover:bg-white/70"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`inline-flex size-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                          on ? "border-brass bg-brass text-forest-deep" : "border-ink/25"
                        }`}
                      >
                        {on && (
                          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 8.5 6.5 12 13 4.5" />
                          </svg>
                        )}
                      </span>
                      <span className="serif flex-1 text-[1.3rem] leading-snug md:text-[1.45rem]">“{it.wish}”</span>
                      <ArrowRight aria-hidden className={`size-4 shrink-0 transition-transform ${on ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`} />
                    </button>
                    {on && (
                      <div id="need-panel-m" role="region" aria-labelledby={`need-tab-${it.key}`} className="mt-3 lg:hidden">
                        <Answer n={it} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Our answer */}
          <div className="lg:col-span-7">
            <div id="need-panel" role="region" aria-live="polite" aria-labelledby={`need-tab-${n.key}`} className="hidden lg:sticky lg:top-28 lg:block">
              <Answer key={n.key} n={n} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Answer({ n }: { n: Need }) {
  const [guna, raja] = homemakers;
  return (
    <div key={n.key} className="need-swap overflow-hidden rounded-[1.75rem] bg-white/60 shadow-[0_30px_70px_-40px_rgb(21_26_23/0.45)] ring-1 ring-ink/5">
      <div className="relative aspect-[16/8] bg-ink">
        <Image src={n.image.src} alt={n.image.alt} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
        {n.image.render && (
          <span className="absolute right-3 top-3 rounded-full bg-forest-deep/65 px-2.5 py-1 text-[0.7rem] font-medium text-paper backdrop-blur-sm">Artist’s impression</span>
        )}
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:p-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="flex -space-x-2">
              {[guna, raja].map((h) => (
                <span key={h.name} className="relative inline-block size-9 overflow-hidden rounded-full ring-2 ring-paper">
                  <Image src={h.portrait} alt="" fill sizes="36px" className="object-cover" />
                </span>
              ))}
            </span>
            <p className="text-sm text-mute">
              <span className="font-semibold text-ink">Guna and Raja</span>, founders
            </p>
          </div>
          <p className="mt-4 text-[1.08rem] leading-relaxed text-ink/85">{n.answer}</p>
          {n.extra}
          <Link
            href={n.link.href}
            {...(n.link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="mt-6 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
          >
            {n.link.label}
            {n.link.external ? <ArrowUpRight aria-hidden className="size-4" /> : <ArrowRight aria-hidden className="size-4" />}
            {n.link.external && <span className="sr-only">(opens in a new tab)</span>}
          </Link>
        </div>
        <div className="border-t border-ink/10 pt-5 md:w-44 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <p className="serif text-[clamp(2.4rem,4vw,3.4rem)] leading-none tabular-nums text-forest">{n.figure}</p>
          <p className="mt-2 text-[0.82rem] leading-snug text-mute">{n.figureNote}</p>
        </div>
      </div>
    </div>
  );
}
