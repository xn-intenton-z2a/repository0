import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('FizzBuzz', () => {
  it('fizzBuzzSingle returns "Fizz" for 3', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
  });

  it('fizzBuzzSingle returns "Buzz" for 5', () => {
    expect(fizzBuzzSingle(5)).toBe('Buzz');
  });

  it('fizzBuzzSingle returns "FizzBuzz" for 15', () => {
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
  });

  it('fizzBuzzSingle returns number string for non-multiple', () => {
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('fizzBuzz(15) returns expected sequence', () => {
    const expected = [
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  it('fizzBuzz(0) returns []', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('fizzBuzz throws RangeError for negative n', () => {
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });

  it('fizzBuzz throws TypeError for non-integer', () => {
    expect(() => fizzBuzz(2.5)).toThrow(TypeError);
  });

  it('fizzBuzzSingle throws for non-integer or <1', () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(1.5)).toThrow(TypeError);
  });
});
