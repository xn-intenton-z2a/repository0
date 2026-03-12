import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('fizzBuzzSingle', () => {
  it('returns Fizz for multiples of 3', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
  });

  it('returns Buzz for multiples of 5', () => {
    expect(fizzBuzzSingle(5)).toBe('Buzz');
  });

  it('returns FizzBuzz for multiples of 15', () => {
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  });

  it('returns the number as string for non-multiples', () => {
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('throws TypeError for non-number', () => {
    expect(() => fizzBuzzSingle('a')).toThrow(TypeError);
  });

  it('throws TypeError for non-integer', () => {
    expect(() => fizzBuzzSingle(2.5)).toThrow(TypeError);
  });

  it('throws RangeError for zero or negative', () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-3)).toThrow(RangeError);
  });
});

describe('fizzBuzz', () => {
  it('returns correct array for n=15', () => {
    const out = fizzBuzz(15);
    expect(Array.isArray(out)).toBe(true);
    expect(out).toHaveLength(15);
    expect(out[0]).toBe('1');
    expect(out[2]).toBe('Fizz');
    expect(out[4]).toBe('Buzz');
    expect(out[14]).toBe('FizzBuzz');
  });

  it('returns [] for n=0', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('throws RangeError for negative', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });

  it('throws TypeError for non-integer', () => {
    expect(() => fizzBuzz(3.5)).toThrow(TypeError);
  });

  it('throws TypeError for non-number', () => {
    expect(() => fizzBuzz('10')).toThrow(TypeError);
  });
});
