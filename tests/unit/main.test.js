import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance', () => {
  it('computes known example karolin vs kathrin', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('empty strings return 0', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws RangeError for unequal lengths', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('throws TypeError for non-string arguments', () => {
    expect(() => hammingDistance(1, 'a')).toThrow(TypeError);
  });

  it('handles Unicode code points (astral emojis) correctly', () => {
    const a = '\u{1F600}\u{1F601}'; // 😀😁
    const b = '\u{1F600}\u{1F602}'; // 😀😂
    expect(hammingDistance(a, b)).toBe(1);
  });
});

describe('hammingDistanceBits', () => {
  it('computes 1 vs 4 -> 2 differing bits', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  it('zero vs zero returns 0', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('works with large BigInt integers', () => {
    const a = (2n ** 64n) + 1n;
    const b = 2n ** 64n;
    expect(hammingDistanceBits(a, b)).toBe(1);
  });

  it('throws RangeError for negative integers', () => {
    expect(() => hammingDistanceBits(-1, 0)).toThrow(RangeError);
  });

  it('throws TypeError for non-integer-like inputs', () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
  });
});
