import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance (Unicode-aware)', () => {
  it('computes distance for simple ASCII strings', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('returns 0 for two empty strings', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws RangeError for unequal lengths', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('handles Unicode supplementary characters (code points)', () => {
    const a = '\u{1F600}'; // 😀
    const b = '\u{1F601}'; // 😁
    expect(hammingDistance(a, b)).toBe(1);
  });

  it('throws TypeError for non-string inputs', () => {
    expect(() => hammingDistance(1, 'a')).toThrow(TypeError);
  });
});

describe('hammingDistanceBits (integer bit Hamming distance)', () => {
  it('computes bit distance for small integers', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  it('returns 0 for equal zeros', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('handles BigInt and Number mix', () => {
    expect(hammingDistanceBits(1n, 4)).toBe(2);
  });

  it('handles large BigInt values', () => {
    expect(hammingDistanceBits(1024n, 0n)).toBe(1);
  });

  it('throws RangeError for negative integers', () => {
    expect(() => hammingDistanceBits(-1, 1)).toThrow(RangeError);
  });

  it('throws TypeError for non-integer numbers', () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
  });
});
