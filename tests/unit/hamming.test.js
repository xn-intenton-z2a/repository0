import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance', () => {
  it('computes example "karolin" vs "kathrin" -> 3', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('empty strings return 0', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws RangeError on unequal lengths', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('works with Arrays', () => {
    expect(hammingDistance([1,2,3], [1,2,4])).toBe(1);
  });

  it('works with Buffer and Uint8Array equivalence', () => {
    const b = Buffer.from([1,2,3,4]);
    const u = new Uint8Array([1,2,0,4]);
    expect(hammingDistance(b, u)).toBe(1);
    expect(hammingDistance(u, b)).toBe(1);
  });

  it('compares unicode code points (emoji)', () => {
    // '𝟘' is a surrogate-pair character; Array.from will treat it as one code point
    const a = 'a𝟘b';
    const b = 'a𝟙b';
    expect(hammingDistance(a, b)).toBe(1);
  });

  it('throws TypeError for unsupported types', () => {
    expect(() => hammingDistance(123, 456)).toThrow(TypeError);
  });
});

describe('hammingDistanceBits', () => {
  it('numeric example 0b1011 vs 0b1001 -> 1', () => {
    expect(hammingDistanceBits(0b1011, 0b1001)).toBe(1);
  });

  it('numeric example 1 vs 4 -> 2', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  it('zero vs zero -> 0', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('throws on negative numeric inputs', () => {
    expect(() => hammingDistanceBits(-1, 1)).toThrow(RangeError);
  });

  it('throws on non-integer numeric inputs', () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
  });

  it('byte-array inputs compute bit diffs', () => {
    const a = Buffer.from([0b00001111, 0b10101010]);
    const b = new Uint8Array([0b00001111, 0b10001010]);
    // Only one bit differs in second byte
    expect(hammingDistanceBits(a, b)).toBe(1);
  });

  it('throws RangeError on unequal-length byte arrays', () => {
    expect(() => hammingDistanceBits(Buffer.from([1,2]), new Uint8Array([1]))).toThrow(RangeError);
  });

  it('works with BigInt numbers', () => {
    const a = 0b1010101010101010101010101010n;
    const b = 0b1010101010101010101010101000n;
    expect(hammingDistanceBits(a, b)).toBe(1);
  });

  it('throws TypeError for unsupported types', () => {
    expect(() => hammingDistanceBits('abc', 'def')).toThrow(TypeError);
  });
});
