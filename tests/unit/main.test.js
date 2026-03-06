import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance', () => {
  it('basic example: karolin vs kathrin', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('canonical equivalence: e\u0301 vs é', () => {
    expect(hammingDistance('e\u0301', 'é')).toBe(0);
  });

  it('emoji difference', () => {
    expect(hammingDistance('👍', '👎')).toBe(1);
  });

  it('empty strings', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws on non-string inputs', () => {
    // @ts-ignore
    expect(() => hammingDistance(null, 'a')).toThrow(TypeError);
    // @ts-ignore
    expect(() => hammingDistance('a', 1)).toThrow(TypeError);
  });

  it('throws on unequal lengths after normalization', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });
});

describe('hammingDistanceBits', () => {
  it('buffer bit example', () => {
    const a = Buffer.from([0b1011101]);
    const b = Buffer.from([0b1001001]);
    expect(hammingDistanceBits(a, b)).toBe(2);
  });

  it('string single-byte chars', () => {
    expect(hammingDistanceBits('a', 'b')).toBe(2); // 0x61 vs 0x62 differ by two bits
  });

  it('empty strings', () => {
    expect(hammingDistanceBits('', '')).toBe(0);
  });

  it('accepts Uint8Array', () => {
    const u1 = new Uint8Array([0x00, 0xff]);
    const u2 = new Uint8Array([0xff, 0x00]);
    // u1 xor u2 = [0xff,0xff] => 8+8 bits = 16
    expect(hammingDistanceBits(u1, u2)).toBe(16);
  });

  it('multi-byte UTF-8 equivalence: é vs e\u0301', () => {
    // both normalize to NFC and then to same bytes
    expect(hammingDistanceBits('e\u0301', 'é')).toBe(0);
  });

  it('throws on invalid types', () => {
    // @ts-ignore
    expect(() => hammingDistanceBits({}, Buffer.from([]))).toThrow(TypeError);
  });

  it('throws on unequal byte lengths for strings', () => {
    // 'é' in UTF-8 is two bytes, 'e' is one byte -> unequal
    expect(() => hammingDistanceBits('é', 'e')).toThrow(RangeError);
  });
});
