// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { hammingDistance, hammingDistanceBits } from "../../src/lib/main.js";

describe("hammingDistance (strings)", () => {
  test("karolin vs kathrin => 3", () => {
    expect(hammingDistance("karolin", "kathrin")).toBe(3);
  });

  test("empty strings => 0", () => {
    expect(hammingDistance("", "")).toBe(0);
  });

  test("unequal lengths throws RangeError", () => {
    expect(() => hammingDistance("a", "bb")).toThrow(RangeError);
  });

  test("non-string throws TypeError", () => {
    // @ts-ignore
    expect(() => hammingDistance(1, "a")).toThrow(TypeError);
  });

  test("handles Unicode code points correctly", () => {
    // two visually similar but different code points
    const a = "e\u0301"; // e + combining acute
    const b = "é"; // precomposed
    // normalization differs: code points count must match; here lengths differ in code points
    expect(() => hammingDistance(a, b)).toThrow(RangeError);

    // same-length emoji sequences
    expect(hammingDistance("🙂🙃", "🙂🙂")).toBe(1);
  });
});

describe("hammingDistanceBits (integers)", () => {
  test("1 vs 4 => 2", () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  test("0 vs 0 => 0", () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  test("supports BigInt and large integers", () => {
    expect(hammingDistanceBits(1n, 4n)).toBe(2);
    const bigA = (1n << 65n) - 1n; // 65 ones
    const bigB = 0n;
    expect(hammingDistanceBits(bigA, bigB)).toBe(65);
  });

  test("negative integers throw RangeError", () => {
    // @ts-ignore
    expect(() => hammingDistanceBits(-1, 2)).toThrow(RangeError);
    expect(() => hammingDistanceBits(-1n, 2n)).toThrow(RangeError);
  });

  test("non-integer types throw TypeError", () => {
    // @ts-ignore
    expect(() => hammingDistanceBits("a", 1)).toThrow(TypeError);
  });
});
