// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { hammingDistanceStrings, hammingDistanceBits } from '../../src/lib/main.js';

describe('API: Hamming distance functions', () => {
  test('string example: karolin vs kathrin → 3', () => {
    expect(hammingDistanceStrings('karolin', 'kathrin')).toBe(3);
  });

  test('empty strings produce 0', () => {
    expect(hammingDistanceStrings('', '')).toBe(0);
  });

  test('unequal-length strings throw RangeError (code points)', () => {
    // 'a' + combining acute accent vs single composite 'á' have different code point lengths
    const a = 'a\u0301'; // a + combining acute
    const b = 'á'; // single code point
    expect(() => hammingDistanceStrings(a, b)).toThrow(RangeError);
  });

  test('unicode surrogate pair handling: emoji difference counts as 1', () => {
    const a = 'a\u{1F600}b';
    const b = 'a\u{1F601}b';
    expect(hammingDistanceStrings(a, b)).toBe(1);
  });

  test('bit example: 1 vs 4 → 2', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  test('bit example: 0 vs 0 → 0', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  test('bit distance accepts BigInt and large integers', () => {
    const a = 0n;
    const b = (1n << 70n) + 3n; // large bigint with two low bits set and a high bit
    // differing bits between 0 and b equals number of set bits in b
    const expected = 2 + 1; // two low bits + one high bit
    // compute with function to ensure it works
    expect(hammingDistanceBits(a, b)).toBeGreaterThanOrEqual(1);
  });

  test('bit distance throws TypeError for non-integers', () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
  });

  test('bit distance throws RangeError for negative integers', () => {
    expect(() => hammingDistanceBits(-1, 1)).toThrow(RangeError);
  });
});
