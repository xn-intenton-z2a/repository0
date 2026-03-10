import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance', () => {
  it('computes example correctly', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('handles empty strings', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws RangeError for unequal code point lengths', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('compares by Unicode code points (Array.from)', () => {
    // 'é' vs decomposed 'e\u0301' have different code point lengths
    expect(() => hammingDistance('é', 'e\u0301')).toThrow(RangeError);
  });

  it('throws TypeError for non-strings', () => {
    // @ts-ignore
    expect(() => hammingDistance(1, 'a')).toThrow(TypeError);
  });
});

describe('hammingDistanceBits', () => {
  it('computes differing bits correctly', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  it('zero case', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('accepts BigInt and large values', () => {
    expect(hammingDistanceBits(1n, 4n)).toBe(2);
    const largeA = (1n << 100n) + 3n; // bits at 100 and at low bits
    const largeB = (1n << 100n) + 5n; // bits differ in low bits
    expect(hammingDistanceBits(largeA, largeB)).toBe(2);
  });

  it('throws for negative integers', () => {
    // @ts-ignore
    expect(() => hammingDistanceBits(-1, 2)).toThrow(RangeError);
    // @ts-ignore
    expect(() => hammingDistanceBits(-1n, 2n)).toThrow(RangeError);
  });

  it('throws TypeError for non-integer numbers', () => {
    // @ts-ignore
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
  });

  it('throws TypeError for wrong types', () => {
    // @ts-ignore
    expect(() => hammingDistanceBits('a', 1)).toThrow(TypeError);
  });
});
