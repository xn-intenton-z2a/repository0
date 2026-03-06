# HAMMING_CORE

Summary

A focused library feature implementing the repository mission: two named exports that compute Hamming distance between equal-length Unicode strings and between non-negative integers at the bit level. The implementation must be small, dependency-free, and prioritise correctness, Unicode-safety, clear validation semantics, and comprehensive tests.

Motivation

Provide a reliable, well-documented JavaScript library that other projects can import to calculate Hamming distances for text and integer bit patterns. Correct handling of Unicode code points and strict validation remove a common source of subtle bugs.

Specification

- Export two named functions from src/lib/main.js: hammingDistance and hammingDistanceBits.
- hammingDistance(a, b):
  - Accepts two string arguments and returns a non-negative integer counting positions where the strings differ when compared by Unicode code point (not UTF-16 code units).
  - Validation:
    - Throw TypeError if either argument is not a string.
    - Throw RangeError if the strings have different lengths measured in Unicode code points.
  - Behavior:
    - Compare code points (for example using for...of, Array.from, or spread on strings) so astral symbols and composed characters are counted per code point.
    - Return 0 for two empty strings.
- hammingDistanceBits(x, y):
  - Accepts two non-negative integers and returns the number of differing bits between their binary representations.
  - Validation:
    - Throw TypeError if either argument is not a number or not an integer.
    - Throw RangeError if either integer is negative.
  - Behavior:
    - Use bitwise XOR and a bit-counting algorithm (e.g., Brian Kernighan's) to count set bits in the XOR result.
    - Large safe integers should be handled within JavaScript Number safe-integer limits; document limits in README.

API

- Named exports (ES module):
  - hammingDistance(a: string, b: string): number
  - hammingDistanceBits(x: number, y: number): number

Validation and testing

- Unit tests MUST be placed in tests/unit/ and cover:
  - Normal cases (example: "karolin" vs "kathrin" => 3)
  - Edge cases: empty strings, single-character strings, strings containing astral symbols and composed characters
  - Error cases: non-string inputs for hammingDistance, unequal-length strings, non-integer or negative inputs for hammingDistanceBits
  - Numeric edge cases: zero, large integers within Number.MAX_SAFE_INTEGER
- Tests should assert both return values and that the correct error types are thrown (TypeError or RangeError).
- The package test script (npm test) must run the unit tests and pass.

Acceptance criteria

- hammingDistance("karolin", "kathrin") returns 3.
- hammingDistance("", "") returns 0.
- hammingDistance("a", "bb") throws RangeError.
- hammingDistance handles Unicode code points correctly (astral symbols and composed characters are compared per code point).
- hammingDistanceBits(1, 4) returns 2.
- hammingDistanceBits(0, 0) returns 0.
- hammingDistanceBits throws TypeError for non-integer inputs and RangeError for negative integers.
- Both functions are exported as named exports from src/lib/main.js and documented in README.md.
- All unit tests for the feature pass under the repository test script.

Notes

- Keep implementation minimal and dependency-free. Document any known numeric limits in README (e.g., Number.MAX_SAFE_INTEGER). The CLI is optional and must import these exports rather than re-implement them.