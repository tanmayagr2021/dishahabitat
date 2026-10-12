"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Label } from "@/components/ui";
import { projectsByHandover } from "@/lib/projects";

/* "Our Core", Disha Habitat's own manifesto (dishahabitat.com/our-journey), as a title sequence. */
const hues = projectsByHandover.map((p) => p.hue);
const spectrum = `linear-gradient(90deg, ${hues.join(", ")})`;

const frames: ReactNode[] = [
  <>Life is colourful.</>,
  <>
    Your turmeric yellow could be someone’s mustard. <span className="opacity-45">Their sea-green could be your teal.</span>
  </>,
  <>
    Then there’s <em>Black.</em> And there’s <em className="opacity-60">White.</em>
  </>,
  <>
    Our promises are inked in <em>Black.</em>
    <br />
    Our approach is clear <em>White.</em>
  </>,
  <>
    Bring in your own{" "}
    <em className="bg-clip-text pr-[0.06em] text-transparent" style={{ backgroundImage: spectrum }}>
      colours.
    </em>
  </>,
];

export function BlackWhite({ n = "06" }: { n?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [frame, setFrame] = useState(frames.length - 1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (reduce.matches) return setFrame(frames.length - 1);
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      setFrame(Math.min(frames.length - 1, Math.floor(p * frames.length)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const last = frame === frames.length - 1;

  return (
    <section
      ref={ref}
      data-tone="dark"
      aria-labelledby="core-title"
      className="relative bg-ink text-paper motion-safe:h-[320svh]"
    >
      <div className="grain sticky top-0 flex min-h-[100svh] flex-col overflow-hidden py-24 motion-reduce:relative">
        <div className="shell flex items-center justify-between">
          <Label n={n} className="text-paper/55">
            Our core
          </Label>
          <p aria-hidden className="label tabular-nums text-paper/55">
            {String(frame + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}
          </p>
        </div>

        <h2 id="core-title" className="sr-only">
          Our core: our promises are inked in Black, our approach is clear White. Bring in your own colours.
        </h2>

        <div aria-hidden className="shell relative flex flex-1 items-center">
          {frames.map((f, i) => (
            <p
              key={i}
              className={`serif absolute inset-x-5 max-w-[22ch] text-[clamp(2.8rem,7vw,7.6rem)] leading-[0.98] transition-[opacity,transform,filter] duration-[1000ms] ease-out-expo md:inset-x-10 xl:inset-x-14 ${
                i === frame
                  ? "translate-y-0 opacity-100 blur-0"
                  : i < frame
                    ? "-translate-y-8 opacity-0 blur-sm"
                    : "translate-y-8 opacity-0 blur-sm"
              }`}
            >
              {f}
            </p>
          ))}
        </div>

        {/* The five community colours arrive with the final line. */}
        <div aria-hidden className="shell">
          <div className="flex h-1.5 gap-1.5">
            {hues.map((h, i) => (
              <span
                key={h}
                className="flex-1 origin-left rounded-full transition-transform duration-[900ms] ease-out-expo"
                style={{ background: h, transform: last ? "scaleX(1)" : "scaleX(0)", transitionDelay: last ? `${i * 90}ms` : "0ms" }}
              />
            ))}
          </div>
          <p className="label mt-4 text-paper/50">We are Disha Habitat. We have no coloured cover-ups.</p>
        </div>
      </div>
    </section>
  );
}
