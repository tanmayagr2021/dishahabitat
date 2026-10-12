"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { elements } from "@/lib/elements";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/*
 * The opening: Disha's own buildings, full screen, one after another. Each new photograph rises
 * in through vertical strips, like a facade going up, then settles with a slow zoom. Every slide
 * names the community, where it is and what was built — so the page says "homes, built and
 * handed over" before a word is read. Facts from lib/projects.ts and lib/elements.ts.
 */
type Slide = { src: string; alt: string; position: string; name: string; place: string; fact: string; href: string; render?: boolean };
const slides: Slide[] = [
  {
    src: "/images/central-park/clubhouse-dusk.jpg",
    alt: "The glass clubhouse at Disha Central Park lit up at dusk above the pool",
    position: "56% 55%",
    name: "Disha Central Park",
    place: "Panathur–Varthur Road",
    fact: "306 homes · handed over 2018",
    href: "/homes/disha-central-park",
  },
  {
    src: "/images/courtyard/pool-court.jpg",
    alt: "The pool court at Disha Courtyard, framed by terracotta and white blocks",
    position: "50% 60%",
    name: "Disha Courtyard",
    place: "Hagadur Village",
    fact: "264 homes · handed over 2021",
    href: "/homes/disha-courtyard",
  },
  {
    src: "/images/pursuit-of-the-elements/towers.webp",
    alt: "Artist’s impression of the Pursuit of the Elements towers above landscaped gardens",
    position: "50% 40%",
    name: "Disha Pursuit of the Elements",
    place: "Gunjur",
    fact: "Now selling · 20 acres · 7 towers",
    href: elements.href,
    render: true,
  },
  {
    src: "/images/pursuit-of-sunshine/towers.webp",
    alt: "The two residential towers of Disha Pursuit of Sunshine above a line of trees",
    position: "40% 50%",
    name: "Disha Pursuit of Sunshine",
    place: "Budigere Road",
    fact: "322 homes · handed over 2025",
    href: "/homes/disha-pursuit-of-sunshine",
  },
];
const STRIPS = 7;
const DWELL = 6500;

