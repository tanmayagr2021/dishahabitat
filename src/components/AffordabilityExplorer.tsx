"use client";

import Link from "next/link";
import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";
import { calculateLoan, formatINR, formatINRShort, LIMITS, validateLoan, type LoanErrors } from "@/lib/emi";

/*
 * Home loan EMI calculator. ILLUSTRATIVE, not a Disha Habitat financing, eligibility or loan
 * service. The defaults are neutral example figures, not Disha Habitat prices. All arithmetic is
 * in lib/emi.ts (tested): EMI rounded to the rupee, a month-by-month schedule in paise, and a final
 * instalment that clears the loan exactly, so every total is the true sum of the payments.
 */
const EXAMPLE = { price: "7500000", down: "1500000", rate: "8.5", years: "20", income: "" };

const digits = (s: string) => s.replace(/[^\d]/g, "");
const decimal = (s: string) => s.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
const toNum = (s: string) => (s.trim() === "" ? Number.NaN : Number(s));

/* The price slider runs on a log scale so ₹10 lakh and ₹10 crore are both easy to reach. */
const PRICE_SLIDER = { min: 10_00_000, max: 10_00_00_000 };
const toSlider = (v: number) =>
  Math.round((1000 * Math.log(Math.min(Math.max(v, PRICE_SLIDER.min), PRICE_SLIDER.max) / PRICE_SLIDER.min)) /
    Math.log(PRICE_SLIDER.max / PRICE_SLIDER.min));
const fromSlider = (s: number) => {
  const v = PRICE_SLIDER.min * Math.pow(PRICE_SLIDER.max / PRICE_SLIDER.min, s / 1000);
  const unit = v >= 1_00_00_000 ? 5_00_000 : v >= 50_00_000 ? 50_000 : 10_000;
  return Math.round(v / unit) * unit;
};

