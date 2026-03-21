// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('fizzBuzzSingle dedicated tests', () => {
  test('fizzBuzzSingle returns correct strings for examples', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  test('fizzBuzzSingle rejects non-integers and NaN/Infinity', () => {
    expect(() => fizzBuzzSingle(2.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(NaN)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(Infinity)).toThrow(RangeError);
  });

  test('fizzBuzzSingle rejects zero and negative with RangeError', () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
  });

  test('fizzBuzz integrates with fizzBuzzSingle for n=0 and small n', () => {
    expect(fizzBuzz(0)).toEqual([]);
    expect(fizzBuzz(1)).toEqual(['1']);
  });
});
