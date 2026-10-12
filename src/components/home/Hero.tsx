"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ButtonLink, words } from "@/components/ui";
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
      className="hero-stage relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest-deep text-paper"
    >
      {/* Photographs */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {prev !== null && prev !== i && (
          <div key={`prev-${prev}`} className="absolute inset-0">
            <Image src={slides[prev].src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: slides[prev].position }} />
          </div>
        )}
        <div key={`cur-${i}`} className="absolute inset-0">
          {prev === null ? (
            <div className="anim-develop absolute inset-0">
              <Image src={s.src} alt="" fill priority sizes="100vw" className="slow-zoom object-cover" style={{ objectPosition: s.position }} />
            </div>
          ) : (
            Array.from({ length: STRIPS }, (_, k) => (
              <div
                key={k}
                className="strip absolute inset-0"
                style={{ "--sd": `${k * 70}ms` } as CSSProperties}
              >
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
        <div className="absolute inset-0 bg-forest-deep/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgb(8_22_15/0.5),transparent_80%)]" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-forest-deep/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-forest-deep/90 to-transparent" />
      </div>

      {/* Headline, centred */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 pb-10 pt-32 text-center">
        <p className="anim-fade flex items-center gap-3 text-[0.95rem] text-paper/85" style={d(200)}>
          <span aria-hidden className="h-px w-8 bg-paper/50" />
          Residential developers · East Bengaluru · since 2014
          <span aria-hidden className="h-px w-8 bg-paper/50" />
        </p>
        <h1
          id="hero-title"
          className="serif anim-words mt-6 max-w-[16ch] text-[clamp(2.9rem,7.2vw,7rem)] leading-[1] [text-shadow:0_2px_40px_rgb(0_0_0/0.3)]"
          style={d(300)}
        >
          {words(["Come home to", <em key="m">mindful</em>, "living spaces."])}
        </h1>
        <p className="anim-fade-up mt-6 max-w-xl text-[1.08rem] leading-relaxed text-paper/85 md:text-[1.2rem]" style={d(900)}>
          Five communities built and handed over to more than 1,000 families. Now building our sixth, in Gunjur.
        </p>
        <div className="anim-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={d(1050)}>
          <ButtonLink href={elements.href} variant="paper">
            See what we’re building now
          </ButtonLink>
          <ButtonLink href="/homes" variant="outline-light">
            Our communities
          </ButtonLink>
        </div>
      </div>

      {/* The slide's facts and the controls */}
      <div className="anim-fade-up shell relative pb-6 md:pb-8" style={d(1250)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="card-dark grid items-center gap-4 px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:px-6">
          <Link href={s.href} className="group min-w-0" aria-live="polite">
            <span key={`cap-${i}`} className="swap-in block">
              <span className="block text-sm text-paper/60">
                {s.place}
                {s.render && " · artist’s impression"}
              </span>
              <span className="mt-0.5 flex items-center gap-2 font-medium">
                {s.name}
                <ArrowRight aria-hidden className="size-4 opacity-60 transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2" role="group" aria-label="Choose a community">
            {slides.map((sl, n) => (
              <button
                key={sl.name}
                type="button"
                onClick={() => go(n)}
                aria-label={`Show ${sl.name}`}
                aria-current={n === i}
                className="group relative h-8 w-10 md:w-14"
              >
                <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-paper/25">
                  {n === i && (
                    <span
                      key={`bar-${i}-${paused}`}
                      className="absolute inset-0 origin-left rounded-full bg-paper"
                      style={{ animation: paused ? "none" : `fill-x ${DWELL}ms linear both`, transform: paused ? "scaleX(1)" : undefined }}
                    />
                  )}
                  {n < i && <span className="absolute inset-0 rounded-full bg-paper/60" />}
                </span>
              </button>
            ))}
          </div>
          <p key={`fact-${i}`} className="swap-in text-sm text-paper/75 md:text-right">
            {s.fact}
          </p>
        </div>
        <a href="#trust" className="mx-auto mt-4 flex w-fit items-center gap-1.5 text-sm text-paper/60 hover:text-paper">
          Scroll <ChevronDown aria-hidden className="size-4" />
        </a>
      </div>
    </section>
  );
}