function Field({
  id,
  label,
  note,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  note?: ReactNode;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[0.95rem] font-medium text-ink">
          {label}
        </label>
        {note && <span className="text-sm tabular-nums text-mute">{note}</span>}
      </div>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-xs text-mute">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/* An input box with a unit on either side. */
function Box({ prefix, suffix, invalid, children }: { prefix?: string; suffix?: string; invalid?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex h-12 items-center gap-2 rounded-lg border bg-white/70 px-3.5 transition-[border-color,box-shadow] focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgb(57_170_225/0.25)] ${
        invalid ? "border-error" : "border-ink/15"
      }`}
    >
      {prefix && <span className="text-mute">{prefix}</span>}
      {children}
      {suffix && <span className="shrink-0 text-sm text-mute">{suffix}</span>}
    </div>
  );
}

const inputCls = "w-full min-w-0 border-0 bg-transparent p-0 text-[1.1rem] font-medium tabular-nums text-ink outline-none focus:ring-0";

/* Slider: the fill is set on a wrapper and inherited by the track (styles in globals.css). */
function Range(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className">) {
  const min = Number(props.min ?? 0);
  const max = Number(props.max ?? 100);
  const pct = max > min ? ((Number(props.value ?? 0) - min) / (max - min)) * 100 : 0;
  return (
    <span className="mt-2 block" style={{ "--fill": `${Math.min(100, Math.max(0, pct)).toFixed(2)}%` } as CSSProperties}>
      <input type="range" {...props} className="range text-ink" />
    </span>
  );
}

/* Money input: Indian digit grouping as you type; the caret keeps its place among the digits. */
function MoneyInput({
  id,
  value,
  onChange,
  error,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const caretDigits = useRef<number | null>(null);
  const shown = value === "" ? "" : Number(value).toLocaleString("en-IN");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || caretDigits.current === null || document.activeElement !== el) return;
    let seen = 0;
    let i = 0;
    while (i < el.value.length && seen < caretDigits.current) {
      if (/\d/.test(el.value[i])) seen++;
      i++;
    }
    el.setSelectionRange(i, i);
    caretDigits.current = null;
  }, [shown]);

  return (
    <Box prefix="₹" invalid={!!error}>
      <input
        ref={ref}
        id={id}
        inputMode="numeric"
        autoComplete="off"
        value={shown}
        placeholder={placeholder}
        onChange={(e) => {
          const el = e.target;
          caretDigits.current = digits(el.value.slice(0, el.selectionStart ?? el.value.length)).length;
          onChange(digits(el.value).replace(/^0+(?=\d)/, "").slice(0, 12));
        }}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : `${id}-hint`}
        className={`${inputCls} placeholder:font-normal placeholder:text-mute/70`}
      />
    </Box>
  );
}

export function AffordabilityExplorer({ headingLevel = 2 }: { headingLevel?: 1 | 2 | 3 }) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [v, setV] = useState(EXAMPLE);
  const set = (k: keyof typeof EXAMPLE) => (value: string) => setV((s) => ({ ...s, [k]: value }));

  const input = {
    price: toNum(v.price),
    downPayment: toNum(v.down),
    annualRate: toNum(v.rate),
    years: toNum(v.years),
    monthlyIncome: v.income.trim() === "" ? null : toNum(v.income),
  };
  const errors: LoanErrors = validateLoan(input);
  const valid = Object.keys(errors).length === 0;
  const result = valid ? calculateLoan(input) : null;

  const downPct =
    Number.isFinite(input.price) && input.price > 0 && Number.isFinite(input.downPayment)
      ? (input.downPayment / input.price) * 100
      : null;
  const H = headingLevel === 1 ? "h2" : headingLevel === 2 ? "h3" : "h4";
  const principalShare = result ? (result.principal / result.totalRepaid) * 100 : 0;

  return (
    <div className="card grid overflow-hidden lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Inputs */}
      <form className="space-y-7 p-6 sm:p-8 lg:p-10" onSubmit={(e) => e.preventDefault()} aria-label="Loan details">
        <Field
          id={id("price")}
          label="Property price"
          error={errors.price}
          hint="An example figure, not a Disha Habitat price."
          note={Number.isFinite(input.price) && input.price > 0 ? formatINRShort(input.price) : undefined}
        >
          <MoneyInput id={id("price")} value={v.price} onChange={set("price")} error={errors.price} />
          <Range
            aria-label="Property price"
            min={0}
            max={1000}
            value={toSlider(Number.isFinite(input.price) ? input.price : PRICE_SLIDER.min)}
            onChange={(e) => set("price")(String(fromSlider(Number(e.target.value))))}
            aria-valuetext={Number.isFinite(input.price) ? formatINRShort(input.price) : undefined}
          />
        </Field>

        <Field
          id={id("down")}
          label="Down payment"
          error={errors.downPayment}
          hint="The part of the price you pay from your own funds."
          note={downPct !== null && downPct >= 0 && downPct < 100 ? `${Number(downPct.toFixed(1))}% of price` : undefined}
        >
          <MoneyInput id={id("down")} value={v.down} onChange={set("down")} error={errors.downPayment} />
          <div className="mt-2.5 flex gap-2" role="group" aria-label="Set down payment to a share of the price">
            {[10, 20, 30].map((pct) => {
              const on = downPct !== null && Math.abs(downPct - pct) < 0.05;
              return (
                <button
                  key={pct}
                  type="button"
                  disabled={!Number.isFinite(input.price)}
                  aria-pressed={on}
                  onClick={() => set("down")(String(Math.round((input.price * pct) / 100)))}
                  className={`h-9 rounded-md border px-3.5 text-sm font-medium transition-colors disabled:opacity-40 ${
                    on ? "border-ink bg-ink text-paper" : "border-ink/15 bg-white/50 text-ink hover:border-ink/40"
                  }`}
                >
                  {pct}%
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
          <Field id={id("rate")} label="Interest rate" error={errors.annualRate} hint="Per year">
            <Box suffix="% p.a." invalid={!!errors.annualRate}>
              <input
                id={id("rate")}
                inputMode="decimal"
                autoComplete="off"
                value={v.rate}
                onChange={(e) => set("rate")(decimal(e.target.value).slice(0, 5))}
                aria-invalid={!!errors.annualRate}
                aria-describedby={errors.annualRate ? `${id("rate")}-error` : `${id("rate")}-hint`}
                className={inputCls}
              />
            </Box>
            <Range
              aria-label="Interest rate"
              min={LIMITS.annualRate.min}
              max={15}
              step={0.05}
              value={Number.isFinite(input.annualRate) ? Math.min(input.annualRate, 15) : 0}
              onChange={(e) => set("rate")(String(Number(e.target.value)))}
              aria-valuetext={`${v.rate}% per year`}
            />
          </Field>

          <Field id={id("years")} label="Loan tenure" error={errors.years} hint="1 to 30 years">
            <Box suffix="years" invalid={!!errors.years}>
              <input
                id={id("years")}
                inputMode="numeric"
                autoComplete="off"
                value={v.years}
                onChange={(e) => set("years")(digits(e.target.value).slice(0, 2))}
                aria-invalid={!!errors.years}
                aria-describedby={errors.years ? `${id("years")}-error` : `${id("years")}-hint`}
                className={inputCls}
              />
            </Box>
            <Range
              aria-label="Loan tenure"
              min={LIMITS.years.min}
              max={LIMITS.years.max}
              step={1}
              value={Number.isFinite(input.years) ? input.years : 1}
              onChange={(e) => set("years")(e.target.value)}
              aria-valuetext={`${v.years} years`}
            />
          </Field>
        </div>

        <Field
          id={id("income")}
          label="Monthly household income"
          note="Optional"
          error={errors.monthlyIncome}
          hint="Only used to show what share of it the EMI would be. Nothing is stored or sent."
        >
          <MoneyInput id={id("income")} value={v.income} onChange={set("income")} error={errors.monthlyIncome} placeholder="Leave blank to skip" />
        </Field>

        <button type="button" onClick={() => setV(EXAMPLE)} className="min-h-11 text-sm font-medium text-mute underline underline-offset-4 hover:text-ink">
          Reset to the example
        </button>
      </form>

      {/* Results */}
      <div className="flex flex-col border-t border-ink/10 bg-white/30 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
        <div aria-live="polite" aria-atomic="true">
          <H className="text-[0.95rem] font-medium text-mute">Your monthly EMI</H>
          {result ? (
            <>
              <p className="mt-2 text-[clamp(2.6rem,5vw,3.6rem)] font-semibold leading-none tabular-nums text-ink">
                {formatINR(result.emi)}
              </p>
              <p className="mt-3 text-sm text-mute">
                for {result.months} months
                {Math.round(result.finalEmi) !== result.emi && <> · last EMI {formatINR(result.finalEmi)}, adjusted for rounding</>}
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-[clamp(2.6rem,5vw,3.6rem)] font-semibold leading-none text-ink/25">₹ –</p>
              <p className="mt-3 text-sm text-mute">Correct the highlighted details to see your estimate.</p>
            </>
          )}
        </div>

        {result && (
          <>
            <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10 text-[0.98rem]">
              {[
                ["Loan amount", result.principal],
                ["Down payment", input.downPayment],
                ["Total interest", result.totalInterest],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-ink/75">{label as string}</dt>
                  <dd className="font-medium tabular-nums text-ink">{formatINR(value as number)}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="font-medium text-ink">Total you repay</dt>
                <dd className="font-semibold tabular-nums text-ink">{formatINR(result.totalRepaid)}</dd>
              </div>
            </dl>

            {/* Principal against interest */}
            <div className="mt-6">
              <div className="flex h-2.5 overflow-hidden rounded-full bg-ink/10" aria-hidden>
                <span className="h-full bg-forest transition-[width] duration-500" style={{ width: `${principalShare}%` }} />
                <span className="h-full flex-1 bg-brass" />
              </div>
              <p className="mt-2.5 flex justify-between gap-4 text-sm text-mute">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-2.5 rounded-sm bg-forest" />
                  Principal {Math.round(principalShare)}%
                </span>
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-2.5 rounded-sm bg-brass" />
                  Interest {100 - Math.round(principalShare)}%
                </span>
              </p>
            </div>

            {result.emiToIncome !== null && (
              <p className="mt-6 rounded-lg border border-ink/10 bg-white/50 px-4 py-3 text-[0.95rem] text-ink">
                The EMI would be <strong className="font-semibold tabular-nums">{(result.emiToIncome * 100).toFixed(1)}%</strong> of the
                monthly income you entered.
              </p>
            )}

            <details className="group mt-6">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[0.95rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
                Year-by-year breakdown
                <span aria-hidden className="text-mute transition-transform group-open:rotate-180">
                  ⌄
                </span>
              </summary>
              <div className="mt-2 max-h-72 overflow-auto rounded-lg border border-ink/10">
                <table className="w-full min-w-[24rem] text-left text-sm tabular-nums">
                  <caption className="sr-only">Estimated repayment for each year of the loan</caption>
                  <thead className="sticky top-0 bg-paper text-mute">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">Year</th>
                      <th scope="col" className="px-3 py-2 text-right font-medium">Principal</th>
                      <th scope="col" className="px-3 py-2 text-right font-medium">Interest</th>
                      <th scope="col" className="px-3 py-2 text-right font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((r) => (
                      <tr key={r.year} className="border-t border-ink/8">
                        <th scope="row" className="px-3 py-1.5 font-normal">{r.year}</th>
                        <td className="px-3 py-1.5 text-right">{formatINR(r.principalPaid)}</td>
                        <td className="px-3 py-1.5 text-right">{formatINR(r.interestPaid)}</td>
                        <td className="px-3 py-1.5 text-right">{formatINR(r.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        )}

        <div className="mt-auto pt-8">
          <Link
            href="/contact#book"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-ink px-5 text-[0.95rem] font-medium text-paper transition-colors hover:bg-forest"
          >
            Book a site visit
          </Link>
          <p className="mt-4 text-xs leading-relaxed text-mute">
            An estimate for planning only, using the standard reducing-balance method with monthly rests. It is not an offer
            of finance or an eligibility check by Disha Habitat or any lender. Fees, insurance and floating-rate changes are not
            included.
          </p>
        </div>
      </div>
    </div>
  );
}
