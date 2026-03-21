// SPDX-License-Identifier: MIT
import { describe, test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe("FizzBuzz - fizzBuzzSingle", () => {
  test("3 -> Fizz, 5 -> Buzz, 15 -> FizzBuzz, 7 -> '7'", () => {
    expect(fizzBuzzSingle(3)).toBe("Fizz");
    expect(fizzBuzzSingle(5)).toBe("Buzz");
    expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
    expect(fizzBuzzSingle(7)).toBe("7");
  });

  test("non-integer throws TypeError", () => {
    expect(() => fizzBuzzSingle(2.5)).toThrow(TypeError);
  });

  test("negative throws RangeError", () => {
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
  });
});

describe("FizzBuzz - fizzBuzz", () => {
  test("fizzBuzz(15) returns 15 items and ends with FizzBuzz", () => {
    const out = fizzBuzz(15);
    expect(Array.isArray(out)).toBe(true);
    expect(out).toHaveLength(15);
    expect(out[14]).toBe("FizzBuzz");
    // spot check a few values
    expect(out[0]).toBe("1");
    expect(out[2]).toBe("Fizz");
    expect(out[4]).toBe("Buzz");
  });

  test("fizzBuzz(0) returns []", () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test("non-integer throws TypeError", () => {
    expect(() => fizzBuzz(3.5)).toThrow(TypeError);
  });

  test("negative throws RangeError", () => {
    expect(() => fizzBuzz(-5)).toThrow(RangeError);
  });
});
