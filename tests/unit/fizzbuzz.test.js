// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('FizzBuzz library', () => {
  test('fizzBuzz(15) returns canonical 15-item sequence', () => {
    const expected = [
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
    ];
    const out = fizzBuzz(15);
    expect(Array.isArray(out)).toBe(true);
    expect(out.length).toBe(15);
    expect(out).toEqual(expected);
    expect(out[14]).toBe('FizzBuzz');
  });

  test('fizzBuzz(0) returns empty array', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  test('fizzBuzz(1) -> ["1"] and types are strings', () => {
    const out = fizzBuzz(1);
    expect(out).toEqual(['1']);
    expect(typeof out[0]).toBe('string');
  });

  test('fizzBuzzSingle special cases', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  test('invalid inputs throw correct error types', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-2)).toThrow(RangeError);
    expect(() => fizzBuzz(2.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(NaN)).toThrow(TypeError);
    expect(() => fizzBuzzSingle('3')).toThrow(TypeError);
  });

  test('fizzBuzz returns new arrays (pure)', () => {
    const a = fizzBuzz(3);
    a[0] = 'modified';
    const b = fizzBuzz(3);
    expect(b[0]).toBe('1');
  });
});
