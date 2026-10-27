"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { Accordion } from "@/components/ds";
import { links } from "@/lib/content";
import { calculateLoan, formatINR, formatINRShort, LIMITS, validateLoan, type LoanErrors } from "@/lib/emi";
import s from "./AffordabilityExplorer.module.css";

/*
 * Home loan EMI calculator. ILLUSTRATIVE, not a Disha Habitat financing, eligibility or loan
 * service. The defaults are neutral example figures, not Disha Habitat prices. All arithmetic is
 * in lib/emi.ts (tested): EMI rounded to the rupee, a month-by-month schedule in paise, and a final
 * instalment that clears the loan exactly, so every total is the true sum of the payments.
 */
const EXAMPLE = { price: "7500000", down: "1500000", rate: "8.5", years: "20", income: "" };

/* Whole rupees: anything after a decimal point is dropped, never read as more digits. */
const digits = (s: string) => s.split(".")[0].replace(/[^\d]/g, "");
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

/*
 * A figure that rolls to its new value over 350 ms (at once if the visitor asks for less motion).
 * `shown` is what is on screen each frame; `settled` only changes when the roll ends, so a screen
 * reader hears the final figure once, not every step on the way.
 */
function useRoll(target: number | null) {
  const [shown, setShown] = useState(target);
  const [settled, setSettled] = useState(target);
  const at = useRef(target);
  useEffect(() => {
    if (target === null) {
      at.current = null;
      const id = requestAnimationFrame(() => {
        setShown(null);
        setSettled(null);
      });
      return () => cancelAnimationFrame(id);
    }
    const from = at.current ?? target;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches || from === target;
    const start = performance.now();
    let id = 0;
    const frame = (now: number) => {
      const t = still ? 1 : Math.min(1, (now - start) / 350);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = t === 1 ? target : from + (target - from) * eased;
      at.current = value;
      setShown(value);
      if (t < 1) id = requestAnimationFrame(frame);
      else setSettled(target);
    };
    id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, [target]);
  return { shown, settled };
}

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
    <div className={s.field}>
      <div className={s.labelRow}>
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
        {note && <span className={s.note}>{note}</span>}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className={s.error} role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className={s.hint}>
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
    <div className={s.box} data-invalid={invalid || undefined}>
      {prefix && <span className={s.unit}>{prefix}</span>}
      {children}
      {suffix && <span className={s.unit}>{suffix}</span>}
    </div>
  );
}

/* Slider: the filled part is set from --fill (see the module css). */
function Range({ label, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & { label: string }) {
  const min = Number(props.min ?? 0);
  const max = Number(props.max ?? 100);
  const pct = max > min ? ((Number(props.value ?? 0) - min) / (max - min)) * 100 : 0;
  return <input type="range" aria-label={label} {...props} className={s.range} style={{ "--fill": `${Math.min(100, Math.max(0, pct)).toFixed(2)}%` } as CSSProperties} />;
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
        className={s.input}
      />
    </Box>
  );
}

