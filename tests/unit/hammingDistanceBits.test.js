import { describe, test, expect } from 'vitest';
import { hammingDistanceBits } from '../../src/lib/main.js';

describe('hammingDistanceBits', () => {
  describe('acceptance criteria', () => {
    test('hammingDistanceBits(1, 4) returns 2', () => {
      expect(hammingDistanceBits(1, 4)).toBe(2); // binary: 001 vs 100
    });

    test('hammingDistanceBits(0, 0) returns 0', () => {
      expect(hammingDistanceBits(0, 0)).toBe(0);
    });
  });

  describe('normal cases', () => {
    test('returns 0 for identical integers', () => {
      expect(hammingDistanceBits(5, 5)).toBe(0);
      expect(hammingDistanceBits(255, 255)).toBe(0);
    });

    test('computes correct distance for different integers', () => {
      expect(hammingDistanceBits(7, 4)).toBe(2); // 111 vs 100
      expect(hammingDistanceBits(5, 3)).toBe(2); // 101 vs 011
      expect(hammingDistanceBits(15, 0)).toBe(4); // 1111 vs 0000
    });

    test('handles single bit differences', () => {
      expect(hammingDistanceBits(0, 1)).toBe(1);
      expect(hammingDistanceBits(2, 3)).toBe(1); // 10 vs 11
      expect(hammingDistanceBits(8, 12)).toBe(1); // 1000 vs 1100
    });
  });

  describe('large integers', () => {
    test('handles large bit patterns', () => {
      expect(hammingDistanceBits(1024, 2048)).toBe(2);
      expect(hammingDistanceBits(65535, 0)).toBe(16); // 16 bits all different
    });

    test('handles powers of 2', () => {
      expect(hammingDistanceBits(1, 2)).toBe(2); // 01 vs 10
      expect(hammingDistanceBits(4, 8)).toBe(2); // 0100 vs 1000
      expect(hammingDistanceBits(16, 32)).toBe(2);
    });
  });

  describe('input validation', () => {
    test('throws TypeError for non-integer arguments', () => {
      expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, 2.5)).toThrow(TypeError);
      expect(() => hammingDistanceBits("1", 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, "2")).toThrow(TypeError);
      expect(() => hammingDistanceBits(NaN, 2)).toThrow(TypeError);
    });

    test('throws RangeError for negative integers', () => {
      expect(() => hammingDistanceBits(-1, 2)).toThrow(RangeError);
      expect(() => hammingDistanceBits(1, -2)).toThrow(RangeError);
      expect(() => hammingDistanceBits(-1, -2)).toThrow(RangeError);
    });

    test('error messages are correct', () => {
      expect(() => hammingDistanceBits(1.5, 2)).toThrow('First argument must be an integer');
      expect(() => hammingDistanceBits(1, 2.5)).toThrow('Second argument must be an integer');
      expect(() => hammingDistanceBits(-1, 2)).toThrow('First argument must be non-negative');
      expect(() => hammingDistanceBits(1, -2)).toThrow('Second argument must be non-negative');
    });
  });
});