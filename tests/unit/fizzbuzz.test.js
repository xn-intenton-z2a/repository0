// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle, fizzBuzzFormatted, fizzBuzzSingleFormatted } from '../../src/lib/fizz.js';

describe('FizzBuzz core', () => {
  test('fizzBuzz(15) returns 15 items ending with FizzBuzz', () => {
    const arr = fizzBuzz(15);
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.length).toBe(15);
    expect(arr[14]).toBe('FizzBuzz');
  });

  test('fizzBuzzSingle canonical values', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  test('fizzBuzz(0) returns empty array', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test('formatter functions work', () => {
    const formatted = fizzBuzzFormatted(5, (n, s) => `${n}:${s}`);
    expect(formatted[0]).toBe('1:1');
    expect(formatted[2]).toBe('3:Fizz');
    expect(() => fizzBuzzFormatted(3, null)).toThrow(TypeError);
    expect(() => fizzBuzzSingleFormatted(3, null)).toThrow(/formatter/);
  });

  test('validation: non-number and non-integer inputs throw TypeError', () => {
    const badInputs = ["3", [], {}, null, undefined, 2.5, NaN, Infinity];
    for (const v of badInputs) {
      expect(() => fizzBuzzSingle(v)).toThrow(TypeError);
      expect(() => fizzBuzz(v)).toThrow(TypeError);
    }
  });

  test('validation: negative integers throw RangeError', () => {
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });
});
