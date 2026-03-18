// SPDX-License-Identifier: MIT
// tests/unit/fizz.test.js
import { describe, test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe("FizzBuzz Library", () => {
  test("fizzBuzzSingle returns expected values", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
    expect(fizzBuzzSingle(5)).toBe("Buzz");
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("fizzBuzz returns correct array for 15", () => {
    const out = fizzBuzz(15);
    expect(Array.isArray(out)).toBe(true);
    expect(out).toHaveLength(15);
    expect(out[14]).toBe("FizzBuzz");
    // spot check first 15 values
    expect(out).toEqual([
      "1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"
    ]);
  });

  test("fizzBuzz(0) -> []", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("non-integer arguments throw TypeError", () => {
    expect(() => fizzBuzz(2.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(2.5)).toThrow(TypeError);
    expect(() => fizzBuzz("3")).toThrow(TypeError);
  });

  test("negative numbers throw RangeError", () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-5)).toThrow(RangeError);
  });
});
