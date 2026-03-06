import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance', () => {
  it('works for equal-length strings (karolin/kathrin)', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('works for binary strings', () => {
    expect(hammingDistance('1011101', '1001001')).toBe(2);
  });

  it('works for Buffer/Uint8Array/arrays', () => {
    expect(hammingDistance(Buffer.from([1,2,3]), Buffer.from([1,0,3]))).toBe(1);
    expect(hammingDistance(new Uint8Array([1,2,3]), new Uint8Array([1,0,3]))).toBe(1);
    expect(hammingDistance([1,2,3], [1,0,3])).toBe(1);
  });

  it('throws for unequal lengths', () => {
    expect(() => hammingDistance('abc', 'ab')).toThrow(RangeError);
    expect(() => hammingDistance(Buffer.from([1,2]), Buffer.from([1]))).toThrow(RangeError);
  });

  it('handles empty inputs', () => {
    expect(hammingDistance('', '')).toBe(0);
    expect(hammingDistance([], [])).toBe(0);
  });

  it('compares by Unicode code points', () => {
    // Use emoji that are single code points but outside BMP
    const a = 'a\u{1F600}b';
    const b = 'a\u{1F603}b';
    expect(hammingDistance(a, b)).toBe(1);
  });

  it('throws TypeError for unsupported inputs', () => {
    expect(() => hammingDistance(1, 2)).toThrow(TypeError);
  });
});

describe('hammingDistanceBits', () => {
  it('works for Numbers (example)', () => {
    const a = 0b1011101; // 93
    const b = 0b1001001; // 73
    expect(hammingDistanceBits(a, b)).toBe(2);
  });

  it('counts differing bits (0 vs 15)', () => {
    expect(hammingDistanceBits(0, 15)).toBe(4);
  });

  it('works for BigInt', () => {
    expect(hammingDistanceBits(0n, 16n)).toBe(1);
  });

  it('mixing Number and BigInt yields consistent results', () => {
    expect(hammingDistanceBits(5, 5n)).toBe(0);
    expect(hammingDistanceBits(5.7, 2)).toBe(hammingDistanceBits(5 >>> 0, 2 >>> 0));
  });

  it('throws for negative BigInt', () => {
    expect(() => hammingDistanceBits(-1n, 1n)).toThrow(RangeError);
  });

  it('handles maximal 32-bit differences', () => {
    expect(hammingDistanceBits(0, 0xFFFFFFFF)).toBe(32);
  });

  it('throws TypeError for unsupported types', () => {
    expect(() => hammingDistanceBits('a', 'b')).toThrow(TypeError);
  });
});
