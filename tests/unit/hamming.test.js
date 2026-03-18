// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { hammingDistance, hammingDistanceBits } from "../../src/lib/main.js";

describe("hammingDistance (strings)", () => {
  test("karolin vs kathrin -> 3", () => {
    expect(hammingDistance("karolin", "kathrin")).toBe(3);
  });

  test("empty strings -> 0", () => {
    expect(hammingDistance("", "")).toBe(0);
  });

  test("different length strings throw RangeError", () => {
    expect(() => hammingDistance("a", "ab")).toThrow(RangeError);
  });

  test("non-string arguments throw TypeError", () => {
    expect(() => hammingDistance(null, "a")).toThrow(TypeError);
    expect(() => hammingDistance("a", 123)).toThrow(TypeError);
  });

  test("handles Unicode astral code points (emoji) correctly", () => {
    const a = "a\u{1F600}"; // a + 😀
    const b = "a\u{1F601}"; // a + 😁
    // differ at the second code point only
    expect(hammingDistance(a, b)).toBe(1);
  });
});

describe("hammingDistanceBits (integers)", () => {
  test("1 vs 4 -> 2", () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  test("0 vs 0 -> 0", () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  test("large integers and zero", () => {
    const a = 2 ** 40; // well within safe integer range
    const b = 0;
    expect(hammingDistanceBits(a, b)).toBe(1);
  });

  test("non-integer or non-number throws TypeError", () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
    expect(() => hammingDistanceBits("1", 2)).toThrow(TypeError);
  });

  test("negative integers throw RangeError", () => {
    expect(() => hammingDistanceBits(-1, 2)).toThrow(RangeError);
    expect(() => hammingDistanceBits(1, -2)).toThrow(RangeError);
  });

  test("same large integers -> 0", () => {
    const v = Number.MAX_SAFE_INTEGER - 1;
    expect(hammingDistanceBits(v, v)).toBe(0);
  });
});
