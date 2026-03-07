import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('fizz-buzz', () => {
  it('fizzBuzz(15) returns correct 15-element array ending with FizzBuzz', () => {
    const expected = [
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  it('fizzBuzzSingle(3) returns "Fizz"', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
  });

  it('fizzBuzzSingle(5) returns "Buzz"', () => {
    expect(fizzBuzzSingle(5)).toBe('Buzz');
  });

  it('fizzBuzzSingle(15) returns "FizzBuzz"', () => {
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  });

  it('fizzBuzzSingle(7) returns "7"', () => {
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('fizzBuzz(0) returns []', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('non-integer inputs throw TypeError', () => {
    expect(() => fizzBuzz(1.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(2.5)).toThrow(TypeError);
    expect(() => fizzBuzz('10')).toThrow(TypeError);
  });

  it('negative inputs throw RangeError', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-3)).toThrow(RangeError);
  });

  it('fizzBuzzSingle(0) throws RangeError (0 is not positive)', () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
  });
});
