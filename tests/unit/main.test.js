import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/fizzbuzz.js';

describe('fizzBuzz core', () => {
  it('fizzBuzz(0) returns []', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('fizzBuzz(15) length 15 and last is FizzBuzz', () => {
    const out = fizzBuzz(15);
    expect(out.length).toBe(15);
    expect(out[14]).toBe('FizzBuzz');
  });

  it('fizzBuzzSingle behavior', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('negative inputs throw RangeError', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-2)).toThrow(RangeError);
  });

  it('non-integer throws TypeError', () => {
    expect(() => fizzBuzz(3.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(NaN)).toThrow(TypeError);
  });
});
