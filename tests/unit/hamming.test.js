import { describe, it, expect } from 'vitest';
import { hammingDistanceBits, hammingDistance } from '../../src/lib/hamming.js';

describe('hammingDistance (strings)', () => {
  it('basic unicode-aware comparison', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
    expect(hammingDistance('', '')).toBe(0);
    // combining vs precomposed
    expect(hammingDistance('e\u0301', 'é')).toBe(0);
  });

  it('throws for unequal length strings', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
    expect(() => hammingDistance(1, 'a')).toThrow(TypeError);
  });
});

describe('hammingDistanceBits (integers and BigInt)', () => {
  it('BigInt inputs compute correctly', () => {
    expect(hammingDistanceBits(1n, 4n)).toBe(2);
    expect(hammingDistanceBits(0n, 0n)).toBe(0);
  });

  it('Mixed Number/BigInt with safe Number coerced to BigInt', () => {
    expect(hammingDistanceBits(1, 4n)).toBe(2);
    expect(hammingDistanceBits(4n, 1)).toBe(2);
  });

  it('Number path for two safe Numbers', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
    expect(hammingDistanceBits(0, 0)).toBe(0);
    // larger safe integers that require high 32-bit part — validate against BigInt-based result
    const a = 0x100000000 + 5; // 4294967301
    const b = 0x200000004 + 4; // 8589934596 + 4 = 8589934600 (keeps values safe)
    // compute expected via BigInt algorithm to avoid hand-calculation mistakes
    const v = BigInt(a) ^ BigInt(b);
    let cnt = 0n;
    let vv = v;
    while (vv !== 0n) { vv &= vv - 1n; cnt++; }
    const expected = Number(cnt);
    expect(hammingDistanceBits(a, b)).toBe(expected);
  });

  it('throws for Numbers beyond Number.MAX_SAFE_INTEGER unless BigInt is used', () => {
    const unsafe = Number.MAX_SAFE_INTEGER + 1;
    expect(() => hammingDistanceBits(unsafe, 0)).toThrow(RangeError);
    expect(() => hammingDistanceBits(unsafe, 0n)).toThrow(RangeError);
  });

  it('throws for negative inputs (Number and BigInt)', () => {
    expect(() => hammingDistanceBits(-1, 0)).toThrow(RangeError);
    expect(() => hammingDistanceBits(-1n, 0n)).toThrow(RangeError);
  });

  it('throws TypeError for non-numeric inputs', () => {
    expect(() => hammingDistanceBits('a', 1)).toThrow(TypeError);
    expect(() => hammingDistanceBits({}, null)).toThrow(TypeError);
  });

  it('result is a finite Number', () => {
    const r = hammingDistanceBits(123456789, 987654321);
    expect(typeof r).toBe('number');
    expect(Number.isFinite(r)).toBe(true);
  });
});
