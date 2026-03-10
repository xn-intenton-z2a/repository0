import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('fizzBuzzSingle', () => {
  it('returns Fizz for 3', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
  });
  it('returns Buzz for 5', () => {
    expect(fizzBuzzSingle(5)).toBe('Buzz');
  });
  it('returns FizzBuzz for 15', () => {
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  });
  it('returns number string for non-multiple', () => {
    expect(fizzBuzzSingle(7)).toBe('7');
  });
  it('throws TypeError for non-integers', () => {
    expect(() => fizzBuzzSingle(3.5)).toThrow(TypeError);
  });
  it('throws RangeError for non-positive integers', () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
  });
});

describe('fizzBuzz', () => {
  it('returns empty array for 0', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });
  it('returns correct 1..15 sequence', () => {
    const out = fizzBuzz(15);
    expect(out.length).toBe(15);
    expect(out[14]).toBe('FizzBuzz');
    expect(out[0]).toBe('1');
    expect(out[2]).toBe('Fizz');
    expect(out[4]).toBe('Buzz');
  });
  it('throws TypeError for non-integers', () => {
    expect(() => fizzBuzz(2.2)).toThrow(TypeError);
  });
  it('throws RangeError for negative numbers', () => {
    expect(() => fizzBuzz(-5)).toThrow(RangeError);
  });
});
