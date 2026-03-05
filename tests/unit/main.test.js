import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance (Unicode-aware)', () => {
  it('computes simple example', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('empty strings -> 0', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws for unequal lengths', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('handles Unicode code points (emojis and surrogate pairs)', () => {
    expect(hammingDistance('a😊b', 'a😢b')).toBe(1);
    // Musical symbol U+1D11E vs U+1D122 (different code points)
    expect(hammingDistance('A𝄞Z', 'A𝄢Z')).toBe(1);
  });

  it('throws TypeError for non-string inputs', () => {
    expect(() => hammingDistance(123, 'a')).toThrow(TypeError);
    expect(() => hammingDistance('a', null)).toThrow(TypeError);
  });
});

describe('hammingDistanceBits', () => {
  it('1 vs 4 -> 2', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  it('0 vs 0 -> 0', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('works with BigInt and large integers', () => {
    const a = 1n << 100n;
    expect(hammingDistanceBits(a, 0n)).toBe(1);
    // two large numbers differing in two bits
    const b = a | (1n << 50n);
    const c = (1n << 50n);
    expect(hammingDistanceBits(b, c)).toBe(1);
  });

  it('throws TypeError for non-integer arguments', () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
    expect(() => hammingDistanceBits('a', 1)).toThrow(TypeError);
  });

  it('throws RangeError for negative integers', () => {
    expect(() => hammingDistanceBits(-1, 2)).toThrow(RangeError);
    expect(() => hammingDistanceBits(1, -2)).toThrow(RangeError);
  });
});
