"use client";

import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { RotateCcw } from "lucide-react";
import { Label } from "@/components/ui";
import { projectsByHandover } from "@/lib/projects";
import { elements } from "@/lib/elements";

/*
 * "Our Core", Disha Habitat's own manifesto (dishahabitat.com/our-journey). It ends with
 * "Bring in your own colours", so the visitor can: each swatch is a community's signature hue,
 * and choosing one floods the page with it from the swatch outwards.
 */
const swatches = [
  ...projectsByHandover.map((p) => ({ name: p.shortName, hue: p.hue })),
  { name: elements.shortName, hue: elements.hue },
];

type Layer = { id: number; hue: string; x: number; y: number };

export function BlackWhite({ n = "06", full = false }: { n?: string; full?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const seq = useRef(0);
  const current = layers.at(-1);
  const painted = Boolean(current && current.hue !== "ink");

  const paint = (hue: string) => (e: MouseEvent<HTMLButtonElement>) => {
    const box = ref.current!.getBoundingClientRect();
    const b = e.currentTarget.getBoundingClientRect();
    const layer = { id: ++seq.current, hue, x: b.left + b.width / 2 - box.left, y: b.top + b.height / 2 - box.top };
    setLayers((ls) => [...ls.slice(-1), layer]);
  };

  return (
    <section
      ref={ref}
      data-tone={painted ? "light" : "dark"}
      aria-labelledby="core-title"
      className={`relative isolate overflow-hidden bg-ink py-24 transition-colors duration-700 md:py-36 ${painted ? "text-ink" : "text-paper"}`}
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        {layers.map((l) => (
          <span
            key={l.id}
            className="paint-layer absolute inset-0"
            style={
              {
                background: l.hue === "ink" ? "var(--color-ink)" : l.hue,
                "--x": `${l.x}px`,
                "--y": `${l.y}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3 lg:pt-3">
          <Label n={n} className="opacity-70">
            Our core
          </Label>
        </div>
        <div className="lg:col-span-9">
          {full && (
            <div className="mb-10 max-w-2xl space-y-4 text-[1.15rem] leading-relaxed opacity-70">
              <p>Life is colourful. With every hue open to its own interpretation.</p>
              <p>
                Your turmeric yellow could be someone’s mustard, their sea-green could be your teal. You both could be right;
                you both could also be completely off the mark.
              </p>
              <p>
                Then there’s Black. And there’s White. Black is never to be doubted. White is invariably spotless. Both
                definitive. Both unrelenting.
              </p>
            </div>
          )}
          <h2 id="core-title" className="serif text-[clamp(2.4rem,5.4vw,5.4rem)] leading-[1.02]">
            Our promises are inked in <em>Black.</em> Our approach is clear <em className="opacity-60">White.</em>
          </h2>

          <div className="mt-12 border-t border-current/20 pt-8">
            <p className="serif text-[clamp(1.8rem,3vw,2.6rem)] leading-tight">
              Bring in your own <em>colours.</em>
            </p>
            <p className="mt-2 text-[0.95rem] opacity-70">
              Each colour is sampled from one of our communities. Pick one.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {swatches.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={paint(s.hue)}
                  aria-pressed={current?.hue === s.hue}
                  className={`group inline-flex h-12 items-center gap-3 rounded-full border py-1 pl-1 pr-4 text-[0.9rem] transition-[border-color,background-color] duration-300 ${
                    current?.hue === s.hue ? "border-current bg-ink/10" : "border-current/25 hover:border-current"
                  }`}
                >
                  <span
                    aria-hidden
                    className="size-10 rounded-full ring-2 ring-paper/20 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: s.hue }}
                  />
                  {s.name}
                </button>
              ))}
              {painted && (
                <button
                  type="button"
                  onClick={paint("ink")}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-[0.9rem] text-paper"
                >
                  <RotateCcw aria-hidden className="size-4" strokeWidth={1.6} />
                  Back to black
                </button>
              )}
            </div>
          </div>
          <p className="mt-8 text-sm opacity-60">We are Disha Habitat. We have no coloured cover-ups.</p>
        </div>
      </div>
    </section>
  );
}
