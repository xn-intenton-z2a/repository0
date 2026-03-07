import { describe, it, expect } from 'vitest';
import { fizzBuzzSingle, fizzBuzz } from '../../src/lib/main.js';

describe('fizzBuzzSingle', () => {
  it('returns "fizz" for multiples of 3 only', () => {
    expect(fizzBuzzSingle(3)).toBe('fizz');
    expect(fizzBuzzSingle(-6)).toBe('fizz');
  });

  it('returns "buzz" for multiples of 5 only', () => {
    expect(fizzBuzzSingle(5)).toBe('buzz');
    expect(fizzBuzzSingle(-10)).toBe('buzz');
  });

  it('returns "fizzbuzz" for multiples of 3 and 5', () => {
    expect(fizzBuzzSingle(15)).toBe('fizzbuzz');
    expect(fizzBuzzSingle(-30)).toBe('fizzbuzz');
  });

  it('returns the number as string when not divisible by 3 or 5', () => {
    expect(fizzBuzzSingle(7)).toBe('7');
    expect(fizzBuzzSingle(1)).toBe('1');
  });

  it('accepts mathematically integer floats like 3.0', () => {
    expect(fizzBuzzSingle(3.0)).toBe('fizz');
  });

  it('throws TypeError for non-integer finite numbers', () => {
    expect(() => fizzBuzzSingle(3.5)).toThrow(TypeError);
  });

  it('throws TypeError for NaN and non-number types', () => {
    expect(() => fizzBuzzSingle(NaN)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(undefined)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(null)).toThrow(TypeError);
    expect(() => fizzBuzzSingle('3')).toThrow(TypeError);
  });
});

describe('fizzBuzz (range)', () => {
  it('returns correct array for range start <= end', () => {
    expect(fizzBuzz(1, 5)).toEqual(['1','2','fizz','4','buzz']);
    expect(fizzBuzz(13, 16)).toEqual(['13','14','fizzbuzz','16']);
  });

  it('returns empty array when start > end', () => {
    expect(fizzBuzz(5, 3)).toEqual([]);
  });

  it('throws TypeError for non-integer or invalid inputs', () => {
    expect(() => fizzBuzz(1.5, 5)).toThrow(TypeError);
    expect(() => fizzBuzz(1, '5')).toThrow(TypeError);
    expect(() => fizzBuzz(NaN, 5)).toThrow(TypeError);
  });

  it('works with negative ranges', () => {
    expect(fizzBuzz(-3, 3)).toEqual([
      'fizz', '-2', '-1', '0', '1', '2', 'fizz'
    ]);
  });
});
