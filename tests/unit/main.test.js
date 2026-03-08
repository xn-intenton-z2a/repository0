import { describe, it, expect } from 'vitest';
import { toRoman, fromRoman, parseRoman } from '../../src/lib/main.js';

describe('toRoman', () => {
  it('converts canonical examples', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(90)).toBe('XC');
    expect(toRoman(400)).toBe('CD');
    expect(toRoman(900)).toBe('CM');
    expect(toRoman(1994)).toBe('MCMXCIV');
    expect(toRoman(3999)).toBe('MMMCMXCIX');
  });

  it('throws for out of range and invalid types', () => {
    expect(() => toRoman(0)).toThrow(RangeError);
    expect(() => toRoman(4000)).toThrow(RangeError);
    expect(() => toRoman(-1)).toThrow(RangeError);
    expect(() => toRoman(3.14)).toThrow(TypeError);
    expect(() => toRoman(null)).toThrow(TypeError);
  });
});

describe('fromRoman', () => {
  it('parses canonical and is case-insensitive', () => {
    expect(fromRoman('MCMXCIV')).toBe(1994);
    expect(fromRoman('mcmxciv')).toBe(1994);
    expect(fromRoman('IV')).toBe(4);
    expect(fromRoman('MMMCMXCIX')).toBe(3999);
  });

  it('strict rejects non-canonical forms', () => {
    expect(() => fromRoman('IIII')).toThrow(SyntaxError);
  });

  it('permissive accepts non-canonical forms', () => {
    expect(fromRoman('IIII', { strict: false })).toBe(4);
    expect(fromRoman('iiii', { strict: false })).toBe(4);
  });

  it('throws for bad types', () => {
    expect(() => fromRoman(123)).toThrow(TypeError);
    expect(() => fromRoman(null)).toThrow(TypeError);
    expect(() => fromRoman('')).toThrow(SyntaxError);
  });
});

describe('parseRoman', () => {
  it('returns structured object in strict mode', () => {
    const r = parseRoman('MCMXCIV');
    expect(r.value).toBe(1994);
    expect(r.normalized).toBe('MCMXCIV');
    expect(Array.isArray(r.warnings)).toBe(true);
  });
  it('permissive normalizes non-canonical inputs', () => {
    const r = parseRoman('iiii', { strict: false });
    expect(r.value).toBe(4);
    expect(r.normalized).toBe('IV');
  });
  it('throws for non-string', () => {
    expect(() => parseRoman(null)).toThrow(TypeError);
  });
});
