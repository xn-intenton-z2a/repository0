import { describe, it, expect } from 'vitest';
import { hammingDistance, hammingDistanceBits } from '../../src/lib/main.js';

describe('hamming core', () => {
  it('karolin vs kathrin => 3', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  it('empty strings => 0', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  it('unequal lengths throws RangeError', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  it('bits 1 vs 4 => 2', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  it('bits 0 vs 0 => 0', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });
});
