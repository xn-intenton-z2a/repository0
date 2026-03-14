// SPDX-License-Identifier: MIT
// Tests for fizzBuzz features
import { describe, test, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('fizzBuzzSingle', () => {
  test('3 => Fizz', () => expect(fizzBuzzSingle(3)).toBe('Fizz'));
  test('5 => Buzz', () => expect(fizzBuzzSingle(5)).toBe('Buzz'));
  test('15 => FizzBuzz', () => expect(fizzBuzzSingle(15)).toBe('FizzBuzz'));
  test('7 => "7"', () => expect(fizzBuzzSingle(7)).toBe('7'));

  test('non-integer throws TypeError', () => {
    expect(() => fizzBuzzSingle(3.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle('3')).toThrow(TypeError);
  });

  test('zero and negatives throw RangeError', () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
  });
});

describe('fizzBuzz', () => {
  test('0 => []', () => expect(fizzBuzz(0)).toEqual([]));

  test('15 => correct array (ends with FizzBuzz)', () => {
    const expected = [
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  test('non-integer throws TypeError', () => {
    expect(() => fizzBuzz(5.5)).toThrow(TypeError);
    expect(() => fizzBuzz('5')).toThrow(TypeError);
  });

  test('negative throws RangeError', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });
});
