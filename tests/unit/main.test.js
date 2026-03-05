import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../../src/lib/main.js';

describe('hammingDistance (strings, Unicode code points)', () => {
  it('computes karolin vs kathrin => 3', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('empty strings => 0', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws RangeError for unequal lengths', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('handles Unicode code points correctly (emoji)', () => {
    expect(hammingDistance('😊', '😁')).toBe(1);
  });

  it('compares code points not UTF-16 units (combining marks treated separately)', () => {
    // 'a\u0301' (a + combining acute) vs 'á' (single code point) -> different lengths
    expect(() => hammingDistance('a\u0301', 'á')).toThrow(RangeError);
  });
});

describe('hammingDistanceBits (integers and BigInt)', () => {
  it('1 vs 4 => 2', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  it('0 vs 0 => 0', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('supports BigInt inputs', () => {
    expect(hammingDistanceBits(1n, 4n)).toBe(2);
  });

  it('throws TypeError for non-integer inputs', () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
    expect(() => hammingDistanceBits('1', 2)).toThrow(TypeError);
  });

  it('throws RangeError for negative integers', () => {
    expect(() => hammingDistanceBits(-1, 2)).toThrow(RangeError);
    expect(() => hammingDistanceBits(-1n, 2n)).toThrow(RangeError);
  });

  it('large values: differing high bits', () => {
    const a = (1n << 60n) + 1n; // bit 60 and bit 0
    const b = (1n << 60n) + 4n; // bit 60 and bit 2
    expect(hammingDistanceBits(a, b)).toBe(2);
  });
});
