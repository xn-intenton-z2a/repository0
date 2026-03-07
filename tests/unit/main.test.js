import { describe, it, expect } from 'vitest';
import { fizzBuzzSingle, fizzBuzz } from '../../src/lib/main.js';

describe('fizzBuzzSingle', () => {
  it('returns Fizz for multiples of 3', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(6)).toBe('Fizz');
  });

  it('returns Buzz for multiples of 5', () => {
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(20)).toBe('Buzz');
  });

  it('returns FizzBuzz for multiples of 15', () => {
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(30)).toBe('FizzBuzz');
  });

  it('returns number string for non-divisible values', () => {
    expect(fizzBuzzSingle(1)).toBe('1');
    expect(fizzBuzzSingle(7)).toBe('7');
    expect(fizzBuzzSingle(1000)).toBe('1000');
  });

  it('throws on invalid types', () => {
    expect(() => fizzBuzzSingle(NaN)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(null)).toThrow(TypeError);
    expect(() => fizzBuzzSingle(1.5)).toThrow(TypeError);
    expect(() => fizzBuzzSingle('3')).toThrow(TypeError);
  });

  it('throws RangeError for values less than 1', () => {
    expect(() => fizzBuzzSingle(0)).toThrow(RangeError);
    expect(() => fizzBuzzSingle(-1)).toThrow(RangeError);
  });
});

describe('fizzBuzz (sequence)', () => {
  it('returns empty array for count = 0', () => {
    expect(fizzBuzz(0)).toEqual([]);
  });

  it('generates correct sequence for count = 1', () => {
    expect(fizzBuzz(1)).toEqual(['1']);
  });

  it('generates correct 15-element sequence', () => {
    const expected = [
      '1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'
    ];
    expect(fizzBuzz(15)).toEqual(expected);
  });

  it('throws on invalid counts', () => {
    expect(() => fizzBuzz(NaN)).toThrow(TypeError);
    expect(() => fizzBuzz(null)).toThrow(TypeError);
    expect(() => fizzBuzz(1.5)).toThrow(TypeError);
    expect(() => fizzBuzz(-1)).toThrow(RangeError);
  });
});
