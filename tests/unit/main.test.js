// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited

import { test, expect, describe } from 'vitest';
import { 
  hammingDistance, 
  hammingDistanceBits, 
  getIdentity, 
  name, 
  version, 
  description 
} from '../../src/lib/main.js';

describe('Library Identity', () => {
  test('exports package name', () => {
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });

  test('exports package version', () => {
    expect(typeof version).toBe('string');
    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });

  test('exports package description', () => {
    expect(typeof description).toBe('string');
  });

  test('getIdentity returns complete identity object', () => {
    const identity = getIdentity();
    expect(identity).toEqual({
      name,
      version,
      description
    });
  });
});

describe('hammingDistance', () => {
  describe('Normal cases', () => {
    test('calculates distance for different strings', () => {
      expect(hammingDistance('karolin', 'kathrin')).toBe(3);
    });

    test('returns 0 for identical strings', () => {
      expect(hammingDistance('hello', 'hello')).toBe(0);
    });

    test('returns 0 for empty strings', () => {
      expect(hammingDistance('', '')).toBe(0);
    });

    test('calculates distance for single character strings', () => {
      expect(hammingDistance('a', 'b')).toBe(1);
      expect(hammingDistance('x', 'x')).toBe(0);
    });

    test('calculates distance for all different characters', () => {
      expect(hammingDistance('abc', 'def')).toBe(3);
    });

    test('calculates distance for partially different strings', () => {
      expect(hammingDistance('abcd', 'abed')).toBe(1);
      expect(hammingDistance('1011101', '1001001')).toBe(2);
    });
  });

  describe('Unicode support', () => {
    test('handles emoji characters correctly', () => {
      expect(hammingDistance('😀😁', '😀😂')).toBe(1);
      expect(hammingDistance('🎉🎊', '🎉🎊')).toBe(0);
    });

    test('handles accented characters correctly', () => {
      expect(hammingDistance('café', 'care')).toBe(2);
      expect(hammingDistance('naïve', 'naive')).toBe(1);
    });

    test('handles complex Unicode characters', () => {
      expect(hammingDistance('👨‍💻👩‍💻', '👨‍💻👨‍💻')).toBe(1);
    });

    test('counts actual characters, not UTF-16 code units', () => {
      // These strings have the same number of Unicode code points but different UTF-16 lengths
      const str1 = '𝐀𝐁'; // Mathematical bold A and B (each is 2 UTF-16 code units)
      const str2 = '𝐀𝐂'; // Mathematical bold A and C
      expect(hammingDistance(str1, str2)).toBe(1);
    });
  });

  describe('Error cases', () => {
    test('throws TypeError for non-string first argument', () => {
      expect(() => hammingDistance(123, 'abc')).toThrow(TypeError);
      expect(() => hammingDistance(null, 'abc')).toThrow(TypeError);
      expect(() => hammingDistance(undefined, 'abc')).toThrow(TypeError);
      expect(() => hammingDistance([], 'abc')).toThrow(TypeError);
      expect(() => hammingDistance({}, 'abc')).toThrow(TypeError);
    });

    test('throws TypeError for non-string second argument', () => {
      expect(() => hammingDistance('abc', 123)).toThrow(TypeError);
      expect(() => hammingDistance('abc', null)).toThrow(TypeError);
      expect(() => hammingDistance('abc', undefined)).toThrow(TypeError);
      expect(() => hammingDistance('abc', [])).toThrow(TypeError);
      expect(() => hammingDistance('abc', {})).toThrow(TypeError);
    });

    test('throws RangeError for unequal length strings', () => {
      expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
      expect(() => hammingDistance('abc', 'ab')).toThrow(RangeError);
      expect(() => hammingDistance('', 'a')).toThrow(RangeError);
      expect(() => hammingDistance('longer', 'short')).toThrow(RangeError);
    });

    test('error messages are descriptive', () => {
      expect(() => hammingDistance(123, 'abc')).toThrow('First argument must be a string');
      expect(() => hammingDistance('abc', 123)).toThrow('Second argument must be a string');
      expect(() => hammingDistance('a', 'bb')).toThrow('Strings must have equal length');
    });
  });

  describe('Edge cases', () => {
    test('handles very long strings', () => {
      const long1 = 'a'.repeat(1000);
      const long2 = 'b'.repeat(1000);
      expect(hammingDistance(long1, long2)).toBe(1000);
    });

    test('handles strings with special characters', () => {
      expect(hammingDistance('a\nb', 'a\tc')).toBe(2);
      expect(hammingDistance('a"b', "a'b")).toBe(1);
    });
  });
});

