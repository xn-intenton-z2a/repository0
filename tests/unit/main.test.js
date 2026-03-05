import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance', () => {
  it('computes hamming distance for ASCII strings', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('returns 0 for empty strings', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws RangeError for unequal lengths', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('handles Unicode code points (surrogate pairs) correctly', () => {
    // '𝔘' is a surrogate-pair character (mathematical Fraktur U)
    expect(hammingDistance('a𝔘c', 'a𝔘d')).toBe(1);
  });

  it('compares by Unicode code points (not grapheme clusters)', () => {
    // precomposed vs decomposed forms have different code point lengths
    expect(() => hammingDistance('e\u0301', 'é')).toThrow(RangeError);
  });

  it('throws TypeError for non-string inputs', () => {
    // number vs string
    expect(() => hammingDistance(1, 'a')).toThrow(TypeError);
    expect(() => hammingDistance('a', null)).toThrow(TypeError);
  });
});

describe('hammingDistanceBits', () => {
  it('computes bit hamming distance for small integers', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2); // 001 vs 100
  });

  it('returns 0 for zeros', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('supports BigInt and large integers', () => {
    const big = (1n << 70n) - 1n; // 70 one-bits
    expect(hammingDistanceBits(big, 0n)).toBe(70);
    expect(hammingDistanceBits(1n, 4n)).toBe(2);
  });

  it('throws TypeError for non-integer arguments', () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
    expect(() => hammingDistanceBits('1', 2)).toThrow(TypeError);
  });

  it('throws RangeError for negative integers', () => {
    expect(() => hammingDistanceBits(-1, 2)).toThrow(RangeError);
    expect(() => hammingDistanceBits(1n, -2n)).toThrow(RangeError);
  });
});
