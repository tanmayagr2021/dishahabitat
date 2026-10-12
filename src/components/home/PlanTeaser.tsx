"use client";

import { useId, useState, type CSSProperties } from "react";
import { ArrowLink, Label } from "@/components/ui";
import { calculateLoan, formatINR, formatINRShort } from "@/lib/emi";

/*
 * A quick EMI estimate with four plain sliders. Example values are illustrative,
 * not Disha Habitat prices. The full planner lives at /plan.
 */
type Knob = { key: "price" | "down" | "years" | "rate"; label: string; min: number; max: number; step: number; show: (v: number) => string };

const knobs: Knob[] = [
  { key: "price", label: "Home price", min: 30_00_000, max: 3_00_00_000, step: 5_00_000, show: (v) => formatINRShort(v) },
  { key: "down", label: "Down payment", min: 10, max: 50, step: 5, show: (v) => `${v}%` },
  { key: "years", label: "Loan tenure", min: 5, max: 30, step: 1, show: (v) => `${v} years` },
  { key: "rate", label: "Interest rate", min: 6, max: 12, step: 0.05, show: (v) => `${v.toFixed(2).replace(/\.?0+$/, "")}%` },
];

function Slider({ knob, value, onChange }: { knob: Knob; value: number; onChange: (v: number) => void }) {
  const id = useId();
  return (
    <div className="border-t border-ink/15 py-4">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="label text-mute">
          {knob.label}
        </label>
        <output htmlFor={id} className="serif text-[1.6rem] leading-none tabular-nums">
          {knob.show(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={knob.min}
        max={knob.max}
        step={knob.step}
        value={value}
        aria-valuetext={knob.show(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3 text-ink"
        style={{ "--fill": `${((value - knob.min) / (knob.max - knob.min)) * 100}%` } as CSSProperties}
      />
    </div>
  );
}

export function PlanTeaser() {
  const [v, setV] = useState({ price: 75_00_000, down: 20, years: 20, rate: 8.5 });
  const result = calculateLoan({
    price: v.price,
    downPayment: Math.round((v.price * v.down) / 100),
    annualRate: v.rate,
    years: v.years,
  });

  return (
    <section id="plan" data-tone="light" aria-labelledby="plan-title" className="bg-paper-2 py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Label n="07" className="text-mute">
            EMI calculator
          </Label>
          <h2 id="plan-title" className="serif mt-5 text-[clamp(2.4rem,4.6vw,4.4rem)]">
            What would your <em>monthly EMI</em> be?
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-mute">
            Move the sliders for a quick estimate. Example figures only — not Disha Habitat prices or an offer of finance.
          </p>
          <div className="mt-10 rounded-[6px] bg-ink p-7 text-paper md:p-9" aria-live="polite">
            <p className="label text-paper/60">Estimated EMI</p>
            <p className="serif mt-3 text-[clamp(3rem,6vw,4.6rem)] leading-none tabular-nums">
              {formatINR(result.emi)}
              <span className="ml-2 font-sans text-base text-paper/60">/ month</span>
            </p>
            <p className="mt-4 text-sm text-paper/65">
              Loan of {formatINRShort(result.principal)} · total interest {formatINRShort(result.totalInterest)}
            </p>
          </div>
          <ArrowLink href="/plan" className="mt-6 text-ink">
            Open the full calculator
          </ArrowLink>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
          {knobs.map((k) => (
            <Slider key={k.key} knob={k} value={v[k.key]} onChange={(n) => setV((s) => ({ ...s, [k.key]: n }))} />
          ))}
        </div>
      </div>
    </section>
  );
}
