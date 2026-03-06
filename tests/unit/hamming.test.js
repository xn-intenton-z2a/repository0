import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/hamming.js';

describe('hammingDistance (Unicode-safe)', () => {
  it('returns 0 for identical ascii strings', () => {
    expect(hammingDistance('abc', 'abc')).toBe(0);
  });

  it('handles canonical equivalence with NFC', () => {
    // e + combining acute vs precomposed é
    expect(hammingDistance('e\u0301', 'é')).toBe(0);
  });

  it('handles surrogate pairs / emoji correctly', () => {
    expect(hammingDistance('👍a', '👎a')).toBe(1);
  });

  it('returns 0 for empty strings', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws TypeError for non-string inputs', () => {
    // @ts-ignore
    expect(() => hammingDistance(1, 'a')).toThrow(TypeError);
  });

  it('throws RangeError for differing code point lengths', () => {
    expect(() => hammingDistance('a', 'ab')).toThrow(RangeError);
  });
});

describe('hammingDistanceBits (byte-wise bit count)', () => {
  it('counts differing bits between single bytes', () => {
    expect(hammingDistanceBits(Uint8Array.from([0b1010]), Uint8Array.from([0b0011]))).toBe(2);
  });

  it('works with Node Buffers (ASCII bytes)', () => {
    // 'a' = 0x61, 'b' = 0x62 -> XOR = 0x03 -> popcount 2
    expect(hammingDistanceBits(Buffer.from('a'), Buffer.from('b'))).toBe(2);
  });

  it('counts bits across multi-byte arrays', () => {
    expect(hammingDistanceBits(Uint8Array.from([0x00, 0xff]), Uint8Array.from([0xff, 0x00]))).toBe(16);
  });

  it('throws TypeError for unsupported input types', () => {
    // @ts-ignore
    expect(() => hammingDistanceBits('a', 'b')).toThrow(TypeError);
  });

  it('throws RangeError for unequal byte lengths', () => {
    expect(() => hammingDistanceBits(Uint8Array.from([0x00]), Uint8Array.from([0x00, 0x00]))).toThrow(RangeError);
  });
});
