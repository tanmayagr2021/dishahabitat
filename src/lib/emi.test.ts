import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateLoan, formatINR, formatINRShort, monthlyEmi, validateLoan, yearlySchedule } from "./emi.ts";

const close = (actual: number, expected: number, tolerance = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);

test("EMI matches published reference values", () => {
  close(monthlyEmi(10_00_000, 10, 10), 13215.07);
  close(monthlyEmi(50_00_000, 8.5, 20), 43391.16);
  close(monthlyEmi(60_00_000, 8.5, 20), 52069.39);
  close(monthlyEmi(25_00_000, 9, 15), 25356.66);
  close(monthlyEmi(1_00_000, 12, 1), 8884.88);
});

test("zero interest divides principal evenly", () => {
  assert.equal(monthlyEmi(12_00_000, 0, 10), 10_000);
  const r = calculateLoan({ price: 12_00_000, downPayment: 0, annualRate: 0, years: 10 });
  assert.equal(r.totalInterest, 0);
});

test("totals and income ratio", () => {
  const r = calculateLoan({ price: 75_00_000, downPayment: 15_00_000, annualRate: 8.5, years: 20, monthlyIncome: 2_00_000 });
  assert.equal(r.principal, 60_00_000);
  close(r.emi, 52069.39);
  close(r.totalRepaid, 12496654.56, 0.5);
  close(r.totalInterest, 6496654.56, 0.5);
  close(r.emiToIncome!, 52069.39 / 2_00_000, 1e-6);
  assert.equal(calculateLoan({ price: 75_00_000, downPayment: 0, annualRate: 8.5, years: 20 }).emiToIncome, null);
});

test("schedule repays the full principal and sums to total interest", () => {
  const rows = yearlySchedule(60_00_000, 8.5, 20);
  assert.equal(rows.length, 20);
  assert.equal(rows.at(-1)!.balance, 0);
  close(rows.reduce((s, r) => s + r.principalPaid, 0), 60_00_000, 1);
  close(rows.reduce((s, r) => s + r.interestPaid, 0), 6496654.56, 1);
  assert.ok(rows[0].interestPaid > rows[0].principalPaid, "early years are interest-heavy");
});

test("validation", () => {
  const ok = { price: 75_00_000, downPayment: 15_00_000, annualRate: 8.5, years: 20 };
  assert.deepEqual(validateLoan(ok), {});
  assert.ok(validateLoan({ ...ok, downPayment: 75_00_000 }).downPayment);
  assert.ok(validateLoan({ ...ok, downPayment: -1 }).downPayment);
  assert.ok(validateLoan({ ...ok, price: 1000 }).price);
  assert.ok(validateLoan({ ...ok, annualRate: 25 }).annualRate);
  assert.ok(validateLoan({ ...ok, years: 0 }).years);
  assert.ok(validateLoan({ ...ok, years: 12.5 }).years);
  assert.ok(validateLoan({ ...ok, monthlyIncome: -5 }).monthlyIncome);
  assert.ok(validateLoan({ ...ok, price: Number.NaN }).price);
});

test("Indian currency formatting", () => {
  assert.equal(formatINR(5206939.4), "₹52,06,939");
  assert.equal(formatINRShort(75_00_000), "₹75 lakh");
  assert.equal(formatINRShort(1_25_00_000), "₹1.25 crore");
  assert.equal(formatINRShort(5_00_000), "₹5 lakh");
});
