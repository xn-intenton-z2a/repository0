// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect } from "vitest";
import { fizzBuzz, fizzBuzzSingle } from "../../src/lib/main.js";

describe('FizzBuzz core', () => {
  test('fizzBuzz(15) returns 15 elements ending with FizzBuzz', () => {
    const out = fizzBuzz(15);
    expect(Array.isArray(out)).toBe(true);
    expect(out).toHaveLength(15);
    expect(out[14]).toBe('FizzBuzz');
  });

  test('fizzBuzzSingle expected values', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  test('fizzBuzz(0) returns empty array', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test('non-integer numeric inputs throw TypeError', () => {
    expect(() => fizzBuzzSingle(3.5)).toThrow(TypeError);
    expect(() => fizzBuzz(3.5)).toThrow(TypeError);
  });

  test('negative numbers throw RangeError', () => {
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });
});
