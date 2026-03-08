// SPDX-License-Identifier: MIT
// Tests for fizz functions
import { describe, test, expect } from 'vitest';
import { fizzValue, fizzBuzz } from '../../src/index.js';

describe('fizz functions', () => {
  test('fizzValue basic cases', () => {
    expect(fizzValue(1)).toBe('1');
    expect(fizzValue(3)).toBe('fizz');
    expect(fizzValue(5)).toBe('buzz');
    expect(fizzValue(15)).toBe('fizzbuzz');
  });

  test('fizzBuzz range', () => {
    expect(fizzBuzz(1, 5)).toEqual(['1', '2', 'fizz', '4', 'buzz']);
  });
});
