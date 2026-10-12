"use client";

import { useId, useState } from "react";
import { ArrowLink, Label } from "@/components/ui";
import { calculateLoan, formatINR, formatINRShort } from "@/lib/emi";

/*
 * The affordability explorer, folded into a single sentence. Each figure is its own control.
 * Example values are illustrative, not Disha Habitat prices.
 */
type Knob = {
  key: "price" | "down" | "years" | "rate";
  label: string;
  min: number;
  max: number;
  step: number;
  show: (v: number) => string;
};

const knobs: Record<Knob["key"], Knob> = {
  price: { key: "price", label: "Home price", min: 30_00_000, max: 3_00_00_000, step: 5_00_000, show: (v) => formatINRShort(v) },
  down: { key: "down", label: "Down payment", min: 10, max: 50, step: 5, show: (v) => `${v}%` },
  years: { key: "years", label: "Tenure", min: 5, max: 30, step: 1, show: (v) => `${v} years` },
  rate: { key: "rate", label: "Interest rate", min: 6, max: 12, step: 0.05, show: (v) => `${v.toFixed(2).replace(/\.?0+$/, "")}%` },
};

function Inline({
  knob,
  value,
  onChange,
}: {
  knob: Knob;
  value: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <span className="group/k relative inline-flex flex-col align-baseline">
      <label htmlFor={id} className="sr-only">
        {knob.label}
      </label>
      <span
        aria-hidden
        className="whitespace-nowrap border-b-2 border-dashed border-ink/35 italic transition-colors group-focus-within/k:border-ink"
      >
        {knob.show(value)}
      </span>
      {/* An invisible range sits over the figure: drag or use arrow keys to change it. */}
      <input
        id={id}
        type="range"
        min={knob.min}
        max={knob.max}
        step={knob.step}
        value={value}
        aria-valuetext={knob.show(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="peer absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-3 left-0 right-0 h-[3px] origin-left rounded-full bg-ink opacity-0 transition-opacity peer-focus-visible:opacity-100"
        style={{ transform: `scaleX(${(value - knob.min) / (knob.max - knob.min)})` }}
      />
    </span>
  );
}

export function PlanTeaser() {
  const [v, setV] = useState({ price: 75_00_000, down: 20, years: 20, rate: 8.5 });
  const set = (k: keyof typeof v) => (n: number) => setV((s) => ({ ...s, [k]: n }));
  const result = calculateLoan({
    price: v.price,
    downPayment: Math.round((v.price * v.down) / 100),
    annualRate: v.rate,
    years: v.years,
  });

  return (
    <section id="plan" data-tone="light" aria-labelledby="plan-title" className="bg-paper-2 py-28 md:py-40">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 lg:pt-4">
            <Label n="07" className="text-mute">
              Plan your home
            </Label>
            <h2 id="plan-title" className="sr-only">
              Estimate a monthly EMI
            </h2>
          </div>

          <div className="lg:col-span-9">
            <p className="serif text-[clamp(2.2rem,4.6vw,4.6rem)] leading-[1.12] text-ink">
              A home of <Inline knob={knobs.price} value={v.price} onChange={set("price")} />, with{" "}
              <Inline knob={knobs.down} value={v.down} onChange={set("down")} /> down, repaid over{" "}
              <Inline knob={knobs.years} value={v.years} onChange={set("years")} /> at{" "}
              <Inline knob={knobs.rate} value={v.rate} onChange={set("rate")} /> a year, comes to about
            </p>

            <div className="mt-10 flex flex-col gap-8 border-t border-ink/15 pt-8 md:mt-14 md:flex-row md:items-end md:justify-between">
              <p aria-live="polite" className="serif text-[clamp(4.2rem,10vw,10rem)] leading-[0.85] tabular-nums">
                {formatINR(result.emi)}
                <span className="ml-3 font-sans text-[1rem] tracking-normal text-mute">a month</span>
              </p>
              <div className="max-w-xs">
                <p className="text-sm leading-relaxed text-mute">
                  Drag any underlined figure, or focus it and use the arrow keys. Illustrative only — not a Disha Habitat
                  price or an offer of finance.
                </p>
                <ArrowLink href="/plan" className="mt-4 text-ink">
                  Open the full planner
                </ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
