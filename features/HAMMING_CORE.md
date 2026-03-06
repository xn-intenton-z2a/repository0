# HAMMING_CORE

Summary

A focused feature to implement and document the core Hamming distance library functions required by the mission: hammingDistance and hammingDistanceBits exported as named exports from src/lib/main.js. This feature ensures Unicode-aware string comparison, correct integer bit comparisons, input validation, and comprehensive unit tests and README examples.

Motivation

Provide the primary functionality of the repository: a small, dependable JavaScript library that computes Hamming distances for strings and integers with correct Unicode and input validation semantics. This is the core product the rest of the repository depends on.

Specification

- Export two named functions from src/lib/main.js: hammingDistance and hammingDistanceBits.
- hammingDistance(a, b):
  - Accepts two strings.
  - Compares by Unicode code points (not by UTF-16 code units).
  - Throws TypeError when either argument is not a string.
  - Throws RangeError when strings have different lengths (in code points).
  - Returns an integer count of positions where code points differ.
- hammingDistanceBits(x, y):
  - Accepts two non-negative integers or BigInt values (see BIGINT_SUPPORT for BigInt specifics).
  - Throws TypeError when arguments are not numbers or BigInts.
  - Throws RangeError for negative numeric inputs.
  - Returns the number of differing bits between the two integer values.

Behavior and Edge Cases

- Empty strings should return 0.
- Zero and equal integers should return 0.
- Large integers should be handled within JavaScript number limits; see BIGINT_SUPPORT for larger ranges.
- Surrogate pairs and astral Unicode characters must be counted as single code points.

Tests

Add unit tests in tests/unit/main.test.js covering:
- Normal cases: hammingDistance("karolin", "kathrin") => 3, hammingDistanceBits(1,4) => 2.
- Edge cases: empty strings, single-character strings, identical inputs.
- Error cases: TypeError for non-strings, RangeError for different-length strings, negative integers.

Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- Both functions are exported as named exports from src/lib/main.js
- Unit tests exist and pass locally with npm test

Examples

- hammingDistance("abc", "abd") => 1
- hammingDistanceBits(3, 5) => 2 (011 vs 101)

Compatibility

This feature adheres to CONTRIBUTING.md guidelines for concise, test-driven changes and matches the mission in MISSION.md.
