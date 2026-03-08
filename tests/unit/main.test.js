import { describe, it, expect } from 'vitest';
import { toRoman, fromRoman } from '../../src/lib/main.js';

describe('Roman numeral conversions', () => {
  it('canonical examples toRoman', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(3999)).toBe('MMMCMXCIX');
    expect(toRoman(1994)).toBe('MCMXCIV');
  });

  it('canonical examples fromRoman', () => {
    expect(fromRoman('I')).toBe(1);
    expect(fromRoman('IV')).toBe(4);
    expect(fromRoman('MMMCMXCIX')).toBe(3999);
    expect(fromRoman('MCMXCIV')).toBe(1994);
  });

  it('errors for toRoman invalid types and ranges', () => {
    expect(() => toRoman(0)).toThrow(RangeError);
    expect(() => toRoman(4000)).toThrow(RangeError);
    expect(() => toRoman(-5)).toThrow(RangeError);
    expect(() => toRoman(3.14)).toThrow(TypeError);
    expect(() => toRoman('10')).toThrow(TypeError);
  });

  it('errors for fromRoman invalid inputs', () => {
    expect(() => fromRoman('')).toThrow(SyntaxError);
    expect(() => fromRoman('IIII')).toThrow(SyntaxError);
    expect(() => fromRoman('iv')).toThrow(SyntaxError);
    expect(() => fromRoman(123)).toThrow(TypeError);
  });

  it('round-trip identity for sample set', () => {
    const vals = [1,2,3,4,5,9,40,90,400,900,1987,3999];
    for (const n of vals) {
      const r = toRoman(n);
      expect(fromRoman(r)).toBe(n);
      expect(toRoman(fromRoman(r))).toBe(r);
    }
  });
});
