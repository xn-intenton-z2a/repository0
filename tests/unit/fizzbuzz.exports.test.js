// SPDX-License-Identifier: MIT
// Tests for exported fizzBuzz functions and edge cases
import { describe, test, expect } from "vitest";
import * as lib from "../../src/lib/main.js";

describe("fizzBuzz exports and edge cases", () => {
  test("named exports exist and are functions", () => {
    expect(typeof lib.fizzBuzz).toBe("function");
    expect(typeof lib.fizzBuzzSingle).toBe("function");
  });

  test("fizzBuzzSingle basic behaviour", () => {
    expect(lib.fizzBuzzSingle(3)).toBe("Fizz");
    expect(lib.fizzBuzzSingle(5)).toBe("Buzz");
    expect(lib.fizzBuzzSingle(15)).toBe("FizzBuzz");
    expect(lib.fizzBuzzSingle(7)).toBe("7");
  });

  test("fizzBuzz edge cases and errors", () => {
    expect(lib.fizzBuzz(0)).toEqual([]);
    expect(() => lib.fizzBuzz(-1)).toThrow(RangeError);
    expect(() => lib.fizzBuzz(2.5)).toThrow(TypeError);
    expect(() => lib.fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => lib.fizzBuzzSingle(2.2)).toThrow(TypeError);
  });
});
