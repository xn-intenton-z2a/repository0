// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { hammingDistanceBits } from "../../src/lib/main.js";

describe("Bit Hamming Distance", () => {
  test("1 vs 4 is 2", () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  test("0 vs 0 is 0", () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  test("large integers work", () => {
    const a = 0b101010101010101010101010101010n;
    const b = 0b010101010101010101010101010101n;
    expect(hammingDistanceBits(a, b)).toBe(30);
  });

  test("negative integers throw RangeError", () => {
    // @ts-ignore
    expect(() => hammingDistanceBits(-1, 1)).toThrow(RangeError);
  });

  test("non-integer types throw TypeError", () => {
    // @ts-ignore
    expect(() => hammingDistanceBits("a", 1)).toThrow(TypeError);
  });
});
