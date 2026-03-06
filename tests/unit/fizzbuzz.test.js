import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/fizzbuzz.js';

describe('fizzBuzzSingle', () => {
  it('returns Fizz for multiples of 3', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
  });

  it('returns Buzz for multiples of 5', () => {
    expect(fizzBuzzSingle(5)).toBe('Buzz');
  });

  it('returns FizzBuzz for multiples of 3 and 5', () => {
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  });

  it('returns the number as string otherwise', () => {
    expect(fizzBuzzSingle(2)).toBe('2');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('treats 0 as divisible (0 -> FizzBuzz)', () => {
    expect(fizzBuzzSingle(0)).toBe('FizzBuzz');
  });

  it('throws TypeError for non-integer or non-finite inputs', () => {
    const bad = [NaN, Infinity, -Infinity, '3', 3.5, null, undefined, {}];
    bad.forEach((v) => {
      expect(() => fizzBuzzSingle(v)).toThrow(TypeError);
      expect(() => fizzBuzzSingle(v)).toThrow(/n must be an integer/);
    });
  });
});

describe('fizzBuzz', () => {
  it('returns array for 1..n', () => {
    expect(fizzBuzz(1)).toEqual(['1']);
    expect(fizzBuzz(5)).toEqual(['1','2','Fizz','4','Buzz']);
  });

  it('returns correct length and last element for 15', () => {
    const out = fizzBuzz(15);
    expect(out).toHaveLength(15);
    expect(out[14]).toBe('FizzBuzz');
  });

  it('returns empty array for 0', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('throws RangeError for negative integers', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzz(-5)).toThrow(/must be >= 0/);
  });

  it('throws TypeError for non-integer or non-finite inputs', () => {
    const bad = [NaN, Infinity, '5', 2.5, null, {}];
    bad.forEach((v) => {
      expect(() => fizzBuzz(v)).toThrow(TypeError);
      expect(() => fizzBuzz(v)).toThrow(/non-negative integer/);
    });
  });
});
