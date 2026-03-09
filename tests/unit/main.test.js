import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('fizzBuzz library', () => {
  it('fizzBuzz(15) returns canonical sequence ending with FizzBuzz', () => {
    const expected = [
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  it('fizzBuzzSingle(3) -> Fizz, 5 -> Buzz, 15 -> FizzBuzz, 7 -> "7"', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('fizzBuzz(0) returns empty array and fizzBuzzSingle(0) throws RangeError', () => {
    expect(fizzBuzz(0)).toEqual([]);
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
  });

  it('negative integers throw RangeError', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-5)).toThrow(RangeError);
  });

  it('non-number types and non-integers throw TypeError', () => {
    expect(() => fizzBuzz('10')).toThrow(TypeError);
    expect(() => fizzBuzz(1.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle('3')).toThrow(TypeError);
    expect(() => fizzBuzzSingle(2.2)).toThrow(TypeError);
  });
});
