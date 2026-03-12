// SPDX-License-Identifier: MIT
// Unit tests for Hamming distance functions
import { describe, test, expect } from "vitest";
import { hammingDistance, hammingDistanceBits } from "../../src/lib/main.js";

describe("hammingDistance", () => {
  test("karolin vs kathrin => 3", () => {
    expect(hammingDistance("karolin", "kathrin")).toBe(3);
  });

  test("empty strings => 0", () => {
    expect(hammingDistance("", "")).toBe(0);
  });

  test("unequal lengths throws RangeError", () => {
    expect(() => hammingDistance("a", "bb")).toThrow(RangeError);
  });

  test("handles Unicode code points correctly", () => {
    // 'a😊' vs 'b😊' differ at first code point only
    expect(hammingDistance('a😊', 'b😊')).toBe(1);
  });

  test("non-string inputs throw TypeError", () => {
    expect(() => hammingDistance(123, "abc")).toThrow(TypeError);
  });
});

describe("hammingDistanceBits", () => {
  test("1 vs 4 => 2", () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  test("0 vs 0 => 0", () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  test("large integer example", () => {
    expect(hammingDistanceBits(0xFFFFFFFF, 0)).toBe(32);
  });

  test("negative integers throw RangeError", () => {
    expect(() => hammingDistanceBits(-1, 0)).toThrow(RangeError);
  });

  test("non-integer numbers throw TypeError", () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
  });
});
