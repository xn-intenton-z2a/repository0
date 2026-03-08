// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/fizz.js';

describe('fizz functions (compat)', () => {
  test('fizzSingle basic cases', () => {
    expect(fizzBuzzSingle(1)).toBe('1');
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  });

  test('fizzBuzz range 1..5', () => {
    expect(fizzBuzz(5)).toEqual(['1','2','Fizz','4','Buzz']);
  });
});
