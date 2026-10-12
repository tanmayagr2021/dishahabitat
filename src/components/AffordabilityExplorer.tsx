"use client";

import Link from "next/link";
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Info, RotateCcw } from "lucide-react";
import { buttonClass, ButtonInner } from "@/components/ui";
import { calculateLoan, formatINR, formatINRShort, LIMITS, validateLoan, type LoanErrors } from "@/lib/emi";

/*
 * ILLUSTRATIVE PLANNING TOOL — not a Disha Habitat financing, eligibility or loan service.
 * The defaults are neutral example figures, not Disha Habitat prices.
 */
const EXAMPLE = { price: "7500000", down: "1500000", rate: "8.5", years: "20", income: "" };

const digits = (s: string) => s.replace(/[^\d]/g, "");
const decimal = (s: string) => s.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
const toNum = (s: string) => (s.trim() === "" ? Number.NaN : Number(s));

/* Price slider runs on a log scale so ₹10 lakh and ₹10 crore are both reachable. */
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
  hint,
  error,
  children,
  aside,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="border-t border-ink/15 py-6">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="label text-mute">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-mute">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full border-0 border-b border-ink/25 bg-transparent px-0 pb-2 pt-3 font-serif text-[2.1rem] leading-none text-ink outline-none transition-colors focus:border-ink focus:ring-0 aria-[invalid=true]:border-error placeholder:text-[1.25rem] placeholder:text-ink/35 sm:text-[2.4rem]";

const rangeBase =
  "mt-5 h-6 w-full cursor-pointer appearance-none bg-transparent accent-ink [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-ink/25 [&::-webkit-slider-thumb]:-mt-[9px] [&::-webkit-slider-thumb]:size-[19px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-paper [&::-webkit-slider-thumb]:bg-sunshine-deep [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_var(--color-ink)] [&::-moz-range-track]:h-px [&::-moz-range-track]:bg-ink/25 [&::-moz-range-thumb]:size-[13px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-paper [&::-moz-range-thumb]:bg-sunshine-deep";

/* Money input: always shows Indian grouping; the caret keeps its place among the digits as commas move. */
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
    <div className="flex items-baseline gap-2">
      <span aria-hidden className="font-serif text-[2rem] text-mute">
        ₹
      </span>
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
        className={inputBase}
      />
    </div>
  );
}

function Donut({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  const share = total > 0 ? principal / total : 1;
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 140 140" className="size-36 shrink-0 -rotate-90 sm:size-40" aria-hidden>
      <circle cx="70" cy="70" r={r} fill="none" stroke="var(--color-sunshine)" strokeWidth="14" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="var(--color-paper)"
        strokeWidth="14"
        strokeDasharray={`${c * share} ${c}`}
        className="transition-[stroke-dasharray] duration-700 ease-out-soft"
      />
    </svg>
  );
}

