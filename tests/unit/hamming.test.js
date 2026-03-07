import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('Hamming distance (strings)', () => {
  it('karolin vs kathrin -> 3', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('empty strings -> 0', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('unequal lengths throws RangeError', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('handles Unicode code points correctly', () => {
    expect(hammingDistance('A𝔸', 'AA')).toBe(1);
  });
});

describe('Hamming distance (bits)', () => {
  it('1 vs 4 -> 2', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  it('0 vs 0 -> 0', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('large integers using BigInt', () => {
    expect(hammingDistanceBits(0n, 1n << 65n)).toBe(1);
  });

  it('negative integer throws RangeError', () => {
    expect(() => hammingDistanceBits(-1, 0)).toThrow(RangeError);
  });

  it('non-integer throws TypeError', () => {
    // @ts-ignore
    expect(() => hammingDistanceBits('a', 1)).toThrow(TypeError);
  });
});
