"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { elements } from "@/lib/elements";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/*
 * Three photographs, one shown according to the hour in Bengaluru (set before paint by the
 * bootstrap script in layout.tsx). Without JavaScript the dusk photograph shows.
 */
const parts = [
  { part: "day", src: "/images/courtyard/pool-court.jpg", position: "50% 62%", caption: "Disha Courtyard, by day" },
  { part: "dusk", src: "/images/central-park/clubhouse-dusk.jpg", position: "56% 55%", caption: "Disha Central Park, at dusk" },
  { part: "night", src: "/images/central-park/clubhouse-night.jpg", position: "50% 50%", caption: "Disha Central Park, after dark" },
] as const;

/* Bengaluru time, written straight to the DOM so server and client markup match. */
function BengaluruClock() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => {
      if (ref.current) ref.current.textContent = fmt.format(new Date());
    };
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);
  return <span ref={ref} className="tabular-nums" />;
}

export function Hero() {
  return (
    <section
      data-tone="dark"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        {parts.map((p) => (
          <div key={p.part} data-part={p.part} className="anim-develop absolute inset-0">
            <Image
              src={p.src}
              alt=""
              fill
              priority={p.part === "dusk"}
              loading={p.part === "dusk" ? undefined : "lazy"}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: p.position }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/35 to-ink/45" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />

      <div className="shell flex flex-1 flex-col justify-end pb-8 pt-28 md:pb-12">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <p className="label anim-fade text-paper/75" style={d(200)}>
              Disha Habitat · East Bengaluru · Since 2014
            </p>
            <h1 id="hero-title" className="serif anim-rise mt-5 text-[clamp(3.6rem,10vw,9.5rem)] leading-[0.92]" style={d(250)}>
              Come <em>home</em>
              <span className="block text-[0.42em] leading-[1.1] text-paper/90">to mindful living spaces.</span>
            </h1>
            <p className="anim-fade-up mt-7 max-w-xl text-[1.1rem] leading-relaxed text-paper/85 md:text-[1.2rem]" style={d(450)}>
              Apartments and villas in East Bengaluru, built by a team who began as homebuyers. Five communities delivered,
              more than 1,000 families at home.
            </p>
            <div className="anim-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={d(600)}>
              <ButtonLink href={elements.href} variant="paper">
                See what’s new in Gunjur
              </ButtonLink>
              <ButtonLink href="/homes" variant="outline-light">
                All our homes
              </ButtonLink>
            </div>
          </div>

          {/* What is on sale now, always visible. */}
          <Link
            href={elements.href}
            className="anim-fade-up group flex items-center gap-4 rounded-[6px] bg-paper p-3 text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] lg:col-span-4"
            style={d(750)}
          >
            <span className="relative block aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-[4px] sm:w-40">
              <Image
                src={elements.cover.src}
                alt=""
                fill
                sizes="160px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </span>
            <span className="min-w-0 flex-1 py-1">
              <span className="label inline-flex items-center gap-2 text-ink/70">
                <span className="size-2 rounded-full bg-elements" />
                {elements.status}
              </span>
              <span className="serif mt-1.5 block text-[1.45rem] leading-[1.05]">{elements.shortName}</span>
              <span className="mt-1 block text-sm text-mute">
                {elements.offer} · {elements.locality.split(",")[0]}
              </span>
            </span>
            <span className="mr-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.6} />
            </span>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-paper/20 pt-5 text-sm text-paper/65">
          <p>
            {parts.map((p) => (
              <span key={p.part} data-part={p.part}>
                {p.caption}
              </span>
            ))}
          </p>
          <p>
            In Bengaluru it’s <BengaluruClock />
          </p>
        </div>
      </div>
    </section>
  );
}