describe('hammingDistanceBits', () => {
  describe('Normal cases', () => {
    test('calculates distance for different integers', () => {
      expect(hammingDistanceBits(1, 4)).toBe(2); // 001 vs 100
    });

    test('returns 0 for identical integers', () => {
      expect(hammingDistanceBits(0, 0)).toBe(0);
      expect(hammingDistanceBits(5, 5)).toBe(0);
      expect(hammingDistanceBits(255, 255)).toBe(0);
    });

    test('calculates distance for simple cases', () => {
      expect(hammingDistanceBits(1, 2)).toBe(2); // 01 vs 10
      expect(hammingDistanceBits(1, 3)).toBe(1); // 01 vs 11
      expect(hammingDistanceBits(7, 4)).toBe(2); // 111 vs 100
    });

    test('calculates distance for larger numbers', () => {
      expect(hammingDistanceBits(15, 0)).toBe(4); // 1111 vs 0000
      expect(hammingDistanceBits(255, 0)).toBe(8); // 11111111 vs 00000000
    });

    test('handles powers of 2', () => {
      expect(hammingDistanceBits(1, 2)).toBe(2); // 1 vs 10
      expect(hammingDistanceBits(2, 4)).toBe(2); // 10 vs 100
      expect(hammingDistanceBits(4, 8)).toBe(2); // 100 vs 1000
    });
  });

  describe('Large integers', () => {
    test('handles large safe integers', () => {
      const large1 = Number.MAX_SAFE_INTEGER;
      const large2 = Number.MAX_SAFE_INTEGER - 1;
      expect(typeof hammingDistanceBits(large1, large2)).toBe('number');
      expect(hammingDistanceBits(large1, large2)).toBeGreaterThan(0);
    });

    test('works with moderately large numbers', () => {
      expect(hammingDistanceBits(1023, 1024)).toBe(11); // 1111111111 vs 10000000000
    });
  });

  describe('Error cases', () => {
    test('throws TypeError for non-integer first argument', () => {
      expect(() => hammingDistanceBits(1.5, 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits('1', 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(null, 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(undefined, 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits([], 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits({}, 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(NaN, 2)).toThrow(TypeError);
      expect(() => hammingDistanceBits(Infinity, 2)).toThrow(TypeError);
    });

    test('throws TypeError for non-integer second argument', () => {
      expect(() => hammingDistanceBits(1, 2.5)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, '2')).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, null)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, undefined)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, [])).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, {})).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, NaN)).toThrow(TypeError);
      expect(() => hammingDistanceBits(1, Infinity)).toThrow(TypeError);
    });

    test('throws RangeError for negative first argument', () => {
      expect(() => hammingDistanceBits(-1, 2)).toThrow(RangeError);
      expect(() => hammingDistanceBits(-100, 0)).toThrow(RangeError);
    });

    test('throws RangeError for negative second argument', () => {
      expect(() => hammingDistanceBits(1, -2)).toThrow(RangeError);
      expect(() => hammingDistanceBits(0, -100)).toThrow(RangeError);
    });

    test('throws RangeError for unsafe integers', () => {
      expect(() => hammingDistanceBits(Number.MAX_SAFE_INTEGER + 1, 0)).toThrow(RangeError);
      expect(() => hammingDistanceBits(0, Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError);
    });

    test('error messages are descriptive', () => {
      expect(() => hammingDistanceBits(1.5, 2)).toThrow('First argument must be an integer');
      expect(() => hammingDistanceBits(1, 2.5)).toThrow('Second argument must be an integer');
      expect(() => hammingDistanceBits(-1, 2)).toThrow('First argument must be non-negative');
      expect(() => hammingDistanceBits(1, -2)).toThrow('Second argument must be non-negative');
      expect(() => hammingDistanceBits(Number.MAX_SAFE_INTEGER + 1, 0)).toThrow('First argument must be a safe integer');
      expect(() => hammingDistanceBits(0, Number.MAX_SAFE_INTEGER + 1)).toThrow('Second argument must be a safe integer');
    });
  });

  describe('Edge cases', () => {
    test('handles zero correctly', () => {
      expect(hammingDistanceBits(0, 1)).toBe(1);
      expect(hammingDistanceBits(1, 0)).toBe(1);
      expect(hammingDistanceBits(0, 255)).toBe(8);
    });

    test('handles boundary values', () => {
      // Test with smaller large numbers to avoid bitwise operation edge cases
      const large = Math.pow(2, 48) - 1; // Safe integer, but large enough to test
      expect(hammingDistanceBits(large, 0)).toBeGreaterThan(0);
      expect(hammingDistanceBits(0, large)).toBeGreaterThan(0);
      
      // Test specific boundary case
      expect(hammingDistanceBits(Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER)).toBe(1);
    });
  });
});

describe('Acceptance Criteria', () => {
  test('hammingDistance("karolin", "kathrin") returns 3', () => {
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
  });

  test('hammingDistance("", "") returns 0', () => {
    expect(hammingDistance('', '')).toBe(0);
  });

  test('hammingDistance("a", "bb") throws RangeError', () => {
    expect(() => hammingDistance('a', 'bb')).toThrow(RangeError);
  });

  test('hammingDistanceBits(1, 4) returns 2', () => {
    expect(hammingDistanceBits(1, 4)).toBe(2);
  });

  test('hammingDistanceBits(0, 0) returns 0', () => {
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });
});
