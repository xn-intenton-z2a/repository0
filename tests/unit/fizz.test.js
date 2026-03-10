// tests/unit/fizz.test.js
import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('FizzBuzz core', () => {
  it('fizzBuzz(15) returns expected array ending with FizzBuzz', () => {
    const out = fizzBuzz(15);
    expect(out).toHaveLength(15);
    expect(out[14]).toBe('FizzBuzz');
    expect(out).toEqual([
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
    ]);
  });

  it('fizzBuzzSingle behaves for key inputs', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('fizzBuzz(0) returns empty array', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('throws TypeError for non-integers', () => {
    expect(() => fizzBuzzSingle(2.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle('3')).toThrow(TypeError);
    expect(() => fizzBuzz(3.14)).toThrow(TypeError);
    expect(() => fizzBuzz('10')).toThrow(TypeError);
  });

  it('throws RangeError for negative numbers', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-5)).toThrow(RangeError);
  });

  it('has exact error messages', () => {
    expect(() => fizzBuzzSingle(2.5)).toThrow('n must be an integer');
    expect(() => fizzBuzzSingle(0)).toThrow('n must be a positive integer');
    expect(() => fizzBuzz(-1)).toThrow('n must be >= 0');
  });
});
