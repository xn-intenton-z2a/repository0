# HAMMING_CORE

Specification

Implement the core Hamming distance API and tests as the canonical feature for the repository. This feature must be implemented in src/lib/main.js and exported as named exports: hammingDistance and hammingDistanceBits. The implementation must be idiomatic ES modules and must not change the public file layout of the repository.

Behavior

- hammingDistance(a, b)
  - Accepts two string arguments and returns the number of positions with differing Unicode code points.
  - Must iterate over Unicode code points (not UTF-16 code units) so that surrogate-pair characters count as a single position.
  - Throws TypeError if either argument is not a string.
  - Throws RangeError if strings have different lengths when measured in code points.

- hammingDistanceBits(x, y)
  - Accepts two non-negative integers or BigInt values and returns the number of differing bits in their binary representation.
  - The function must accept Number integers (safe integer range) and BigInt values; mixed-type calls (Number and BigInt) are allowed and will be coerced into BigInt for bitwise comparison.
  - Throws TypeError if either argument is not a Number integer or a BigInt.
  - Throws RangeError if either numeric argument is negative (for Number) or negative BigInt.
  - The computation must work correctly for very large BigInt values beyond Number.MAX_SAFE_INTEGER.

Exports

- Both functions must be exported as named exports from src/lib/main.js.

Tests and Examples

- Add comprehensive unit tests under tests/unit/ to cover normal cases, edge cases, and error conditions for both Number and BigInt inputs.
- Examples in README must show usage for both string mode and bits mode, including BigInt examples (for example using the n suffix: 9007199254740993n).

Implementation notes

- hammingDistance should iterate by code points (for example, Array.from or for...of over the string) to correctly handle surrogate pairs.
- hammingDistanceBits may convert Number inputs to BigInt internally for uniform processing when either argument is a BigInt or when values exceed safe integer range.
- Preserve the existing TypeError and RangeError semantics; do not silently coerce invalid types.

Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits(1n, 4n) returns 2
- hammingDistanceBits(9007199254740993n, 9007199254740993n) returns 0 (large BigInt identity)
- hammingDistanceBits(1, 4n) returns 2 (mixed Number/BigInt allowed)
- Negative Number or BigInt arguments throw RangeError
- Non-integer Number or non-BigInt/Number types throw TypeError
- All unit tests pass and the README is updated with BigInt usage examples
