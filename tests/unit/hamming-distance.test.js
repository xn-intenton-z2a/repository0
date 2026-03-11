// tests/unit/hamming-distance.test.js
import { describe, test, expect } from 'vitest';
import { hammingDistance } from '../../src/lib/main.js';

describe('hammingDistance', () => {
  test('karolin vs kathrin => 3', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  test('empty strings => 0', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  test('unequal lengths throws RangeError', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  test('non-string arguments throw TypeError', () => {
    // @ts-ignore - intentional
    expect(() => hammingDistance(123, 'a')).toThrow(TypeError);
  });

  test('Unicode code points are compared (emoji/surrogates)', () => {
    const a = 'a\u{1F600}'; // a + 😀
    const b = 'a\u{1F601}'; // a + 😁
    expect(hammingDistance(a, b)).toBe(1);
  });

  test('surrogate pair handling for musical symbol', () => {
    const s1 = '\u{1D11E}a'; // musical symbol G clef + a
    const s2 = '\u{1D11E}b';
    expect(hammingDistance(s1, s2)).toBe(1);
  });
});