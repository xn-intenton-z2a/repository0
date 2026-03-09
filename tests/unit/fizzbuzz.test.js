import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('FizzBuzz library', () => {
  it('fizzBuzz(15) returns 15-element array ending with FizzBuzz', () => {
    const res = fizzBuzz(15);
    expect(res).toHaveLength(15);
    expect(res[14]).toBe('FizzBuzz');
    const expected = [
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
    ];
    expect(res).toEqual(expected);
  });

  it('fizzBuzzSingle(3) => Fizz', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
  });
  it('fizzBuzzSingle(5) => Buzz', () => {
    expect(fizzBuzzSingle(5)).toBe('Buzz');
  });
  it('fizzBuzzSingle(15) => FizzBuzz', () => {
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  });
  it('fizzBuzzSingle(7) => "7"', () => {
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('fizzBuzz(0) returns []', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('negative numbers throw RangeError', () => {
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });

  it('non-integers throw TypeError', () => {
    expect(() => fizzBuzzSingle(3.5)).toThrow(TypeError);
    expect(() => fizzBuzz(2.2)).toThrow(TypeError);
    expect(() => fizzBuzzSingle('3')).toThrow(TypeError);
  });
});
