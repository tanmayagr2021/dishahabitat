"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SectionMark } from "@/components/ui";

/* Each idea is anchored in something Disha Habitat has built or published (see docs/CONTENT-SOURCES.md). */
const pillars = [
  {
    word: "Light",
    line: "Every home at Pursuit of Sunshine opens onto an 8 ft × 12 ft sundeck — and the community keeps time with a working sundial.",
    img: "/images/pursuit-of-sunshine/sundial.webp",
    alt: "A large stone sundial set into a circular plaza at Disha Pursuit of Sunshine",
    caption: "The Vrihat Samrat Yantra, Disha Pursuit of Sunshine",
    href: "/homes/disha-pursuit-of-sunshine",
  },
  {
    word: "Green",
    line: "Our founder Guna is a practising horticulturist. You will find that passion in the lawns and gardens of every community.",
    img: "/images/courtyard/yoga-lawn.jpg",
    alt: "A resident walking past a group practising yoga on a garden lawn",
    caption: "Morning on the lawn, Disha Courtyard",
    href: "/homes/disha-courtyard",
  },
  {
    word: "Space",
    line: "Open stairs, still water and daylight at Central Park — the spaces between homes matter as much as the homes themselves.",
    img: "/images/central-park/staircase.jpg",
    alt: "A man climbing an open white staircase beside a reflecting pool at Disha Central Park",
    caption: "The open staircase, Disha Central Park",
    href: "/homes/disha-central-park",
  },
  {
    word: "Together",
    line: "A resident community of more than a thousand families — one that grows with every new project.",
    img: "/images/courtyard/giant-chess.jpg",
    alt: "A young boy standing among giant chess pieces in the Disha Courtyard",
    caption: "The giant chessboard, Disha Courtyard",
    href: "/homes/disha-courtyard",
  },
];

export function Philosophy() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="philosophy-title" className="relative bg-stone py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionMark n="03" label="How we build" />
          </div>
          <h2 id="philosophy-title" className="display text-[2.6rem] text-ink sm:text-[3.8rem] lg:col-span-9 xl:text-[5rem]">
            Mindfulness, shown <em className="text-brass-deep">not told.</em>
          </h2>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <ol className="lg:col-span-5">
            {pillars.map((p, i) => (
              <li
                key={p.word}
                ref={(el) => {
                  items.current[i] = el;
                }}
                data-i={i}
                className="border-t border-ink/15 py-10 lg:flex lg:min-h-[78svh] lg:flex-col lg:justify-center lg:py-0"
              >
                <p className="font-display text-lg italic text-brass-deep">0{i + 1}</p>
                <h3
                  className={`display mt-2 text-[4rem] leading-none transition-colors duration-700 sm:text-[5.5rem] xl:text-[7rem] ${
                    active === i ? "text-ink" : "text-ink lg:text-ink/20"
                  }`}
                >
                  {p.word}
                </h3>
                <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">{p.line}</p>
                <Link
                  href={p.href}
                  className="mt-4 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.2em] text-ink underline decoration-ink/25 underline-offset-[6px] hover:decoration-ink"
                >
                  {p.caption.split(", ")[1]}
                </Link>
                {/* Mobile: the photograph sits with its idea. */}
                <figure className="relative mt-8 aspect-[4/3] overflow-hidden lg:hidden">
                  <Image src={p.img} alt={p.alt} fill sizes="100vw" className="object-cover" />
                </figure>
              </li>
            ))}
          </ol>

          {/* Desktop: one sticky frame, crossfading as each idea reaches the centre of the screen. */}
          <div className="hidden lg:col-span-6 lg:col-start-7 lg:block">
            <div className="sticky top-[12svh] h-[76svh]">
              <figure className="relative h-full overflow-hidden bg-forest-900">
                {pillars.map((p, i) => (
                  <div
                    key={p.word}
                    aria-hidden={active !== i}
                    className={`absolute inset-0 transition-[opacity,transform] duration-[1200ms] ease-out-soft ${
                      active === i ? "scale-100 opacity-100" : "scale-[1.05] opacity-0"
                    }`}
                  >
                    <Image src={p.img} alt={active === i ? p.alt : ""} fill sizes="50vw" className="object-cover" />
                  </div>
                ))}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6 text-ivory">
                  <span className="text-xs uppercase tracking-[0.18em] text-ivory/80">{pillars[active].caption}</span>
                  <span className="display text-[2.4rem] italic leading-none text-brass-light">{pillars[active].word}</span>
                </figcaption>
              </figure>
              <div aria-hidden className="mt-4 flex gap-2">
                {pillars.map((p, i) => (
                  <span
                    key={p.word}
                    className={`h-px flex-1 transition-colors duration-700 ${active === i ? "bg-ink" : "bg-ink/20"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
