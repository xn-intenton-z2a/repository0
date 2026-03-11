import { describe, test, expect } from 'vitest';
import { hammingDistance } from '../../src/lib/main.js';

describe('hammingDistance', () => {
  describe('acceptance criteria', () => {
    test('hammingDistance("karolin", "kathrin") returns 3', () => {
      expect(hammingDistance("karolin", "kathrin")).toBe(3);
    });

    test('hammingDistance("", "") returns 0', () => {
      expect(hammingDistance("", "")).toBe(0);
    });

    test('hammingDistance("a", "bb") throws RangeError', () => {
      expect(() => hammingDistance("a", "bb")).toThrow(RangeError);
    });
  });

  describe('normal cases', () => {
    test('returns 0 for identical strings', () => {
      expect(hammingDistance("hello", "hello")).toBe(0);
      expect(hammingDistance("test", "test")).toBe(0);
    });

    test('computes correct distance for different strings', () => {
      expect(hammingDistance("abc", "axc")).toBe(1);
      expect(hammingDistance("abc", "xyz")).toBe(3);
      expect(hammingDistance("hello", "world")).toBe(4);
    });
  });

  describe('Unicode support', () => {
    test('handles Unicode characters correctly', () => {
      expect(hammingDistance("café", "case")).toBe(2);
      expect(hammingDistance("🚀🌟", "🚀🎉")).toBe(1);
      expect(hammingDistance("αβγ", "αβδ")).toBe(1);
    });

    test('handles emoji and surrogate pairs', () => {
      expect(hammingDistance("👋🌍", "👋🌎")).toBe(1);
      expect(hammingDistance("🎵🎶", "🎵🎵")).toBe(1);
    });
  });

  describe('input validation', () => {
    test('throws TypeError for non-string arguments', () => {
      expect(() => hammingDistance(123, "abc")).toThrow(TypeError);
      expect(() => hammingDistance("abc", 123)).toThrow(TypeError);
      expect(() => hammingDistance(null, "abc")).toThrow(TypeError);
      expect(() => hammingDistance("abc", null)).toThrow(TypeError);
    });

    test('throws RangeError for unequal length strings', () => {
      expect(() => hammingDistance("a", "bb")).toThrow(RangeError);
      expect(() => hammingDistance("abc", "ab")).toThrow(RangeError);
      expect(() => hammingDistance("", "a")).toThrow(RangeError);
    });

    test('error messages are correct', () => {
      expect(() => hammingDistance(123, "abc")).toThrow('First argument must be a string');
      expect(() => hammingDistance("abc", 123)).toThrow('Second argument must be a string');
      expect(() => hammingDistance("a", "bb")).toThrow('Strings must have equal length');
    });
  });
});