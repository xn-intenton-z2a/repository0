import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('fizzBuzzSingle', () => {
  it('returns number for non-multiples', () => {
    expect(fizzBuzzSingle(1)).toBe(1);
  });
  it('returns fizz for multiples of 3', () => {
    expect(fizzBuzzSingle(3)).toBe('fizz');
  });
  it('returns buzz for multiples of 5', () => {
    expect(fizzBuzzSingle(5)).toBe('buzz');
  });
  it('returns fizzbuzz for multiples of 15', () => {
    expect(fizzBuzzSingle(15)).toBe('fizzbuzz');
  });
  it('throws on non-integer, NaN, Infinity, <=0', () => {
    const bad = [1.5, NaN, Infinity, -1, 0];
    bad.forEach((v) => expect(() => fizzBuzzSingle(v)).toThrow(TypeError));
  });
});

describe('fizzBuzz', () => {
  it('limit 5 returns expected array', () => {
    expect(fizzBuzz(5)).toEqual([1, 2, 'fizz', 4, 'buzz']);
  });
  it('limit 15 returns expected array with fizzbuzz at 15', () => {
    const res = fizzBuzz(15);
    expect(res.length).toBe(15);
    expect(res[14]).toBe('fizzbuzz');
  });
  it('throws on bad inputs', () => {
    const bad = [1.2, NaN, Infinity, -5];
    bad.forEach((v) => expect(() => fizzBuzz(v)).toThrow(TypeError));
  });
  it('0 returns empty array', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });
});
