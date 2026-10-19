"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Award, KeyRound, Play, ShieldCheck, X } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { elements } from "@/lib/elements";
import { award, homesHandedOver } from "@/lib/proof";
import { formatIndian } from "@/lib/site";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/*
 * The opening is a house-shaped window, drawn like the roof and mast of Disha's own logo. A Disha
 * building shows through it; the words sit on solid green either side, never on the photograph.
 * On large screens, scrolling opens the window until the community fills the screen (you "come
 * home"), then the page carries on. On phones the window sits above the words. "Watch our story"
 * plays Disha's own brand film. Geometry and the opening are in globals.css (.hero-open).
 */
const photo = {
  src: "/images/central-park/clubhouse-dusk.jpg",
  position: "60% 55%",
  caption: "Disha Central Park, Panathur–Varthur Road",
};

function FilmDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label="Disha Habitat brand film"
      className="m-auto w-[min(92vw,70rem)] overflow-visible bg-transparent p-0 backdrop:bg-forest-deep/85 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="relative">
          <video
            src="/media/brand-film.mp4"
            poster="/media/brand-film-poster.jpg"
            controls
            autoPlay
            playsInline
            className="block w-full rounded-2xl bg-black"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the film"
            className="absolute -top-14 right-0 inline-flex size-11 items-center justify-center rounded-full bg-paper text-ink"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
      )}
    </dialog>
  );
}

function Proof({ className = "" }: { className?: string }) {
  return (
    <ul className={className} aria-label="Proof">
      <li className="flex items-start gap-2.5">
        <KeyRound aria-hidden className="mt-0.5 size-4 shrink-0 text-brass" strokeWidth={1.7} />
        <span>
          <strong className="block font-semibold tabular-nums text-paper">{formatIndian(homesHandedOver)} homes</strong> handed over
        </span>
      </li>
      <li className="flex items-start gap-2.5">
        <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-brass" strokeWidth={1.7} />
        <span>
          <strong className="block font-semibold text-paper">RERA registered</strong> Pursuit of the Elements
        </span>
      </li>
      <li className="flex items-start gap-2.5">
        <Award aria-hidden className="mt-0.5 size-4 shrink-0 text-brass" strokeWidth={1.7} />
        <span>
          <strong className="block font-semibold text-paper">{award.title}</strong> {award.honour}
        </span>
      </li>
    </ul>
  );
}

