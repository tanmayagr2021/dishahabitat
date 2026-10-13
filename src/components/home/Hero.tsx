"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, Play, X } from "lucide-react";
import { ButtonLink } from "@/components/ui";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/*
 * The opening: Disha's own buildings, full bleed, warm and slow. Three photographs cross over
 * with a soft wipe and a long, slow zoom; the headline sits low on the left where the images are
 * quiet. "Watch our story" plays Disha's own brand film.
 */
const slides = [
  {
    src: "/images/central-park/clubhouse-dusk.jpg",
    position: "60% 55%",
    caption: "Disha Central Park, Panathur–Varthur Road",
  },
  {
    src: "/images/pursuit-of-the-elements/towers.webp",
    position: "50% 40%",
    caption: "Disha Pursuit of the Elements, Gunjur — artist’s impression",
  },
  {
    src: "/images/courtyard/pool-court.jpg",
    position: "50% 60%",
    caption: "Disha Courtyard, Hagadur",
  },
];
const DWELL = 7000;

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

export function Hero() {
  const [i, setI] = useState(0);
  const [film, setFilm] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    let timer = 0;
    const start = () => {
      timer = window.setTimeout(() => setI((i + 1) % slides.length), DWELL);
    };
    if (html.dataset.intro === "on") {
      const mo = new MutationObserver(() => {
        if (html.dataset.intro !== "on") {
          mo.disconnect();
          start();
        }
      });
      mo.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
      return () => {
        mo.disconnect();
        window.clearTimeout(timer);
      };
    }
    start();
    return () => window.clearTimeout(timer);
  }, [i]);

  return (
    <section
      data-tone="dark"
      aria-labelledby="hero-title"
      className="hero-stage relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest-deep text-paper"
    >
      {/* Photographs */}
      <div aria-hidden className="anim-develop absolute inset-0 -z-10">
        {slides.map((s, n) => (
          <div key={s.src} className={`hero-slide absolute inset-0 ${n === i ? "is-on" : ""}`}>
            <Image src={s.src} alt="" fill priority={n === 0} sizes="100vw" className="object-cover" style={{ objectPosition: s.position }} />
          </div>
        ))}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-forest-deep/85 via-forest-deep/45 to-forest-deep/5" />
        <div className="absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-forest-deep/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-[2] h-56 bg-gradient-to-t from-forest-deep/80 to-transparent" />
      </div>

      <div className="shell flex flex-1 flex-col justify-end pb-10 pt-32 md:pb-14">
        <div className="max-w-2xl">
          <p className="eyebrow anim-fade text-paper/80" style={d(200)}>
            Residential developers · East Bengaluru · Since 2014
          </p>
          <h1 id="hero-title" className="serif anim-words mt-5 text-[clamp(2.9rem,6vw,5.9rem)] leading-[1.02]" style={d(300)}>
            {[
              ["Come", "home", "to"],
              [<em key="m">mindful</em>, "living"],
              ["spaces."],
            ].map((line, li) => (
              <span key={li} className="block">
                {line.map((w, wi) => (
                  <span key={wi}>
                    <span className="w" style={{ "--wi": li * 3 + wi } as CSSProperties}>
                      {w}
                    </span>{" "}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="anim-fade-up mt-6 max-w-lg text-[1.08rem] leading-relaxed text-paper/85 md:text-[1.15rem]" style={d(900)}>
            Apartments and villas in East Bengaluru, built by people who were once homebuyers themselves. Five communities
            handed over; our sixth is rising in Gunjur.
          </p>
          <div className="anim-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={d(1050)}>
            <ButtonLink href="#developments" variant="paper">
              Explore our projects
            </ButtonLink>
            <button
              type="button"
              onClick={() => setFilm(true)}
              className="group inline-flex min-h-12 items-center gap-3 rounded-lg border border-paper/30 bg-white/[0.04] px-5 text-[0.95rem] font-medium backdrop-blur-sm transition-colors hover:border-paper/60 hover:bg-white/10"
            >
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-paper text-ink transition-transform group-hover:scale-110">
                <Play aria-hidden className="ml-0.5 size-3" fill="currentColor" />
              </span>
              Watch our story
            </button>
          </div>
        </div>

        <div className="anim-fade mt-14 flex items-end justify-between gap-6" style={d(1300)}>
          <a href="#approach" className="group flex items-center gap-3 text-sm text-paper/75 hover:text-paper">
            <span className="inline-flex size-10 items-center justify-center rounded-full border border-paper/35 transition-colors group-hover:border-paper">
              <ArrowDown aria-hidden className="scroll-nudge size-4" strokeWidth={1.6} />
            </span>
            Scroll to explore
          </a>
          <div className="hidden items-center gap-4 text-sm text-paper/70 md:flex">
            <span key={i} className="swap-in">
              {slides[i].caption}
            </span>
            <span className="flex gap-1.5" aria-hidden>
              {slides.map((s, n) => (
                <span key={s.src} className={`h-[2px] w-8 rounded-full transition-colors duration-700 ${n === i ? "bg-paper" : "bg-paper/30"}`} />
              ))}
            </span>
          </div>
        </div>
      </div>

      <FilmDialog open={film} onClose={() => setFilm(false)} />
    </section>
  );
}
