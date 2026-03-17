// SPDX-License-Identifier: MIT
// Examples from README are tested here to ensure docs remain correct
import { test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

test('README examples', () => {
  expect(fizzBuzzSingle(3)).toBe("Fizz");
  expect(fizzBuzz(15)[14]).toBe("FizzBuzz");
  expect(fizzBuzz(0)).toEqual([]);
});