/* The window's outline and mast, drawn in the logo's sky blue. */
function Outline({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={`hero-outline pointer-events-none absolute ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline points="0,100 0,13 50,0 100,13 100,100" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Hero() {
  const [film, setFilm] = useState(false);
  const stage = useRef<HTMLElement>(null);

  // Large screens: scrolling through the section opens the window (--p), fades the words (--t)
  // and brings in the caption (--c). Nothing moves for reduced motion or on smaller screens.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    const update = () => {
      raf = 0;
      let raw = 0;
      if (mq.matches) {
        const span = el.offsetHeight - window.innerHeight;
        raw = span > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / span)) : 0;
      }
      const p = raw < 0.5 ? 4 * raw ** 3 : 1 - (-2 * raw + 2) ** 3 / 2;
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--t", Math.max(0, 1 - raw * 3.2).toFixed(3));
      el.style.setProperty("--c", Math.min(1, Math.max(0, (raw - 0.68) / 0.24)).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <section ref={stage} data-tone="dark" aria-labelledby="hero-title" className="hero-stage hero-open relative bg-forest-deep text-paper">
      <div className="hero-stick relative overflow-hidden lg:h-[100svh]">
        {/* Large screens: the photograph fills the stage but shows only through the window. */}
        <div aria-hidden className="hero-aperture absolute inset-0 hidden lg:block">
          <div className="anim-develop absolute inset-0" style={{ "--d": "300ms" } as CSSProperties}>
            <Image src={photo.src} alt="" fill priority sizes="100vw" className="hero-zoom object-cover" style={{ objectPosition: photo.position }} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/15 via-45% to-transparent" style={{ opacity: "var(--c)" }} />
        </div>
        <Outline className="hidden lg:block hero-outline-lg" />
        <span aria-hidden className="hero-mast hero-mast-lg absolute hidden w-[1.5px] bg-[#39aae1] lg:block" />

        <div className="hero-words shell relative z-10 grid pb-14 pt-20 text-center md:pt-24 lg:h-full lg:grid-cols-[1fr_var(--ww)_1fr] lg:items-center lg:gap-[clamp(2.5rem,5vw,5.5rem)] lg:py-20 lg:text-left">
          {/* The window */}
          <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1">
            <figure className="relative mx-auto lg:hidden" style={{ width: "var(--ww)", height: "var(--wh)", marginTop: "max(2.5rem, 7svh)" }}>
              <span aria-hidden className="hero-mast absolute bottom-[calc(100%+10px)] left-1/2 h-[max(1.75rem,5svh)] w-[1.5px] -translate-x-1/2 bg-[#39aae1]" />
              <div className="hero-house absolute inset-0 overflow-hidden">
                <div className="anim-develop absolute inset-0" style={{ "--d": "300ms" } as CSSProperties}>
                  <Image src={photo.src} alt="" fill priority sizes="100vw" className="hero-breathe object-cover" style={{ objectPosition: "62% 55%" }} />
                </div>
              </div>
              <Outline className="-left-[10px] -right-[10px] -top-[10px] bottom-0" />
              <figcaption className="sr-only">{photo.caption}</figcaption>
            </figure>
            <div aria-hidden className="hidden lg:block" style={{ height: "var(--wh)" }} />
          </div>

          {/* Left: the promise, and the proof under it */}
          <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1">
            <p className="eyebrow anim-fade mt-8 text-paper/80 lg:mt-0" style={d(700)}>
              <span className="hidden sm:inline lg:block">
                Residential developers<span className="lg:hidden"> · </span>
              </span>
              East Bengaluru · Since 2014
            </p>
            <h1 id="hero-title" className="serif anim-words mt-3 text-[clamp(3.2rem,8vw,8.2rem)] leading-[0.95] [text-wrap:balance] lg:mt-6" style={d(900)}>
              <span className="w" style={{ "--wi": 0 } as CSSProperties}>
                Come
              </span>{" "}
              <span className="w" style={{ "--wi": 1 } as CSSProperties}>
                home
              </span>
              <span className="sr-only"> to mindful living spaces</span>
            </h1>
            <Proof className="anim-fade mt-12 hidden gap-4 text-sm text-paper/80 lg:grid" />
          </div>

          {/* Right: the rest of the line, a short note and the actions */}
          <div className="order-3 lg:order-none lg:col-start-3 lg:row-start-1">
            <p aria-hidden className="serif anim-fade-up mt-1 text-[clamp(1.6rem,2.7vw,3rem)] italic leading-[1.08] text-paper/95 lg:mt-0" style={d(1150)}>
              to mindful <span className="lg:block">living spaces.</span>
            </p>
            <p className="anim-fade-up mx-auto mt-4 max-w-sm text-[1rem] leading-relaxed text-paper/80 lg:mx-0 lg:mt-6 lg:max-w-[23rem] lg:text-[1.05rem]" style={d(1300)}>
              Keys on the day they’re promised, papers in order, neighbours who feel like family. Five communities in East Bengaluru since 2014.
            </p>
            <div className="anim-fade-up mt-6 flex flex-col items-center gap-3 lg:mt-8 lg:items-start" style={d(1450)}>
              <ButtonLink href="/contact#book" variant="paper" className="w-full justify-center font-semibold sm:w-auto">
                Book a site visit
              </ButtonLink>
              <div className="flex flex-wrap items-center justify-center gap-x-6 text-[0.95rem] lg:justify-start">
                <Link href={elements.href} className="inline-flex min-h-11 items-center gap-1.5 underline decoration-paper/35 underline-offset-4 hover:decoration-paper">
                  See what’s selling now <ArrowRight aria-hidden className="size-4" />
                </Link>
                <button type="button" onClick={() => setFilm(true)} className="group inline-flex min-h-11 items-center gap-2 text-paper/90 hover:text-paper">
                  <span className="inline-flex size-7 items-center justify-center rounded-full border border-paper/40 transition-colors group-hover:bg-paper group-hover:text-ink">
                    <Play aria-hidden className="ml-0.5 size-3" fill="currentColor" />
                  </span>
                  Watch our story
                </button>
              </div>
            </div>
            <p className="anim-fade mt-2 hidden text-sm text-paper/70 xl:block" style={d(1550)}>
              No obligation. Or call{" "}
              <a href={elements.phone.href} className="underline decoration-paper/40 underline-offset-4 hover:text-paper">
                {elements.phone.display}
              </a>
              , or{" "}
              <a href={elements.whatsapp} target="_blank" rel="noopener noreferrer" className="underline decoration-paper/40 underline-offset-4 hover:text-paper">
                WhatsApp us
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
            <Proof className="anim-fade mt-9 grid grid-cols-3 gap-3 border-t border-paper/15 pt-5 text-left text-[0.8rem] leading-snug text-paper/75 lg:hidden" />
          </div>
        </div>

        {/* Large screens: an invitation to scroll, and the caption that arrives once the window is open */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden lg:block" style={{ opacity: "var(--t)" }}>
          <div className="shell flex justify-center">
            <a href="#looking" className="hero-cue-link pointer-events-auto flex flex-col items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-paper/75 hover:text-paper">
              Scroll to step inside
              <span aria-hidden className="hero-cue block h-10 w-px bg-paper/35" />
            </a>
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[14svh] z-10 hidden lg:block" style={{ opacity: "var(--c)" }}>
          <div className="shell">
            <p className="eyebrow text-paper/85">One of five communities we have built</p>
            <p className="serif mt-3 text-[clamp(2.6rem,4.6vw,4.8rem)] leading-none">Disha Central Park</p>
            <p className="mt-3 text-[1.05rem] text-paper/85">Panathur–Varthur Road · Handed over 2018</p>
          </div>
        </div>
      </div>

      <FilmDialog open={film} onClose={() => setFilm(false)} />
    </section>
  );
}
