import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance', () => {
  it('computes known example', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('handles empty strings', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws RangeError for unequal-length strings', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('handles Unicode surrogate pairs (code point aware)', () => {
    // middle character differs (desert small caps letter vs another) but both are single code points
    expect(hammingDistance('a𐐷b', 'a𐐶b')).toBe(1);
  });

  it('treats precomposed vs decomposed characters as different lengths and throws', () => {
    // 'é' (U+00E9) vs 'e' + combining acute (U+0301) are different code point lengths
    expect(() => hammingDistance('é', 'e\u0301')).toThrow(RangeError);
  });
});

describe('hammingDistanceBits', () => {
  it('computes bit distance for small numbers', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2); // 001 vs 100
  });

  it('zero vs zero is zero', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('accepts BigInt and large shifts', () => {
    expect(hammingDistanceBits(0n, 1n << 65n)).toBe(1);
  });

  it('throws TypeError for non-integer inputs', () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
    expect(() => hammingDistanceBits('a', 1)).toThrow(TypeError);
  });

  it('throws RangeError for negative integers', () => {
    expect(() => hammingDistanceBits(-1, 0)).toThrow(RangeError);
    expect(() => hammingDistanceBits(0, -2n)).toThrow(RangeError);
  });

  it('counts bits for larger numbers', () => {
    expect(hammingDistanceBits(255, 0)).toBe(8);
  });
});
