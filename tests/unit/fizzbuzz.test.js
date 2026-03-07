import { describe, it, expect } from 'vitest';
import { fizzBuzzSingle, fizzBuzz } from '../../src/lib/fizzbuzz.js';

describe('fizzBuzzSingle', () => {
  it('returns Fizz for 3, Buzz for 5, FizzBuzz for 15, and number otherwise', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('handles zero and negatives', () => {
    expect(fizzBuzzSingle(0)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(-3)).toBe('Fizz');
    expect(fizzBuzzSingle(-5)).toBe('Buzz');
  });

  it('throws TypeError for invalid inputs', () => {
    const bad = [3.5, '3', NaN, Infinity, null, undefined];
    for (const v of bad) expect(() => fizzBuzzSingle(v)).toThrow(TypeError);
  });
});

describe('fizzBuzz(start, end)', () => {
  it('ascending range from 1 to 5', () => {
    expect(fizzBuzz(1,5)).toEqual(['1','2','Fizz','4','Buzz']);
  });

  it('descending range from 5 to 1', () => {
    expect(fizzBuzz(5,1)).toEqual(['Buzz','4','Fizz','2','1']);
  });

  it('single-element range', () => {
    expect(fizzBuzz(15,15)).toEqual(['FizzBuzz']);
  });

  it('validates inputs strictly and missing args', () => {
    expect(() => fizzBuzz()).toThrow(TypeError);
    expect(() => fizzBuzz(1.1,5)).toThrow(TypeError);
    expect(() => fizzBuzz(1,'5')).toThrow(TypeError);
  });

  it('handles large ranges of length 10000', () => {
    const res = fizzBuzz(1,10000);
    expect(res.length).toBe(10000);
    expect(res[0]).toBe('1');
  });
});
