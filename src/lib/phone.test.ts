import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePhone } from "./phone.ts";

test("Indian mobiles in every common form", () => {
  for (const s of ["98765 43210", "098765 43210", "+91 98765 43210", "0091 9876543210", "919876543210", "+91-98765-43210"])
    assert.equal(parsePhone(s).display, "+91 98765 43210", s);
});

test("numbers from abroad, with a country code", () => {
  assert.equal(parsePhone("+971 50 123 4567").display, "+971501234567");
  assert.equal(parsePhone("00971501234567").display, "+971501234567");
  assert.equal(parsePhone("+1 (206) 555-0134").display, "+12065550134");
});

test("rejects what cannot be a mobile number", () => {
  for (const s of ["12345", "+91 12345 67890", "5876543210", "971501234567"]) assert.equal(parsePhone(s).ok, false, s);
  assert.equal(parsePhone("  ").empty, true);
});

test("digits typed in Devanagari, Kannada or Tamil", () => {
  assert.equal(parsePhone("९८७६५ ४३२१०").display, "+91 98765 43210");
  assert.equal(parsePhone("೯೮೭೬೫ ೪೩೨೧೦").display, "+91 98765 43210");
  assert.equal(parsePhone("+௯௭௧ ௫௦ ௧௨௩ ௪௫௬௭").display, "+971501234567");
});

test("international boundaries and separators", () => {
  assert.equal(parsePhone("+44 7911 123456").display, "+447911123456");
  assert.equal(parsePhone("+65-9123-4567").display, "+6591234567");
  assert.equal(parsePhone("+1 206 555 0134").ok, true);
  assert.equal(parsePhone("+971 50").ok, false); // too short
  assert.equal(parsePhone("+9715012345678901").ok, false); // too long
  assert.equal(parsePhone("+0 123 456 7890").ok, false); // no country code starts with 0
  assert.equal(parsePhone("+").ok, false);
});
