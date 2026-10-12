"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { elements } from "@/lib/elements";
import { company } from "@/lib/site";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/*
 * Disha Habitat's own brand film, "Come home to mindful living spaces" (youtube.com/watch?v=EFDhOmvK108),
 * muted and looping in an architectural frame. It starts once the logo intro has handed over, skips
 * the opening black, and never autoplays for visitors who prefer reduced motion.
 */
function BrandFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current!;
    const html = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => {
      v.preload = "auto";
      if (v.currentTime < 1.6) v.currentTime = 1.6;
      v.play().catch(() => {});
    };
    if (html.dataset.intro !== "on") {
      start();
      return;
    }
    const mo = new MutationObserver(() => {
      if (html.dataset.intro !== "on") {
        mo.disconnect();
        start();
      }
    });
    mo.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
    return () => mo.disconnect();
  }, []);

  return (
    <>
      <video
        ref={ref}
        src="/media/brand-film.mp4"
        poster="/media/brand-film-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 size-full object-cover"
      />
      <button
        type="button"
        onClick={() => {
          const v = ref.current!;
          if (v.paused) v.play().catch(() => {});
          else v.pause();
        }}
        aria-label={playing ? "Pause the brand film" : "Play the brand film"}
        className="label absolute right-4 top-20 z-10 inline-flex h-10 items-center gap-2 bg-forest-deep/55 px-3.5 text-paper backdrop-blur-md transition-colors hover:bg-forest-deep/80 md:right-6 lg:top-24"
      >
        {playing ? <Pause aria-hidden className="size-3.5" /> : <Play aria-hidden className="size-3.5" />}
        {playing ? "Pause" : "Play"} film
      </button>
    </>
  );
}

export function Hero() {
  return (
    <section
      data-tone="dark"
      aria-labelledby="hero-title"
      className="hero-stage surface-deep grain relative flex min-h-[100svh] flex-col overflow-hidden lg:grid lg:grid-cols-12"
    >
      {/* The film, framed: right seven columns on large screens, the top of the page on phones. */}
      <div className="anim-develop relative h-[58svh] min-h-[22rem] overflow-hidden lg:order-2 lg:col-span-7 lg:h-auto" style={d(100)}>
        <BrandFilm />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-transparent to-forest-deep/50 lg:bg-gradient-to-r lg:from-forest-deep/45 lg:via-transparent lg:to-transparent" />
        <p className="label absolute bottom-5 right-5 hidden text-paper/70 lg:block">From our brand film · Come home to mindful living spaces</p>
      </div>

      {/* The drawn line: the cyan of the logo, dividing type from film. */}
      <span
        aria-hidden
        className="anim-draw pointer-events-none absolute left-0 right-0 top-[58svh] z-10 h-px origin-left bg-cyan lg:hidden"
        style={d(700)}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 top-0 z-10 hidden w-px origin-top bg-cyan/80 [animation:draw-y_1.6s_var(--ease-in-out-cine)_both] [animation-delay:600ms] lg:left-[calc(100%*5/12)] lg:block"
      />

      {/* Type */}
      <div className="relative z-10 flex flex-1 flex-col justify-between gap-10 px-5 pb-8 pt-10 md:px-10 lg:order-1 lg:col-span-5 lg:pb-10 lg:pl-16 lg:pr-12 lg:pt-36 xl:pl-16">
        <div>
          <p className="label anim-fade flex items-center gap-3 text-paper/70" style={d(300)}>
            <span className="size-1.5 bg-cyan" />
            {company.name} · {company.region} · Since {company.founded}
          </p>
          <h1 id="hero-title" className="serif mt-6 text-[clamp(4.2rem,9.6vw,10.5rem)] leading-[0.86] tracking-[-0.03em]">
            <span className="line anim-line">
              <span style={d(350)}>Come</span>
            </span>
            <span className="line anim-line">
              <span style={d(450)}>home</span>
            </span>
            <span className="anim-fade-up mt-4 block text-[0.3em] leading-[1.05] tracking-[-0.01em] text-brass" style={d(650)}>
              to mindful living spaces.
            </span>
          </h1>
          <p className="anim-fade-up mt-7 max-w-[30rem] text-[1.05rem] leading-relaxed text-paper/80 md:text-[1.12rem]" style={d(800)}>
            Apartments and villas in East Bengaluru, built by a team who began as homebuyers themselves. Five communities
            delivered since {company.founded}; a sixth rising in Gunjur.
          </p>
          <div className="anim-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={d(950)}>
            <ButtonLink href="#explore" variant="paper">
              Explore the homes
            </ButtonLink>
            <ButtonLink href="/story" variant="outline-light">
              Our story
            </ButtonLink>
          </div>
        </div>

        <div className="anim-fade-up" style={d(1100)}>
          {/* What is on sale now: one line, always visible. */}
          <Link
            href={elements.href}
            className="group flex items-center gap-4 border-y border-paper/15 py-4 transition-colors hover:border-cyan/60"
          >
            <span className="relative block aspect-[4/3] w-24 shrink-0 overflow-hidden">
              <Image src={elements.cover.src} alt="" fill sizes="96px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="label flex items-center gap-2 text-cyan">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping bg-cyan opacity-70" />
                  <span className="relative inline-flex size-1.5 bg-cyan" />
                </span>
                {elements.status} · {elements.locality.split(",")[0]}
              </span>
              <span className="serif mt-1.5 block text-[1.5rem] leading-[1.05]">{elements.shortName}</span>
              <span className="mt-1 block text-sm text-paper/60">{elements.offer}</span>
            </span>
            <span aria-hidden className="flex items-center text-paper/70 transition-colors group-hover:text-cyan">
              <span className="h-px w-5 bg-current transition-[width] duration-700 ease-out-expo group-hover:w-10" />
              <span className="-ml-[7px] size-[7px] rotate-45 border-r border-t border-current" />
            </span>
          </Link>

        </div>
      </div>
    </section>
  );
}
