// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('FizzBuzz', () => {
  test('fizzBuzz(15) returns expected array', () => {
    const expected = [
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  test('fizzBuzz(0) returns []', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test('fizzBuzz negative throws RangeError', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });

  test('fizzBuzz non-integer throws TypeError', () => {
    expect(() => fizzBuzz(3.5)).toThrow(TypeError);
  });

  test('fizzBuzz NaN throws TypeError', () => {
    expect(() => fizzBuzz(NaN)).toThrow(TypeError);
  });

  test('fizzBuzz Infinity throws RangeError', () => {
    expect(() => fizzBuzz(Infinity)).toThrow(RangeError);
  });

  test('fizzBuzzSingle examples', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  test('fizzBuzzSingle zero/negative validation', () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-3)).toThrow(RangeError);
  });

  test('fizzBuzzSingle non-integer and NaN/Infinity', () => {
    expect(() => fizzBuzzSingle(2.2)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(NaN)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(Infinity)).toThrow(RangeError);
  });
});
