// SPDX-License-Identifier: MIT
// Hamming distance unit tests
import { describe, test, expect } from "vitest";
import { hammingString, hammingBits } from "../../src/lib/main.js";

describe("hammingString", () => {
  test("karolin vs kathrin => 3", () => {
    expect(hammingString("karolin", "kathrin")).toBe(3);
  });

  test("empty strings => 0", () => {
    expect(hammingString("", "")).toBe(0);
  });

  test("unicode code points are handled (emoji)", () => {
    // two strings with same number of code points but differ
    const a = "a\u{1F600}b"; // a😀b
    const b = "a\u{1F601}b"; // a😁b
    expect(hammingString(a, b)).toBe(1);
  });

  test("different lengths throws RangeError", () => {
    expect(() => hammingString("abc", "ab")).toThrow(RangeError);
  });

  test("non-string inputs throw TypeError", () => {
    // @ts-ignore
    expect(() => hammingString(1, "a")).toThrow(TypeError);
    // @ts-ignore
    expect(() => hammingString("a", null)).toThrow(TypeError);
  });
});

describe("hammingBits", () => {
  test("1 vs 4 => 2", () => {
    expect(hammingBits(1, 4)).toBe(2);
  });

  test("0 vs 0 => 0", () => {
    expect(hammingBits(0, 0)).toBe(0);
  });

  test("large integers", () => {
    const a = 0b1010101010101010;
    const b = 0b0101010101010101;
    expect(hammingBits(a, b)).toBe(16);
  });

  test("non-integer throws TypeError", () => {
    // @ts-ignore
    expect(() => hammingBits(1.5, 2)).toThrow(TypeError);
    // @ts-ignore
    expect(() => hammingBits("1", 2)).toThrow(TypeError);
  });

  test("negative integers throw RangeError", () => {
    expect(() => hammingBits(-1, 2)).toThrow(RangeError);
    expect(() => hammingBits(1, -2)).toThrow(RangeError);
  });
});
