// SPDX-License-Identifier: MIT
// Tests for fizzBuzz functions
import { describe, test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe("FizzBuzz core", () => {
  test("fizzBuzzSingle basic cases", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
    expect(fizzBuzzSingle(5)).toBe("Buzz");
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("fizzBuzz(15) returns canonical 15-element sequence", () => {
    const out = fizzBuzz(15);
    expect(out).toEqual([
      "1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"
    ]);
  });

  test("fizzBuzz(0) returns empty array", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("invalid inputs throw appropriate errors", () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(2.5)).toThrow(TypeError);
    expect(() => fizzBuzz("3")).toThrow(TypeError);
  });
});