function YearChart({ rows }: { rows: { year: number; principalPaid: number; interestPaid: number }[] }) {
  const max = Math.max(...rows.map((r) => r.principalPaid + r.interestPaid));
  const W = 600;
  const H = 180;
  const gap = rows.length > 20 ? 3 : 5;
  const bw = (W - gap * (rows.length - 1)) / rows.length;
  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} className="h-auto w-full" aria-hidden>
      {rows.map((r, i) => {
        const x = i * (bw + gap);
        const hp = (r.principalPaid / max) * H;
        const hi = (r.interestPaid / max) * H;
        return (
          <g key={r.year}>
            <title>{`Year ${r.year}: principal ${formatINR(r.principalPaid)}, interest ${formatINR(r.interestPaid)}`}</title>
            <rect x={x} y={H - hp - hi} width={bw} height={hi} fill="var(--color-sunshine)" />
            <rect x={x} y={H - hp} width={bw} height={hp} fill="var(--color-paper)" />
            {(r.year === 1 || r.year % 5 === 0) && (
              <text x={x + bw / 2} y={H + 16} textAnchor="middle" fontSize="11" fill="currentColor" opacity=".55">
                {r.year}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function AffordabilityExplorer({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
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

  const downPct = Number.isFinite(input.price) && input.price > 0 && Number.isFinite(input.downPayment)
    ? Math.round((input.downPayment / input.price) * 100)
    : null;
  const H = headingLevel === 2 ? "h3" : "h4";

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      {/* Inputs */}
      <form className="lg:col-span-5" onSubmit={(e) => e.preventDefault()} aria-label="Loan details">
        <Field
          id={id("price")}
          label="Property price"
          error={errors.price}
          hint="Illustrative example — not a Disha Habitat price."
          aside={Number.isFinite(input.price) && <span className="text-sm text-mute">{formatINRShort(input.price)}</span>}
        >
          <MoneyInput id={id("price")} value={v.price} onChange={set("price")} error={errors.price} />
          <input
            type="range"
            aria-label="Property price slider"
            min={0}
            max={1000}
            value={toSlider(Number.isFinite(input.price) ? input.price : PRICE_SLIDER.min)}
            onChange={(e) => set("price")(String(fromSlider(Number(e.target.value))))}
            aria-valuetext={Number.isFinite(input.price) ? formatINRShort(input.price) : undefined}
            className={rangeBase}
          />
        </Field>

        <Field
          id={id("down")}
          label="Down payment"
          error={errors.downPayment}
          hint="The amount you pay upfront from your own funds."
          aside={downPct !== null && downPct >= 0 && <span className="text-sm text-mute">{downPct}% of price</span>}
        >
          <MoneyInput id={id("down")} value={v.down} onChange={set("down")} error={errors.downPayment} />
          <input
            type="range"
            aria-label="Down payment slider"
            min={0}
            max={Number.isFinite(input.price) ? input.price : 0}
            step={10_000}
            value={Number.isFinite(input.downPayment) ? Math.min(input.downPayment, input.price || 0) : 0}
            onChange={(e) => set("down")(e.target.value)}
            aria-valuetext={Number.isFinite(input.downPayment) ? formatINRShort(input.downPayment) : undefined}
            className={rangeBase}
          />
          <div className="mt-3 flex gap-2" role="group" aria-label="Quick down payment">
            {[10, 20, 30].map((pct) => (
              <button
                key={pct}
                type="button"
                disabled={!Number.isFinite(input.price)}
                onClick={() => set("down")(String(Math.round((input.price * pct) / 100)))}
                className={`min-h-9 rounded-full border px-4 text-xs font-medium transition-colors disabled:opacity-40 ${
                  downPct === pct ? "border-ink bg-ink text-paper" : "border-ink/20 text-mute hover:border-ink"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </Field>

        <div className="grid gap-x-8 sm:grid-cols-2">
          <Field id={id("rate")} label="Interest rate" error={errors.annualRate} hint="Annual, % p.a.">
            <div className="flex items-baseline gap-2">
              <input
                id={id("rate")}
                inputMode="decimal"
                autoComplete="off"
                value={v.rate}
                onChange={(e) => set("rate")(decimal(e.target.value).slice(0, 5))}
                aria-invalid={!!errors.annualRate}
                aria-describedby={errors.annualRate ? `${id("rate")}-error` : `${id("rate")}-hint`}
                className={inputBase}
              />
              <span aria-hidden className="font-serif text-[1.6rem] text-mute">
                %
              </span>
            </div>
            <input
              type="range"
              aria-label="Interest rate slider"
              min={LIMITS.annualRate.min}
              max={15}
              step={0.05}
              value={Number.isFinite(input.annualRate) ? Math.min(input.annualRate, 15) : 0}
              onChange={(e) => set("rate")(String(Number(e.target.value)))}
              aria-valuetext={`${v.rate}% per year`}
              className={rangeBase}
            />
          </Field>

          <Field id={id("years")} label="Loan tenure" error={errors.years} hint="1 to 30 years">
            <div className="flex items-baseline gap-2">
              <input
                id={id("years")}
                inputMode="numeric"
                autoComplete="off"
                value={v.years}
                onChange={(e) => set("years")(digits(e.target.value).slice(0, 2))}
                aria-invalid={!!errors.years}
                aria-describedby={errors.years ? `${id("years")}-error` : `${id("years")}-hint`}
                className={inputBase}
              />
              <span aria-hidden className="font-serif text-[1.6rem] text-mute">
                years
              </span>
            </div>
            <input
              type="range"
              aria-label="Loan tenure slider"
              min={LIMITS.years.min}
              max={LIMITS.years.max}
              step={1}
              value={Number.isFinite(input.years) ? input.years : 1}
              onChange={(e) => set("years")(e.target.value)}
              aria-valuetext={`${v.years} years`}
              className={rangeBase}
            />
          </Field>
        </div>

        <Field
          id={id("income")}
          label="Monthly household income (optional)"
          error={errors.monthlyIncome}
          hint="Optional. Used only to show what share of it the EMI would be. Nothing is stored or sent."
        >
          <MoneyInput
            id={id("income")}
            value={v.income}
            onChange={set("income")}
            error={errors.monthlyIncome}
            placeholder="Leave blank to skip"
          />
        </Field>

        <div className="border-t border-ink/15 pt-6">
          <button
            type="button"
            onClick={() => setV(EXAMPLE)}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-mute hover:text-ink"
          >
            <RotateCcw aria-hidden className="size-4" strokeWidth={1.5} />
            Reset to example values
          </button>
        </div>
      </form>

      {/* Results */}
      <div
        data-tone="dark"
        className="grain relative overflow-hidden rounded-[4px] bg-ink p-6 text-paper sm:p-10 lg:col-span-7 lg:p-12"
      >
        <div aria-live="polite" aria-atomic="true">
          {result ? (
            <>
              <p className="label text-sunshine">Estimated monthly EMI</p>
              <p className="serif mt-4 text-[3.6rem] leading-none sm:text-[5rem] xl:text-[6rem]">
                {formatINR(result.emi)}
                <span className="ml-2 align-middle font-sans text-sm font-normal tracking-normal text-paper/60">/ month</span>
              </p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper/70">
                Estimate for a loan of {formatINRShort(result.principal)} over {input.years} years at {input.annualRate}%
                a year, using the standard reducing-balance formula.
              </p>
            </>
          ) : (
            <>
              <p className="label text-sunshine">Estimated monthly EMI</p>
              <p className="serif mt-4 text-[3rem] leading-none text-paper/40">—</p>
              <p className="mt-4 max-w-md text-sm text-paper/70">Adjust the highlighted details to see an estimate.</p>
            </>
          )}
        </div>

        {result && (
          <>
            <div className="mt-10 flex flex-col gap-8 border-t border-paper/15 pt-8 sm:flex-row sm:items-center">
              <Donut principal={result.principal} interest={result.totalInterest} />
              <dl className="grid flex-1 gap-5">
                {[
                  ["Loan principal", result.principal, "bg-paper"],
                  ["Total interest", result.totalInterest, "bg-sunshine"],
                  ["Total repaid", result.totalRepaid, null],
                ].map(([label, value, swatch]) => (
                  <div key={label as string} className="flex items-baseline justify-between gap-4 border-b border-paper/10 pb-3">
                    <dt className="flex items-center gap-2.5 text-sm text-paper/70">
                      {swatch ? <span aria-hidden className={`size-2.5 ${swatch}`} /> : <span aria-hidden className="size-2.5" />}
                      {label as string}
                      {swatch && (
                        <span className="text-paper/45">
                          {Math.round(((value as number) / result.totalRepaid) * 100)}%
                        </span>
                      )}
                    </dt>
                    <dd className="font-serif text-[1.6rem] leading-none">{formatINR(value as number)}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {result.emiToIncome !== null && (
              <div className="mt-8 border-t border-paper/15 pt-8">
                <div className="flex items-baseline justify-between gap-4">
                  <H className="text-sm text-paper/70">EMI as a share of the income you entered</H>
                  <p className="font-serif text-[2rem] leading-none">{(result.emiToIncome * 100).toFixed(1)}%</p>
                </div>
                <div className="mt-3 h-1 bg-paper/15" aria-hidden>
                  <div
                    className="h-full bg-sunshine transition-[width] duration-700 ease-out-soft"
                    style={{ width: `${Math.min(100, result.emiToIncome * 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-paper/55">
                  An indicative calculation only — not financial advice and not an assessment of eligibility or
                  affordability.
                </p>
              </div>
            )}

            <div className="mt-8 border-t border-paper/15 pt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <H className="text-sm text-paper/70">Where each year’s payments go</H>
                <p className="flex items-center gap-4 text-xs text-paper/60" aria-hidden>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 bg-paper" />
                    Principal
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 bg-sunshine" />
                    Interest
                  </span>
                </p>
              </div>
              <div className="mt-5">
                <YearChart rows={result.schedule} />
              </div>
              <p className="sr-only">
                In year 1, {formatINR(result.schedule[0].interestPaid)} goes to interest and{" "}
                {formatINR(result.schedule[0].principalPaid)} to principal. By the final year, most of each payment
                repays principal.
              </p>
              <details className="group mt-4 text-sm">
                <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-medium text-paper/75 hover:text-paper [&::-webkit-details-marker]:hidden">
                  <span className="transition-transform group-open:rotate-90">›</span> Year-by-year schedule
                </summary>
                <div className="mt-3 max-h-72 overflow-auto border-t border-paper/10">
                  <table className="w-full min-w-[26rem] text-left text-xs tabular-nums">
                    <caption className="sr-only">Estimated yearly repayment schedule</caption>
                    <thead className="sticky top-0 bg-ink text-paper/55">
                      <tr>
                        <th scope="col" className="py-2 pr-3 font-medium">Year</th>
                        <th scope="col" className="px-3 py-2 font-medium">Principal</th>
                        <th scope="col" className="px-3 py-2 font-medium">Interest</th>
                        <th scope="col" className="py-2 pl-3 font-medium">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((r) => (
                        <tr key={r.year} className="border-t border-paper/8 text-paper/85">
                          <th scope="row" className="py-1.5 pr-3 font-normal">{r.year}</th>
                          <td className="px-3 py-1.5">{formatINR(r.principalPaid)}</td>
                          <td className="px-3 py-1.5">{formatINR(r.interestPaid)}</td>
                          <td className="py-1.5 pl-3">{formatINR(r.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          </>
        )}

        <div className="mt-10 flex flex-col gap-6 border-t border-paper/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/contact#enquire" className={buttonClass("paper")}>
            <ButtonInner>Talk to us about Disha homes</ButtonInner>
          </Link>
        </div>
        <p className="mt-6 flex gap-2 text-xs leading-relaxed text-paper/55">
          <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          Illustrative planning tool. All figures are estimates. This is not an offer of finance, a loan approval or an
          eligibility check by Disha Habitat or any lender; actual EMIs depend on each lender’s terms, fees and rate type.
        </p>
      </div>
    </div>
  );
}
