// SPDX-License-Identifier: MIT
import { test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

test('input validation: fizzBuzz and fizzBuzzSingle type and range checks', () => {
  // non-integer values
  expect(() => fizzBuzz(3.14)).toThrow(TypeError);
  expect(() => fizzBuzzSingle(2.5)).toThrow(TypeError);
  // string input
  expect(() => fizzBuzz("10")).toThrow(TypeError);
  expect(() => fizzBuzzSingle("3")).toThrow(TypeError);
  // negative values -> RangeError for both
  expect(() => fizzBuzz(-5)).toThrow(RangeError);
  expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
});
