import { describe, it, expect } from 'vitest';
import { toRoman, fromRoman } from '../../src/lib/main.js';

describe('Roman numeral conversions', () => {
  it('toRoman(1994) -> MCMXCIV', () => {
    expect(toRoman(1994)).toBe('MCMXCIV');
  });

  it('fromRoman("MCMXCIV") -> 1994', () => {
    expect(fromRoman('MCMXCIV')).toBe(1994);
  });

  it('toRoman(4) -> IV', () => {
    expect(toRoman(4)).toBe('IV');
  });

  it('toRoman throws RangeError for 0 and 4000', () => {
    expect(() => toRoman(0)).toThrow(RangeError);
    expect(() => toRoman(4000)).toThrow(RangeError);
  });

  it('fromRoman rejects non-canonical numerals like "IIII"', () => {
    expect(() => fromRoman('IIII')).toThrow(TypeError);
    expect(() => fromRoman('ABC')).toThrow(TypeError);
  });

  it('round-trip property holds for 1..3999', () => {
    for (let n = 1; n <= 3999; n++) {
      const r = toRoman(n);
      const back = fromRoman(r);
      expect(back).toBe(n);
    }
  }, 20000);
});
