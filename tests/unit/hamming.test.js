// SPDX-License-Identifier: MIT
// Hamming distance tests
import { describe, test, expect } from 'vitest';
import { stringHamming, bitHamming } from '../../src/lib/main.js';

describe('stringHamming', () => {
  test('karolin vs kathrin is 3', () => {
    expect(stringHamming('karolin', 'kathrin')).toBe(3);
  });

  test('empty strings', () => {
    expect(stringHamming('', '')).toBe(0);
  });

  test('unicode code points (emoji)', () => {
    // different emoji sequences but same code point length
    expect(stringHamming('🙂🙂', '🙂🙃')).toBe(1);
  });

  test('throws on non-string', () => {
    expect(() => stringHamming(null, 'a')).toThrow(TypeError);
    expect(() => stringHamming('a', 123)).toThrow(TypeError);
  });

  test('throws on unequal length', () => {
    expect(() => stringHamming('a', 'ab')).toThrow(RangeError);
  });
});

describe('bitHamming', () => {
  test('1 vs 4 is 2', () => {
    expect(bitHamming(1, 4)).toBe(2);
  });

  test('0 vs 0 is 0', () => {
    expect(bitHamming(0, 0)).toBe(0);
  });

  test('large integers', () => {
    expect(bitHamming(0xFFFFFFFF, 0)).toBe(32);
  });

  test('throws on non-integer', () => {
    expect(() => bitHamming(1.5, 2)).toThrow(TypeError);
    expect(() => bitHamming('1', 2)).toThrow(TypeError);
  });

  test('throws on negative', () => {
    expect(() => bitHamming(-1, 0)).toThrow(RangeError);
    expect(() => bitHamming(0, -2)).toThrow(RangeError);
  });
});