export function AffordabilityExplorer() {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [v, setV] = useState(EXAMPLE);
  /* The share of the price kept as down payment (20% to start). It stays put when the price moves,
     until the visitor types a rupee amount of their own. */
  const [keepPct, setKeepPct] = useState<number | null>(20);
  const set = (k: keyof typeof EXAMPLE) => (value: string) => setV((st) => ({ ...st, [k]: value }));
  const setPrice = (value: string) =>
    setV((st) => {
      const price = Number(value);
      return keepPct !== null && value !== "" && Number.isFinite(price)
        ? { ...st, price: value, down: String(Math.round((price * keepPct) / 100)) }
        : { ...st, price: value };
    });
  const typeDown = (value: string) => {
    setKeepPct(null);
    set("down")(value);
  };

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
  const principalShare = result ? (result.principal / result.totalRepaid) * 100 : 0;
  const roll = useRoll(result ? result.emi : null);
  // A long loan is a long table on a phone: the first five years show, the rest on request.
  const [allYears, setAllYears] = useState(false);
  const FIRST = 5;
  const years = result ? (allYears ? result.schedule : result.schedule.slice(0, FIRST)) : [];
  const rolled = roll.shown === null ? "₹ –" : formatINR(Math.round(roll.shown));

  return (
    <div className={s.layout}>
      {/* On a phone the figure stays in view while the sliders move. */}
      <div className={s.strip} aria-hidden="true">
        <span>Monthly EMI</span>
        <strong>{rolled}</strong>
      </div>

      <form className={s.form} onSubmit={(e) => e.preventDefault()} aria-label="Loan details">
        <Field
          id={id("price")}
          label="Property price"
          error={errors.price}
          hint="An example figure, not a Disha Habitat price."
          note={Number.isFinite(input.price) && input.price > 0 ? formatINRShort(input.price) : undefined}
        >
          <MoneyInput id={id("price")} value={v.price} onChange={setPrice} error={errors.price} />
          <Range
            label="Property price"
            min={0}
            max={1000}
            value={toSlider(Number.isFinite(input.price) ? input.price : PRICE_SLIDER.min)}
            onChange={(e) => setPrice(String(fromSlider(Number(e.target.value))))}
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
          <MoneyInput id={id("down")} value={v.down} onChange={typeDown} error={errors.downPayment} />
          <div className={s.chips} role="group" aria-label="Set down payment to a share of the price">
            {[10, 20, 30].map((pct) => {
              const on = downPct !== null && Math.abs(downPct - pct) < 0.05;
              return (
                <button
                  key={pct}
                  type="button"
                  className={s.chip}
                  disabled={!Number.isFinite(input.price)}
                  aria-pressed={on}
                  onClick={() => {
                    setKeepPct(pct);
                    set("down")(String(Math.round((input.price * pct) / 100)));
                  }}
                >
                  {pct}%
                </button>
              );
            })}
          </div>
        </Field>

        <Field id={id("rate")} label="Interest rate" error={errors.annualRate} hint="Per year, as your bank quotes it">
          <Box suffix="% p.a." invalid={!!errors.annualRate}>
            <input
              id={id("rate")}
              inputMode="decimal"
              autoComplete="off"
              value={v.rate}
              onChange={(e) => set("rate")(decimal(e.target.value).slice(0, 5))}
              aria-invalid={!!errors.annualRate}
              aria-describedby={errors.annualRate ? `${id("rate")}-error` : `${id("rate")}-hint`}
              className={s.input}
            />
          </Box>
          <Range
            label="Interest rate"
            min={LIMITS.annualRate.min}
            max={15}
            step={0.05}
            value={Number.isFinite(input.annualRate) ? Math.min(input.annualRate, 15) : 0}
            onChange={(e) => set("rate")(String(Number(e.target.value)))}
            aria-valuetext={`${v.rate}% per year`}
          />
        </Field>

        <Field id={id("years")} label="Loan length (tenure)" error={errors.years} hint="1 to 30 years">
          <Box suffix="years" invalid={!!errors.years}>
            <input
              id={id("years")}
              inputMode="numeric"
              autoComplete="off"
              value={v.years}
              onChange={(e) => set("years")(digits(e.target.value).slice(0, 2))}
              aria-invalid={!!errors.years}
              aria-describedby={errors.years ? `${id("years")}-error` : `${id("years")}-hint`}
              className={s.input}
            />
          </Box>
          <Range
            label="Loan length in years"
            min={LIMITS.years.min}
            max={LIMITS.years.max}
            step={1}
            value={Number.isFinite(input.years) ? input.years : 1}
            onChange={(e) => set("years")(e.target.value)}
            aria-valuetext={`${v.years} years`}
          />
        </Field>

        <Field
          id={id("income")}
          label="Monthly household income (optional)"
          error={errors.monthlyIncome}
          hint="Only used to show what share of it the EMI would be."
        >
          <MoneyInput id={id("income")} value={v.income} onChange={set("income")} error={errors.monthlyIncome} placeholder="Leave blank to skip" />
        </Field>

        <button type="button" onClick={() => setV(EXAMPLE)} className={`text-link ${s.more}`}>
          Reset to the example
        </button>
      </form>

      <aside className={s.result} aria-label="Your estimate">
        <div>
          <h2 className={s.resultLabel}>Your monthly EMI</h2>
          <p className={`display ${s.emi}`} data-empty={result ? undefined : true} aria-live="polite" aria-atomic="true">
            <span aria-hidden="true">{rolled}</span>
            <span className="sr-only">{roll.settled === null ? "₹ –" : formatINR(Math.round(roll.settled))}</span>
          </p>
          <p className={s.emiNote}>
            {result ? (
              <>
                for {result.months} months
                {Math.round(result.finalEmi) !== result.emi && <>, the last one {formatINR(result.finalEmi)} to clear the loan exactly</>}
              </>
            ) : (
              "Correct the highlighted details to see your estimate."
            )}
          </p>
        </div>

        {result && (
          <>
            <dl className={s.sum}>
              <div>
                <dt>Loan amount</dt>
                <dd>{formatINR(result.principal)}</dd>
              </div>
              <div>
                <dt>Down payment</dt>
                <dd>{formatINR(input.downPayment)}</dd>
              </div>
              <div>
                <dt>Total interest</dt>
                <dd>{formatINR(result.totalInterest)}</dd>
              </div>
              <div data-total>
                <dt>Total you repay</dt>
                <dd>{formatINR(result.totalRepaid)}</dd>
              </div>
            </dl>

            <div className={s.split}>
              <div className={s.bar} aria-hidden>
                <span style={{ transform: `scaleX(${principalShare / 100})` }} />
              </div>
              <p>
                <span>
                  <i aria-hidden data-k="principal" /> Principal {Math.round(principalShare)}%
                </span>
                <span>
                  <i aria-hidden data-k="interest" /> Interest {100 - Math.round(principalShare)}%
                </span>
              </p>
            </div>

            {result.emiToIncome !== null && (
              <p className={s.income}>
                The EMI would be <strong>{(result.emiToIncome * 100).toFixed(1)}%</strong> of the monthly income you entered.
              </p>
            )}

            <Accordion
              defaultOpen={null}
              items={[
                {
                  title: "Year-by-year breakdown",
                  body: (
                    <>
                      <div className={s.tableWrap} tabIndex={0} role="region" aria-label="Year-by-year breakdown, scrollable">
                        <table id={id("years-table")} className={s.table}>
                          <caption className="sr-only">Estimated repayment for each year of the loan</caption>
                          <thead>
                            <tr>
                              <th scope="col">Year</th>
                              <th scope="col">Principal</th>
                              <th scope="col">Interest</th>
                              <th scope="col">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {years.map((r) => (
                              <tr key={r.year} style={{ "--n": Math.min(r.year, 12) } as CSSProperties}>
                                <th scope="row">{r.year}</th>
                                <td>{formatINR(r.principalPaid)}</td>
                                <td>{formatINR(r.interestPaid)}</td>
                                <td>{formatINR(r.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {result.schedule.length > FIRST && (
                        <button
                          type="button"
                          className={`text-link ${s.more}`}
                          aria-expanded={allYears}
                          aria-controls={id("years-table")}
                          onClick={() => setAllYears((x) => !x)}
                        >
                          {allYears ? `Show the first ${FIRST} years` : `Show all ${result.schedule.length} years`}
                        </button>
                      )}
                    </>
                  ),
                },
              ]}
            />
          </>
        )}

        <Link href={links.bookVisit} className={`btn btn-primary ${s.cta}`}>
          Book a visit
        </Link>
        <p className={s.fine}>
          An estimate for planning only, using the standard reducing-balance method with monthly rests. It is not an offer of
          finance or an eligibility check by Disha Habitat or any lender. Fees, insurance and floating-rate changes are not
          included. Nothing you enter leaves your browser.
        </p>
      </aside>
    </div>
  );
}
