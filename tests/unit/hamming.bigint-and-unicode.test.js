// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { hammingDistanceInt, hammingDistanceString } from '../../src/lib/main.js';

describe('Hamming distance (BigInt and Unicode)', () => {
  test('0n vs 0n => 0', () => {
    expect(hammingDistanceInt(0n, 0n)).toBe(0);
  });

  test('0n vs 3n => 2', () => {
    expect(hammingDistanceInt(0n, 3n)).toBe(2);
  });

  test('2^53 vs 2^53+1 => 1', () => {
    expect(hammingDistanceInt(9007199254740992n, 9007199254740993n)).toBe(1);
  });

  test('mixing Number and BigInt: 3 vs 3n => 0', () => {
    expect(hammingDistanceInt(3, 3n)).toBe(0);
  });

  test('Number.MAX_SAFE_INTEGER vs -1 => 1 for safe decrement', () => {
    expect(hammingDistanceInt(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 1)).toBe(1);
  });

  test('negative BigInt throws RangeError', () => {
    expect(() => hammingDistanceInt(-1n, 1n)).toThrow(RangeError);
  });

  test('non-integer Number throws TypeError', () => {
    expect(() => hammingDistanceInt(1.5, 2)).toThrow(TypeError);
  });

  test('invalid types throw TypeError', () => {
    // @ts-ignore
    expect(() => hammingDistanceInt('a', {})).toThrow(TypeError);
  });

  // Unicode string tests
  test("'a' vs 'b' => 1", () => {
    expect(hammingDistanceString('a', 'b')).toBe(1);
  });

  test('emoji differ => 1', () => {
    expect(hammingDistanceString('😊', '😢')).toBe(1);
  });

  test('single astral symbol equal => 0', () => {
    expect(hammingDistanceString('𝄞', '𝄞')).toBe(0);
  });

  test('combining vs precomposed throws RangeError', () => {
    expect(() => hammingDistanceString('a\u0301', '\u00E1')).toThrow(RangeError);
  });

  test('unequal code-point lengths throw RangeError', () => {
    expect(() => hammingDistanceString('a', 'ab')).toThrow(RangeError);
  });

  test('non-string types throw TypeError', () => {
    // @ts-ignore
    expect(() => hammingDistanceString(1, 2)).toThrow(TypeError);
  });
});
