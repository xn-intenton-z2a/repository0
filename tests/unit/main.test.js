import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistance', () => {
  it('computes known example', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('handles empty strings', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('throws for unequal lengths', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('handles Unicode code points (surrogate pairs)', () => {
    // "😊" and "😃" are distinct single code points
    expect(hammingDistance('a😊', 'a😃')).toBe(1);
  });

  it('throws for non-string inputs', () => {
    expect(() => hammingDistance(1, 'a')).toThrow(TypeError);
  });
});

describe('hammingDistanceBits', () => {
  it('computes known numeric example', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  it('handles zeros', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  it('works with BigInt inputs', () => {
    expect(hammingDistanceBits(1n, 4n)).toBe(2);
  });

  it('throws for negative numbers', () => {
    expect(() => hammingDistanceBits(-1, 1)).toThrow(RangeError);
    expect(() => hammingDistanceBits(-1n, 1n)).toThrow(RangeError);
  });

  it('throws for non-integer numbers', () => {
    expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
  });
});
