import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance', () => {
  it('computes basic distances', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('handles empty strings', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws on unequal lengths', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('handles Unicode code points (surrogate pairs) correctly', () => {
    // smileys are single code points
    expect(hammingDistance('a😊b', 'a😃b')).toBe(1);
    expect(hammingDistance('👍', '👎')).toBe(1);
  });

  it('throws TypeError for non-string inputs', () => {
    expect(() => hammingDistance(1, 'a')).toThrow(TypeError);
    expect(() => hammingDistance('a', null)).toThrow(TypeError);
  });
});

describe('hammingDistanceBits', () => {
  it('computes bit distances for numbers', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2); // 001 vs 100
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('computes bit distances for BigInt and mixed types', () => {
    expect(hammingDistanceBits(1n, 4n)).toBe(2);
    expect(hammingDistanceBits(10, 10n)).toBe(0);
  });

  it('handles large BigInt values', () => {
    const a = 0xffffffffffn; // many bits set
    const b = 0xfffffff00n;
    const expected = (() => {
      let v = a ^ b;
      let c = 0;
      while (v !== 0n) { c++; v &= v - 1n; }
      return c;
    })();
    expect(hammingDistanceBits(a, b)).toBe(expected);
  });

  it('validates inputs', () => {
    expect(() => hammingDistanceBits(-1, 1)).toThrow(RangeError);
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
    expect(() => hammingDistanceBits('1', 2)).toThrow(TypeError);
  });
});
