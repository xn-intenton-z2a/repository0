import { describe, it, expect } from 'vitest';
import { toRoman, fromRoman } from '../../src/lib/main.js';

describe('Roman numeral converters', () => {
  it('toRoman(1994) -> MCMXCIV', () => {
    expect(toRoman(1994)).toBe('MCMXCIV');
  });

  it('fromRoman("MCMXCIV") -> 1994', () => {
    expect(fromRoman('MCMXCIV')).toBe(1994);
  });

  it('toRoman(4) -> IV', () => {
    expect(toRoman(4)).toBe('IV');
  });

  it('fromRoman accepts lowercase input', () => {
    expect(fromRoman('mcmxciv')).toBe(1994);
  });

  it('round-trip property for sample values and full range', () => {
    // quick spot checks
    const samples = [1, 3, 4, 9, 40, 44, 90, 99, 400, 944, 1666, 1994, 2021, 3999];
    for (const n of samples) {
      expect(fromRoman(toRoman(n))).toBe(n);
    }
    // full-range check (ensures round-trip for all valid values)
    for (let n = 1; n <= 3999; n++) {
      expect(fromRoman(toRoman(n))).toBe(n);
    }
  }, 20000);

  it('toRoman out-of-range throws RangeError', () => {
    expect(() => toRoman(0)).toThrow(RangeError);
    expect(() => toRoman(4000)).toThrow(RangeError);
  });

  it('toRoman non-integer throws TypeError', () => {
    expect(() => toRoman(3.14)).toThrow(TypeError);
  });

  it('fromRoman invalid strings throw TypeError', () => {
    expect(() => fromRoman('IIII')).toThrow(TypeError);
    expect(() => fromRoman('ABCD')).toThrow(TypeError);
    expect(() => fromRoman('')).toThrow(TypeError);
  });
});
