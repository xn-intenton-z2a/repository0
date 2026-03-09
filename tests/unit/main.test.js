import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('fizzBuzz library', () => {
  it('fizzBuzz(1) -> ["1"]', () => {
    expect(fizzBuzz(1)).toEqual(['1']);
  });

  it('fizzBuzz(3) -> ["1","2","Fizz"]', () => {
    expect(fizzBuzz(3)).toEqual(['1', '2', 'Fizz']);
  });

  it('fizzBuzz(5) has Fizz at index 2 and Buzz at index 4', () => {
    const r = fizzBuzz(5);
    expect(r[2]).toBe('Fizz');
    expect(r[4]).toBe('Buzz');
  });

  it('fizzBuzz(15)[14] === "FizzBuzz" and length 15', () => {
    const r = fizzBuzz(15);
    expect(r[14]).toBe('FizzBuzz');
    expect(r.length).toBe(15);
  });

  it('elements are strings and deterministic', () => {
    const r = fizzBuzz(7);
    expect(r.every(x => typeof x === 'string')).toBe(true);
    expect(r[6]).toBe('7');
  });

  it('fizzBuzzSingle behavior', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('invalid inputs throw TypeError with specific message', () => {
    const invalids = [0, -1, 2.5, NaN, '10', null, undefined, Infinity];
    for (const v of invalids) {
      // fizzBuzz
      expect(() => fizzBuzz(v)).toThrowError(TypeError);
      expect(() => fizzBuzz(v)).toThrow('n must be a positive integer');
      // fizzBuzzSingle
      expect(() => fizzBuzzSingle(v)).toThrowError(TypeError);
      expect(() => fizzBuzzSingle(v)).toThrow('n must be a positive integer');
    }
  });
});
