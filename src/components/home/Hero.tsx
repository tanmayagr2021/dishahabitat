import Link from "next/link";
import type { CSSProperties } from "react";
import { HeroFilm } from "@/components/home/HeroFilm";
import { ButtonLink, ArrowLink } from "@/components/ui";
import { company } from "@/lib/site";
import { projectsByHandover } from "@/lib/projects";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-24 md:pt-28 lg:pt-32">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Copy column */}
          <div className="flex flex-col justify-between lg:col-span-6 lg:pb-4 xl:col-span-6">
            <div>
              <p className="eyebrow hero-rise flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-mute" style={d(100)}>
                <span>East Bengaluru</span>
                <span aria-hidden className="h-px w-6 bg-current opacity-50" />
                <span>Since {company.founded}</span>
              </p>
              <h1
                id="hero-title"
                className="display mt-7 text-[3.35rem] text-ink min-[400px]:text-[3.8rem] sm:text-[5.2rem] lg:text-[5.6rem] xl:text-[7.1rem] 2xl:text-[7.8rem]"
              >
                <span className="hero-rise block" style={d(200)}>
                  Come <em className="text-olive">home</em>
                </span>
                <span className="hero-rise block" style={d(320)}>
                  to mindful
                </span>
                <span className="hero-rise block" style={d(440)}>
                  living spaces.
                </span>
              </h1>
            </div>

            <div className="hero-rise mt-10 max-w-md lg:mt-12" style={d(600)}>
              <p className="text-[1.05rem] leading-relaxed text-ink-soft">
                Five communities. More than a thousand families. Homes built by people who began exactly where you
                are now — looking for a house that would become a home.
              </p>
              <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-6">
                <ButtonLink href="/homes">Explore our homes</ButtonLink>
                <ArrowLink href="#enquire" className="text-ink">
                  Enquire
                </ArrowLink>
              </div>
            </div>
          </div>

          {/* Film column */}
          <div className="relative lg:col-span-6 xl:col-span-6">
            <div className="hero-unveil relative" style={d(250)}>
              <HeroFilm className="aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[4/5] lg:h-[min(72svh,46rem)] lg:w-full" />
            </div>
            <p className="hero-rise mt-3 flex items-center justify-between gap-4 text-xs text-ink-mute" style={d(900)}>
              <span>From the Disha Habitat brand film</span>
              <a
                href={company.brandFilm.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center underline decoration-ink/25 underline-offset-4 hover:text-ink hover:decoration-ink"
              >
                Watch with sound<span className="sr-only"> on YouTube (opens in a new tab)</span>
              </a>
            </p>
          </div>
        </div>

        {/* Ledger of the five communities */}
        <nav aria-label="Our five communities" className="hero-rise mt-10 border-t border-ink/15 lg:mt-14" style={d(800)}>
          <ol className="-mx-5 flex snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
            {projectsByHandover.map((p) => (
              <li key={p.slug} className="shrink-0 snap-start border-ink/15 md:border-l md:first:border-l-0">
                <Link
                  href={`/homes/${p.slug}`}
                  className="group flex min-w-[11rem] flex-col gap-1 py-5 pr-8 md:min-w-0 md:px-5 md:first:pl-0"
                >
                  <span className="flex items-center gap-2 text-[0.7rem] tabular-nums tracking-[0.14em] text-ink-mute">
                    {p.index}
                    <span aria-hidden className="h-px w-4 bg-current opacity-50" />
                    {p.handoverYear}
                  </span>
                  <span className="display text-[1.55rem] leading-tight text-ink transition-colors group-hover:text-olive xl:text-[1.8rem]">
                    {p.shortName}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
