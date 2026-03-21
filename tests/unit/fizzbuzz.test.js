// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe("fizzBuzzSingle", () => {
  test("returns Fizz for multiples of 3", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
  });

  test("returns Buzz for multiples of 5", () => {
    expect(fizzBuzzSingle(5)).toBe("Buzz");
  });

  test("returns FizzBuzz for multiples of 15", () => {
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
  });

  test("returns number as string for non-multiples", () => {
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("throws TypeError for non-integers", () => {
    expect(() => fizzBuzzSingle(3.5)).toThrow(TypeError);
  });

  test("throws RangeError for negative numbers or zero", () => {
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
  });
});

describe("fizzBuzz", () => {
  test("returns correct 15-element array ending with FizzBuzz", () => {
    const expected = [
      "1",
      "2",
      "Fizz",
      "4",
      "Buzz",
      "Fizz",
      "7",
      "8",
      "Fizz",
      "Buzz",
      "11",
      "Fizz",
      "13",
      "14",
      "FizzBuzz",
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  test("returns empty array for 0", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("throws TypeError for non-integers", () => {
    expect(() => fizzBuzz(2.7)).toThrow(TypeError);
  });

  test("throws RangeError for negative numbers", () => {
    expect(() => fizzBuzz(-5)).toThrow(RangeError);
  });
});
