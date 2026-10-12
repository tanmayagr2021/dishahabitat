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

/* Year-by-year amortisation; the final payment absorbs rounding so the balance ends at exactly 0. */
export function yearlySchedule(principal: number, annualRate: number, years: number): YearRow[] {
  const r = annualRate / 12 / 100;
  const payment = monthlyEmi(principal, annualRate, years);
  const rows: YearRow[] = [];
  let balance = principal;
  for (let y = 1; y <= years; y++) {
    let principalPaid = 0;
    let interestPaid = 0;
    for (let m = 0; m < 12; m++) {
      const interest = balance * r;
      const toPrincipal = Math.min(payment - interest, balance);
      interestPaid += interest;
      principalPaid += toPrincipal;
      balance -= toPrincipal;
    }
    if (y === years) balance = 0;
    rows.push({ year: y, principalPaid, interestPaid, balance: Math.max(0, balance) });
  }
  return rows;
}

export type LoanResult = {
  principal: number;
  emi: number;
  totalRepaid: number;
  totalInterest: number;
  emiToIncome: number | null;
  schedule: YearRow[];
};

export function calculateLoan(input: LoanInput): LoanResult {
  const principal = input.price - input.downPayment;
  const emi = monthlyEmi(principal, input.annualRate, input.years);
  const totalRepaid = emi * input.years * 12;
  const income = input.monthlyIncome ?? null;
  return {
    principal,
    emi,
    totalRepaid,
    totalInterest: totalRepaid - principal,
    emiToIncome: income && income > 0 ? emi / income : null,
    schedule: yearlySchedule(principal, input.annualRate, input.years),
  };
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/* ₹52,069 — Indian digit grouping. */
export function formatINR(n: number) {
  return inr.format(Math.round(n));
}

/* ₹75 lakh / ₹1.25 crore — how Indian buyers talk about prices. */
export function formatINRShort(n: number) {
  const trim = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));
  if (n >= 1_00_00_000) return `₹${trim(n / 1_00_00_000)} crore`;
  if (n >= 1_00_000) return `₹${trim(n / 1_00_000)} lakh`;
  return formatINR(n);
}
