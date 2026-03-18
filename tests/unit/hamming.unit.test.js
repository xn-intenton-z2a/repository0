// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { hammingDistanceString, hammingDistanceInt } from '../../src/lib/main.js';

// Dedicated unit tests for the Hamming library to satisfy repository metrics and acceptance criteria

describe('Hamming library - strings (unit tests)', () => {
  test('karolin vs kathrin => 3', () => {
    expect(hammingDistanceString('karolin', 'kathrin')).toBe(3);
  });

  test('empty strings => 0', () => {
    expect(hammingDistanceString('', '')).toBe(0);
  });

  test('unequal-length strings throw RangeError (code points)', () => {
    expect(() => hammingDistanceString('a', 'ab')).toThrow(RangeError);
  });

  test('non-string args throw TypeError', () => {
    // @ts-ignore
    expect(() => hammingDistanceString(1, 2)).toThrow(TypeError);
  });

  test('unicode code points compared correctly (emoji)', () => {
    expect(hammingDistanceString('😊', '😢')).toBe(1);
  });

  test('astral symbol equality', () => {
    expect(hammingDistanceString('𝄞', '𝄞')).toBe(0);
  });

  test('precomposed vs combining sequences are treated as different (RangeError expected due to different lengths)', () => {
    // 'a\u0301' (a + combining acute) vs '\u00E1' (precomposed á)
    expect(() => hammingDistanceString('a\u0301', '\u00E1')).toThrow(RangeError);
  });
});

describe('Hamming library - integers (unit tests)', () => {
  test('1 vs 4 => 2', () => {
    expect(hammingDistanceInt(1, 4)).toBe(2);
  });

  test('0 vs 0 => 0', () => {
    expect(hammingDistanceInt(0, 0)).toBe(0);
  });

  test('Number integers required (non-integer throws TypeError)', () => {
    expect(() => hammingDistanceInt(1.5, 2)).toThrow(TypeError);
  });

  test('negative integers throw RangeError', () => {
    expect(() => hammingDistanceInt(-1, 0)).toThrow(RangeError);
  });

  test('BigInt 0n vs 3n => 2', () => {
    expect(hammingDistanceInt(0n, 3n)).toBe(2);
  });

  test('mixing Number and BigInt works (3 vs 3n => 0)', () => {
    expect(hammingDistanceInt(3, 3n)).toBe(0);
  });

  test('large BigInt difference (2^53 vs 2^53+1) => 1', () => {
    expect(hammingDistanceInt(9007199254740992n, 9007199254740993n)).toBe(1);
  });

  test('BigInt negative throws RangeError', () => {
    expect(() => hammingDistanceInt(-1n, 1n)).toThrow(RangeError);
  });

  test('invalid types throw TypeError', () => {
    // @ts-ignore
    expect(() => hammingDistanceInt('a', {})).toThrow(TypeError);
  });
});
