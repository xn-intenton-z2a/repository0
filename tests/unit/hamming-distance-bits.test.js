// tests/unit/hamming-distance-bits.test.js
import { describe, test, expect } from 'vitest';
import { hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistanceBits', () => {
  test('1 vs 4 => 2', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  test('0 vs 0 => 0', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  test('identical values => 0', () => {
    expect(hammingDistanceBits(5, 5)).toBe(0);
  });

  test('throws TypeError for non-integer arguments', () => {
    // float
    expect(() => hammingDistanceBits(1.2, 0)).toThrow(TypeError);
    // string
    // @ts-ignore - intentional
    expect(() => hammingDistanceBits('a', 0)).toThrow(TypeError);
  });

  test('throws RangeError for negative integers', () => {
    expect(() => hammingDistanceBits(-1, 0)).toThrow(RangeError);
    expect(() => hammingDistanceBits(0, -2)).toThrow(RangeError);
  });

  test('BigInt support and mixing Number/BigInt', () => {
    expect(hammingDistanceBits(1n, 4n)).toBe(2);
    expect(hammingDistanceBits(1, 4n)).toBe(2);
  });

  test('handles large integers correctly', () => {
    const big = BigInt('0b' + '1'.repeat(100));
    // difference between big and big with one bit flipped
    const big2 = big ^ (1n << 5n);
    expect(hammingDistanceBits(big, big2)).toBe(1);
  });
});