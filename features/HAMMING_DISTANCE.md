# HAMMING_DISTANCE

## Overview

Add a focused library feature that provides correct, well-documented, and well-tested Hamming distance functions for strings and integers. This feature implements two named exports in the source file: hammingDistance and hammingDistanceBits, with clear validation, Unicode-safe string comparison, and comprehensive unit-test guidance and README examples.

## Motivation

Hamming distance is a compact and widely useful metric for measuring differences between fixed-length sequences and integers at the bit level. The repository mission is to export Hamming distance functions; this feature ensures the implementation meets Unicode, validation, and API documentation standards so downstream users can depend on it reliably.

## API

- Exported functions (named exports) in src/lib/main.js:
  - hammingDistance(a, b)
  - hammingDistanceBits(x, y)

- Behavior summary:
  - hammingDistance compares two strings by Unicode code points and returns the count of positions with differing code points.
  - hammingDistance throws TypeError when a or b is not a string, RangeError when strings have different lengths.
  - hammingDistanceBits compares two non-negative integers and returns the number of differing bits.
  - hammingDistanceBits throws TypeError when x or y is not an integer, RangeError when x or y is negative.

## Requirements

1. Correct Unicode handling: Strings must be compared by code points, not by UTF-16 code units. Surrogate pairs and combining sequences must be treated as per code point iteration; use canonical JavaScript iteration over strings (for-of) or equivalent to iterate code points.
2. Input validation:
   - hammingDistance throws TypeError for non-string inputs.
   - hammingDistance throws RangeError for unequal-length strings (length in code points).
   - hammingDistanceBits throws TypeError for non-integer inputs.
   - hammingDistanceBits throws RangeError for negative integers.
3. Performance: Implementations should handle empty strings and large integers efficiently for typical unit-test sizes; avoid unnecessary allocations.
4. Exports: Both functions must be named exports from src/lib/main.js.

## Tests and Acceptance Criteria

Add or update unit tests under tests/unit/ to satisfy these acceptance criteria (each bullet maps to a test case):

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistance handles Unicode code points correctly, for example two strings that differ only in a multi-code-unit emoji or accented character count differences appropriately
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits throws TypeError for non-integer inputs and RangeError for negative integers
- Edge cases: very long strings of equal length and large integers near JavaScript safe integer range should be tested where sensible

Test descriptions should be explicit and assert both return values and thrown error types.

## README updates

Update README.md to include:
- Short description of both functions and their exported names
- Usage examples with small inputs showing expected results for both functions
- Error behavior summary describing TypeError and RangeError conditions

## Implementation Notes

- For Unicode-safe string length and iteration, iterate strings using JavaScript built-in iterators (for-of) or Array.from to obtain code points; do not rely on .length for code-point length.
- For integer Hamming distance, use bitwise XOR and count set bits using an efficient loop or builtin where available.
- Validate integer-ness using Number.isInteger and non-negativity explicitly.

## Files to modify

- src/lib/main.js: export the two functions (implementation)
- tests/unit/main.test.js: add unit tests covering acceptance criteria
- README.md: add API documentation and usage examples

## Acceptance criteria (formal)

1. Both functions are exported as named exports from src/lib/main.js.
2. All unit tests described in Tests and Acceptance Criteria are present and pass under npm test.
3. README contains API documentation and usage examples demonstrating the functions and common error cases.

## Notes

Keep the implementation minimal and focused on correctness and test coverage. Avoid adding new dependencies for this feature; rely on built-in JavaScript capabilities and the existing test framework.
