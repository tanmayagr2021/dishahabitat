"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { ButtonLink } from "@/components/ui";
import { useScrollProgress } from "@/lib/useScrollProgress";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/*
 * Three photographs, one shown according to the hour in Bengaluru (set before paint by the
 * bootstrap script in layout.tsx). Without JavaScript the dusk photograph shows.
 */
const parts = [
  {
    part: "day",
    src: "/images/courtyard/pool-court.jpg",
    position: "50% 62%",
    place: "Disha Courtyard",
    note: "Daylight on the court",
  },
  {
    part: "dusk",
    src: "/images/central-park/clubhouse-dusk.jpg",
    position: "56% 55%",
    place: "Disha Central Park",
    note: "The clubhouse, lights coming on",
  },
  {
    part: "night",
    src: "/images/central-park/clubhouse-night.jpg",
    position: "50% 50%",
    place: "Disha Central Park",
    note: "The clubhouse after dark",
  },
] as const;

/* Live Bengaluru time, written straight to the DOM so server and client markup match. */
function BengaluruClock() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "Asia/Kolkata",
    });
    const tick = () => {
      if (ref.current) ref.current.textContent = fmt.format(new Date());
    };
    tick();
    const t = setInterval(tick, 15_000);
    return () => clearInterval(t);
  }, []);
  return (
    <span ref={ref} className="tabular-nums">
      --:--
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, "exit", { still: 0 });

  return (
    <section
      ref={ref}
      data-tone="dark"
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper [--p:0]"
    >
      {/* The photograph develops from black & white into colour, then drifts as you scroll. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 will-change-transform"
        style={{ transform: "translate3d(0, calc(var(--p) * 18%), 0)" }}
      >
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
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/25 to-ink/40" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink" style={{ opacity: "calc(var(--p) * 0.8)" }} />

      <div
        className="shell flex flex-1 flex-col justify-end pb-8 pt-28 md:pb-10"
        style={{ transform: "translate3d(0, calc(var(--p) * -80px), 0)", opacity: "calc(1 - var(--p) * 1.5)" }}
      >
        <p className="label anim-fade flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/75" style={d(400)}>
          <span>East Bengaluru</span>
          <span aria-hidden className="h-px w-6 bg-current opacity-50" />
          <span>Since 2014</span>
        </p>

        <h1 id="hero-title" className="mt-5">
          <span className="line serif text-[clamp(5.2rem,19vw,19rem)] leading-[0.8]">
            <span className="anim-rise" style={d(300)}>
              Come <em>home</em>
            </span>
          </span>
          <span className="line mt-4 max-w-[22ch] text-[clamp(1.35rem,2.6vw,2.4rem)] font-light leading-[1.15] tracking-[-0.02em] text-paper/90 md:mt-6">
            <span className="anim-rise" style={d(520)}>
              to mindful living spaces.
            </span>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 border-t border-paper/20 pt-6 md:mt-14 md:flex-row md:items-end md:justify-between">
          <dl className="anim-fade-up grid grid-cols-3 gap-6 md:gap-12" style={d(900)}>
            {[
              ["Communities", "5"],
              ["Homes", "1,102"],
              ["Families", "1,000+"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label text-paper/60">{k}</dt>
                <dd className="serif mt-2 text-[2rem] leading-none md:text-[2.6rem]">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="anim-fade-up flex flex-col gap-5 md:items-end" style={d(1050)}>
            <p className="label text-paper/60">
              {parts.map((p) => (
                <span key={p.part} data-part={p.part}>
                  {p.place} · {p.note}
                </span>
              ))}
              <span className="mt-1 flex items-center gap-2 md:justify-end">
                <span aria-hidden className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-paper/70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-paper" />
                </span>
                Bengaluru, now <BengaluruClock /> IST
              </span>
            </p>
            <ButtonLink href="/homes" variant="paper">
              Explore the homes
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
