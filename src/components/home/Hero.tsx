"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { ButtonLink } from "@/components/ui";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { projectsByHandover } from "@/lib/projects";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, "exit", { still: 0 });

  return (
    <section
      ref={ref}
      data-tone="dark"
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest-950 text-ivory [--p:0]"
    >
      {/* Photograph: settles on load, drifts and dims as the visitor scrolls on. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 will-change-transform"
        style={{ transform: "translate3d(0, calc(var(--p) * 22%), 0) scale(calc(1 + var(--p) * 0.06))" }}
      >
        <div className="anim-settle absolute inset-0">
          <Image
            src="/images/central-park/clubhouse-dusk.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[58%_55%] md:object-[50%_60%]"
          />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/90 via-forest-950/45 to-forest-950/5" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/35 to-transparent" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-forest-950" style={{ opacity: "calc(var(--p) * 0.75)" }} />

      <div
        className="shell flex flex-1 flex-col justify-end pb-10 pt-32 md:pb-14 lg:pt-40"
        style={{ transform: "translate3d(0, calc(var(--p) * -90px), 0)", opacity: "calc(1 - var(--p) * 1.6)" }}
      >
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow anim-fade flex items-center gap-3 text-ivory/70" style={d(150)}>
              <span className="hidden text-brass-light sm:inline">Disha Habitat</span>
              <span aria-hidden className="tick hidden sm:inline-block" />
              <span>East Bengaluru · Since 2014</span>
            </p>
            <h1
              id="hero-title"
              className="display mt-6 text-[3.7rem] leading-[0.88] min-[400px]:text-[4.2rem] sm:text-[6rem] lg:text-[7.4rem] xl:text-[8.6rem] 2xl:text-[9.6rem]"
            >
              <span className="mask-line">
                <span style={d(250)}>
                  Come <em className="text-brass-light">home</em>
                </span>
              </span>
              <span className="mask-line">
                <span style={d(380)}>to mindful</span>
              </span>
              <span className="mask-line">
                <span style={d(510)}>living spaces.</span>
              </span>
            </h1>
          </div>

          <div className="anim-rise lg:col-span-4 lg:pb-3" style={d(800)}>
            <p className="max-w-sm text-[1.02rem] leading-relaxed text-ivory/80">
              Five communities across East Bengaluru, home to more than a thousand families — built by people who began
              exactly where you are now.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[440px]:flex-row">
              <ButtonLink href="/homes" variant="brass">
                Explore our homes
              </ButtonLink>
              <ButtonLink href="/story" variant="light" icon={false}>
                Our story
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {/* Project discovery ledger */}
      <nav
        aria-label="Our five communities"
        className="anim-fade relative border-t border-ivory/15 bg-forest-950/55 backdrop-blur-sm"
        style={d(1000)}
      >
        <div className="shell">
          <ol className="-mx-5 flex snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
            {projectsByHandover.map((p) => (
              <li key={p.slug} className="relative shrink-0 snap-start md:border-l md:border-ivory/12 md:px-5 md:first:border-l-0 md:first:pl-0">
                <Link
                  href={`/homes/${p.slug}`}
                  className="group flex min-w-[12.5rem] flex-col gap-1 py-5 pr-8 md:min-w-0 md:pr-0"
                >
                  {/* Hover preview of the community */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-full left-0 mb-3 hidden aspect-[4/3] w-52 translate-y-3 overflow-hidden opacity-0 shadow-2xl shadow-black/40 transition-all duration-500 ease-out-soft group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:block"
                  >
                    <Image src={p.cover.src} alt="" fill sizes="208px" className="object-cover" />
                  </span>
                  <span className="flex items-center gap-2 text-[0.68rem] tabular-nums tracking-[0.16em] text-ivory/55">
                    <span className="font-display text-sm italic tracking-normal text-brass-light">{p.index}</span>
                    <span aria-hidden className="h-px w-4 bg-current" />
                    <span>
                      <span className="sr-only">Handover </span>
                      {p.handoverYear}
                    </span>
                  </span>
                  <span className="display text-[1.7rem] leading-tight transition-colors duration-300 group-hover:text-brass-light lg:whitespace-nowrap xl:text-[1.75rem]">
                    {p.shortName}
                  </span>
                  <span className="text-xs text-ivory/50">{p.locality}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <p className="pointer-events-none absolute right-5 top-28 hidden text-right text-[0.65rem] uppercase tracking-[0.2em] text-ivory/50 md:block md:right-10 xl:right-[4.5rem]">
        Disha Central Park
        <br />
        The clubhouse at dusk
      </p>
    </section>
  );
}
