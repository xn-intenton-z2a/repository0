// SPDX-License-Identifier: MIT
import { test, expect } from "vitest";
import { fizzBuzzSingle } from "../../src/lib/main.js";

test('fizzBuzzSingle core mappings', () => {
  expect(fizzBuzzSingle(1)).toBe("1");
  expect(fizzBuzzSingle(2)).toBe("2");
  expect(fizzBuzzSingle(3)).toBe("Fizz");
  expect(fizzBuzzSingle(4)).toBe("4");
  expect(fizzBuzzSingle(5)).toBe("Buzz");
  expect(fizzBuzzSingle(15)).toBe("FizzBuzz");
});
