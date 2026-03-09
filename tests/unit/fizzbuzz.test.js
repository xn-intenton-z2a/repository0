import { describe, it, expect } from 'vitest';
import { fizzBuzz, fizzBuzzSingle } from '../../src/lib/main.js';

describe('fizzBuzz', () => {
  it('returns [1] for n=1', () => {
    expect(fizzBuzz(1)).toEqual(['1']);
  });

  it('returns correct array for n=5', () => {
    expect(fizzBuzz(5)).toEqual(['1','2','Fizz','4','Buzz']);
  });

  it('returns 15 items and element 15 is FizzBuzz', () => {
    const out = fizzBuzz(15);
    expect(out.length).toBe(15);
    expect(out[14]).toBe('FizzBuzz');
  });

  it('returns empty array for n=0 and negative', () => {
    expect(fizzBuzz(0)).toEqual([]);
    expect(fizzBuzz(-3)).toEqual(['Fizz','-2','-1']);
  });

  it('throws TypeError for invalid inputs', () => {
    const bad = [NaN, Infinity, '3', {}, null];
    bad.forEach(v => {
      expect(() => fizzBuzz(v)).toThrow(TypeError);
      expect(() => fizzBuzz(v)).toThrow('n must be a finite integer');
    });
  });
});

describe('fizzBuzzSingle', () => {
  it('returns Fizz/Buzz/FizzBuzz or number strings', () => {
    expect(fizzBuzzSingle(3)).toBe('Fizz');
    expect(fizzBuzzSingle(5)).toBe('Buzz');
    expect(fizzBuzzSingle(15)).toBe('FizzBuzz');
    expect(fizzBuzzSingle(7)).toBe('7');
  });

  it('throws for invalid inputs', () => {
    expect(() => fizzBuzzSingle(NaN)).toThrow(TypeError);
    expect(() => fizzBuzzSingle('2')).toThrow('n must be a finite integer');
  });
});
