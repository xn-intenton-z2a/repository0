// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { hammingString, hammingBits } from "../../src/lib/main.js";

describe("hammingString", () => {
  test("karolin vs kathrin => 3", () => {
    expect(hammingString("karolin", "kathrin")).toBe(3);
  });

  test("empty strings => 0", () => {
    expect(hammingString("", "")).toBe(0);
  });

  test("different lengths throws RangeError", () => {
    expect(() => hammingString("a", "ab")).toThrow(RangeError);
  });

  test("wrong types throw TypeError", () => {
    // Non-string arguments
    // @ts-ignore
    expect(() => hammingString(1, "a")).toThrow(TypeError);
    // @ts-ignore
    expect(() => hammingString(null, null)).toThrow(TypeError);
  });

  test("Unicode code point aware: surrogate pairs are single code points", () => {
    const a = "a\u{1F600}b"; // a😀b
    const b = "a\u{1F601}b"; // a😁b
    expect(Array.from(a).length).toBe(3);
    expect(Array.from(b).length).toBe(3);
    expect(hammingString(a, b)).toBe(1);
  });
});

describe("hammingBits", () => {
  test("1 vs 4 => 2", () => {
    expect(hammingBits(1, 4)).toBe(2);
  });

  test("0 vs 0 => 0", () => {
    expect(hammingBits(0, 0)).toBe(0);
  });

  test("accepts BigInt and counts correctly", () => {
    expect(hammingBits(1n, 4n)).toBe(2);
    expect(hammingBits(0n, 0n)).toBe(0);
  });

  test("negative integers throw RangeError", () => {
    expect(() => hammingBits(-1, 1)).toThrow(RangeError);
    expect(() => hammingBits(1, -1)).toThrow(RangeError);
  });

  test("non-integer types throw TypeError", () => {
    // float
    expect(() => hammingBits(1.5, 2)).toThrow(TypeError);
    // string
    // @ts-ignore
    expect(() => hammingBits("1", "2")).toThrow(TypeError);
  });
});
