/*
 * Home-loan arithmetic for the Affordability Explorer. Pure functions, no I/O.
 * Standard reducing-balance EMI: EMI = P·r·(1+r)^n / ((1+r)^n − 1),
 * with r = annual rate / 12 / 100 and n = years × 12. At 0% interest, EMI = P / n.
 */

export type LoanInput = {
  price: number;
  downPayment: number;
  annualRate: number;
  years: number;
  monthlyIncome?: number | null;
};

export const LIMITS = {
  price: { min: 5_00_000, max: 50_00_00_000 },
  annualRate: { min: 0, max: 20 },
  years: { min: 1, max: 30 },
  monthlyIncome: { min: 0, max: 10_00_00_000 },
} as const;

export type LoanErrors = Partial<Record<keyof LoanInput, string>>;

export function validateLoan(input: LoanInput): LoanErrors {
  const e: LoanErrors = {};
  const { price, downPayment, annualRate, years, monthlyIncome } = input;
  if (!Number.isFinite(price) || price < LIMITS.price.min || price > LIMITS.price.max)
    e.price = `Enter a property price between ${formatINRShort(LIMITS.price.min)} and ${formatINRShort(LIMITS.price.max)}.`;
  if (!Number.isFinite(downPayment) || downPayment < 0) e.downPayment = "Down payment can’t be negative.";
  else if (Number.isFinite(price) && downPayment >= price)
    e.downPayment = "Down payment must be less than the property price, or there’s no loan to calculate.";
  if (!Number.isFinite(annualRate) || annualRate < LIMITS.annualRate.min || annualRate > LIMITS.annualRate.max)
    e.annualRate = "Enter an interest rate between 0% and 20%.";
  if (!Number.isInteger(years) || years < LIMITS.years.min || years > LIMITS.years.max)
    e.years = "Enter a whole number of years between 1 and 30.";
  if (monthlyIncome != null && (!Number.isFinite(monthlyIncome) || monthlyIncome < 0 || monthlyIncome > LIMITS.monthlyIncome.max))
    e.monthlyIncome = "Enter a monthly income of zero or more, or leave it blank.";
  return e;
}

export function monthlyEmi(principal: number, annualRate: number, years: number): number {
  const n = years * 12;
  const r = annualRate / 12 / 100;
  if (principal <= 0) return 0;
  if (r === 0) return principal / n;
  const growth = Math.pow(1 + r, n);
  return (principal * r * growth) / (growth - 1);
}

export type YearRow = { year: number; principalPaid: number; interestPaid: number; balance: number };

export type LoanResult = {
  principal: number;
  /* The monthly instalment, rounded to the rupee as lenders quote it. */
  emi: number;
  /* The formula's unrounded value, for reference. */
  emiExact: number;
  /* The last instalment, adjusted by a few rupees so the loan ends at exactly zero. */
  finalEmi: number;
  months: number;
  totalRepaid: number;
  totalInterest: number;
  emiToIncome: number | null;
  schedule: YearRow[];
};

/*
 * Month-by-month repayment, worked in whole paise so no floating-point drift accumulates:
 * each month's interest is the outstanding balance × r (rounded to the paisa), the rest of the
 * rupee-rounded EMI repays principal, and the final instalment clears whatever remains.
 * Every total shown is therefore the exact sum of the payments in the schedule.
 */
export function calculateLoan(input: LoanInput): LoanResult {
  const principal = input.price - input.downPayment;
  const months = input.years * 12;
  const r = input.annualRate / 12 / 100;
  const emiExact = monthlyEmi(principal, input.annualRate, input.years);
  const emi = Math.round(emiExact);

  let balance = Math.round(principal * 100); // paise
  const payment = emi * 100;
  let totalPaid = 0;
  let finalEmi = emi;
  const schedule: YearRow[] = [];
  let yPrincipal = 0;
  let yInterest = 0;

  for (let m = 1; m <= months; m++) {
    const interest = Math.round(balance * r);
    let pay = payment;
    if (m === months || pay >= balance + interest) {
      pay = balance + interest; // the final instalment clears the loan exactly
      finalEmi = pay / 100;
    }
    const toPrincipal = pay - interest;
    balance -= toPrincipal;
    totalPaid += pay;
    yPrincipal += toPrincipal;
    yInterest += interest;
    if (m % 12 === 0 || balance === 0) {
      schedule.push({ year: Math.ceil(m / 12), principalPaid: yPrincipal / 100, interestPaid: yInterest / 100, balance: balance / 100 });
      yPrincipal = 0;
      yInterest = 0;
    }
    if (balance === 0) break;
  }

  const totalRepaid = totalPaid / 100;
  const income = input.monthlyIncome ?? null;
  return {
    principal,
    emi,
    emiExact,
    finalEmi,
    months,
    totalRepaid,
    totalInterest: totalRepaid - principal,
    emiToIncome: income && income > 0 ? emi / income : null,
    schedule,
  };
}

/* Kept for callers that only need the yearly rows. */
export function yearlySchedule(principal: number, annualRate: number, years: number): YearRow[] {
  return calculateLoan({ price: principal, downPayment: 0, annualRate, years }).schedule;
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/* ₹52,069, Indian digit grouping. */
export function formatINR(n: number) {
  return inr.format(Math.round(n));
}

/* ₹75 lakh / ₹1.25 crore, how Indian buyers talk about prices. */
export function formatINRShort(n: number) {
  const trim = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));
  if (n >= 1_00_00_000) return `₹${trim(n / 1_00_00_000)} crore`;
  if (n >= 1_00_000) return `₹${trim(n / 1_00_000)} lakh`;
  return formatINR(n);
}
