import { describe, it, expect } from 'vitest';
import { generate } from '../..//src/lib/main.js';

describe('generate(n) fizz-buzz', () => {
  it('generate(1) -> [1]', () => {
    expect(generate(1)).toEqual([1]);
  });

  it('generate(3) -> [1, 2, "fizz"]', () => {
    expect(generate(3)).toEqual([1, 2, 'fizz']);
  });

  it('generate(5) -> [1,2,"fizz",4,"buzz"]', () => {
    expect(generate(5)).toEqual([1, 2, 'fizz', 4, 'buzz']);
  });

  it('generate(15)[14] -> "fizzbuzz"', () => {
    const g15 = generate(15);
    expect(g15[14]).toBe('fizzbuzz');
  });

  it('generate(100) length and spot checks', () => {
    const g = generate(100);
    expect(g.length).toBe(100);
    expect(g[2]).toBe('fizz'); // 3
    expect(g[4]).toBe('buzz'); // 5
    expect(g[14]).toBe('fizzbuzz'); // 15
    expect(g[97]).toBe(98); // 98
  });

  it('errors for invalid inputs', () => {
    expect(() => generate(0)).toThrow(TypeError);
    expect(() => generate(0)).toThrow('n must be a positive integer');
    expect(() => generate(-1)).toThrow('n must be a positive integer');
    expect(() => generate(3.5)).toThrow('n must be a positive integer');
    expect(() => generate(NaN)).toThrow('n must be a positive integer');
    expect(() => generate('5')).toThrow('n must be a positive integer');
  });
});
