import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance (Unicode-aware)', () => {
  it('computes known example karolin vs kathrin', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('empty strings return 0', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws RangeError for unequal-length strings', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('throws TypeError for non-string inputs', () => {
    // @ts-ignore - deliberate bad input
    expect(() => hammingDistance(1, 2)).toThrow(TypeError);
  });

  it('handles Unicode code points (emoji, astral plane) correctly', () => {
    const a = 'a\u{1F600}c'; // a + 😀 + c
    const b = 'a\u{1F601}c'; // a + 😁 + c
    expect(Array.from(a).length).toBe(Array.from(b).length);
    expect(hammingDistance(a, b)).toBe(1);
  });
});

describe('hammingDistanceBits (integers and BigInt)', () => {
  it('1 vs 4 returns 2', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  it('0 vs 0 returns 0', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('works with BigInt and large bit positions', () => {
    const a = 0n;
    const b = 1n << 70n; // single high bit
    expect(hammingDistanceBits(a, b)).toBe(1);
  });

  it('throws RangeError for negative integers', () => {
    expect(() => hammingDistanceBits(-1, 0)).toThrow(RangeError);
    expect(() => hammingDistanceBits(0n, -2n)).toThrow(RangeError);
  });

  it('throws TypeError for non-integer numeric values', () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
    // @ts-ignore - deliberate bad input
    expect(() => hammingDistanceBits('3', 4)).toThrow(TypeError);
  });
});