export function Hero() {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const started = useRef(false);

  const go = (n: number) => {
    setPrev(i);
    setI((n + slides.length) % slides.length);
  };

  /* Advance on a timer once the intro has handed over; pause while the visitor hovers the controls. */
  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let timer = 0;
    const tick = () => {
      timer = window.setTimeout(() => {
        setPrev(i);
        setI((i + 1) % slides.length);
      }, DWELL);
    };
    const begin = () => {
      started.current = true;
      if (!paused) tick();
    };
    if (html.dataset.intro === "on" && !started.current) {
      const mo = new MutationObserver(() => {
        if (html.dataset.intro !== "on") {
          mo.disconnect();
          begin();
        }
      });
      mo.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
      return () => {
        mo.disconnect();
        window.clearTimeout(timer);
      };
    }
    begin();
    return () => window.clearTimeout(timer);
  }, [i, paused]);

  const s = slides[i];

  return (
    <section
      data-tone="dark"
      aria-labelledby="hero-title"
      aria-roledescription="carousel"
      className="hero-stage surface-deep grain relative overflow-hidden pb-6 pt-28 md:pt-[7.5rem]"
    >
      {/* Headline on forest green */}
      <div className="shell flex flex-col items-center text-center">
        <p className="anim-fade flex items-center gap-3 text-[0.95rem] text-paper/75" style={d(150)}>
          <span aria-hidden className="h-px w-8 bg-paper/40" />
          Residential developers · East Bengaluru · since 2014
          <span aria-hidden className="h-px w-8 bg-paper/40" />
        </p>
        <h1 id="hero-title" className="serif anim-words mt-5 text-[clamp(2.6rem,5.6vw,5.9rem)] leading-[1.02]" style={d(250)}>
          {[
            ["Come", "home", "to", <em key="m">mindful</em>],
            ["living", "spaces."],
          ].map((line, li) => (
            <span key={li} className="block">
              {line.map((w, wi) => (
                <span key={wi}>
                  <span className="w" style={{ "--wi": li * 4 + wi } as CSSProperties}>
                    {w}
                  </span>{" "}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <div className="anim-fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row" style={d(900)}>
          <ButtonLink href={elements.href} variant="paper">
            See what we’re building now
          </ButtonLink>
          <ButtonLink href="/homes" variant="outline-light">
            Our communities
          </ButtonLink>
        </div>
      </div>

      {/* The window onto the buildings: it opens like a door being unveiled, then moves through the communities */}
      <div className="mt-9 px-3 md:mt-10 md:px-6">
        <div
          className="hero-window relative mx-auto aspect-[4/5] max-w-[110rem] overflow-hidden rounded-2xl bg-forest sm:aspect-auto sm:h-[calc(100svh-29rem)] sm:min-h-[24rem]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div aria-hidden className="absolute inset-0">
            {prev !== null && prev !== i && (
              <div key={`prev-${prev}`} className="absolute inset-0">
                <Image src={slides[prev].src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: slides[prev].position }} />
              </div>
            )}
            <div key={`cur-${i}`} className="absolute inset-0">
              {prev === null ? (
                <Image src={s.src} alt="" fill priority sizes="100vw" className="slow-zoom object-cover" style={{ objectPosition: s.position }} />
              ) : (
                Array.from({ length: STRIPS }, (_, k) => (
                  <div key={k} className="strip absolute inset-0" style={{ "--sd": `${k * 70}ms` } as CSSProperties}>
                    <div
                      className="absolute inset-0"
                      style={{ clipPath: `inset(0 ${((STRIPS - k - 1) / STRIPS) * 100}% 0 ${(k / STRIPS) * 100}%)` }}
                    >
                      <Image src={s.src} alt="" fill sizes="100vw" className="slow-zoom object-cover" style={{ objectPosition: s.position }} />
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest-deep/80 to-transparent" />
          </div>

          {s.render && (
            <span className="absolute left-4 top-4 rounded-md bg-forest-deep/60 px-2 py-1 text-[0.72rem] font-medium backdrop-blur-sm md:left-6 md:top-6">
              Artist’s impression
            </span>
          )}

          {/* What you are looking at, and where the slideshow is */}
          <div className="absolute inset-x-3 bottom-3 flex flex-col gap-3 md:inset-x-6 md:bottom-6 md:flex-row md:items-end md:justify-between">
            <Link href={s.href} className="card-dark group block px-5 py-4 md:min-w-[22rem]" aria-live="polite">
              <span key={`cap-${i}`} className="swap-in block">
                <span className="block text-sm text-paper/65">{s.place}</span>
                <span className="serif mt-1 flex items-center gap-2 text-[1.6rem] leading-tight">
                  {s.name}
                  <ArrowRight aria-hidden className="size-5 opacity-60 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                </span>
                <span className="mt-1 block text-sm text-paper/80">{s.fact}</span>
              </span>
            </Link>
            <div className="card-dark flex items-center gap-1 px-3 py-2" role="group" aria-label="Choose a community">
              {slides.map((sl, n) => (
                <button key={sl.name} type="button" onClick={() => go(n)} aria-label={`Show ${sl.name}`} aria-current={n === i} className="relative h-8 w-9 md:w-12">
                  <span className="absolute inset-x-1 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-paper/25">
                    {n === i && (
                      <span
                        key={`bar-${i}-${paused}`}
                        className="absolute inset-0 origin-left rounded-full bg-paper"
                        style={{ animation: paused ? "none" : `fill-x ${DWELL}ms linear both`, transform: paused ? "scaleX(1)" : undefined }}
                      />
                    )}
                  </span>
                </button>
              ))}
              <span className="ml-1 text-sm tabular-nums text-paper/70">
                {String(i + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <a href="#trust" className="mx-auto mt-5 flex w-fit items-center gap-1.5 text-sm text-paper/60 hover:text-paper">
        Scroll <ChevronDown aria-hidden className="size-4" />
      </a>
    </section>
  );
}
