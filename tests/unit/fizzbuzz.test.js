// SPDX-License-Identifier: MIT
// Comprehensive unit tests for FizzBuzz library
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

  test("returns numeric string for non-multiples", () => {
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("throws RangeError for negative numbers", () => {
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
  });

  test("throws TypeError for non-integers", () => {
    expect(() => fizzBuzzSingle(2.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(NaN)).toThrow(TypeError);
  });
});

describe("fizzBuzz", () => {
  test("returns empty array for n = 0", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("returns correct array up to n and fizzBuzz(15) ends with FizzBuzz", () => {
    const arr = fizzBuzz(15);
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.length).toBe(15);
    expect(arr[14]).toBe("FizzBuzz");
    // spot-check some values
    expect(arr[2]).toBe("Fizz"); // 3
    expect(arr[4]).toBe("Buzz"); // 5
    expect(arr[6]).toBe("7");
  });

  test("throws RangeError for negative n", () => {
    expect(() => fizzBuzz(-5)).toThrow(RangeError);
  });

  test("throws TypeError for non-integer n", () => {
    expect(() => fizzBuzz(4.2)).toThrow(TypeError);
  });
});
