import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('FizzBuzz core functions', () => {
  it('fizzBuzzSingle returns "Fizz" for 3', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
  });

  it('fizzBuzzSingle returns "Buzz" for 5', () => {
    expect(fizzBuzzSingle(5)).toBe('Buzz');
  });

  it('fizzBuzzSingle returns "FizzBuzz" for 15', () => {
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  });

  it('fizzBuzzSingle returns the number as string for non-multiples (7)', () => {
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('fizzBuzz returns empty array for 0', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('fizzBuzz(15) returns 15 elements and ends with "FizzBuzz"', () => {
    const out = fizzBuzz(15);
    expect(out).toHaveLength(15);
    expect(out[14]).toBe('FizzBuzz');
  });

  it('fizzBuzz throws RangeError for negative n', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });

  it('fizzBuzzSingle throws RangeError for non-positive n', () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-5)).toThrow(RangeError);
  });

  it('fizzBuzz throws TypeError for non-integer', () => {
    expect(() => fizzBuzz(3.5)).toThrow(TypeError);
  });

  it('fizzBuzzSingle throws TypeError for non-integer', () => {
    expect(() => fizzBuzzSingle(2.2)).toThrow(TypeError);
  });
});
