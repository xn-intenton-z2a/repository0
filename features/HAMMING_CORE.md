# HAMMING_CORE

Specification

Implement the core Hamming distance API and tests as the canonical feature for the repository. This feature must be implemented in src/lib/main.js and exported as named exports: hammingDistance and hammingDistanceBits. The implementation must be idiomatic ES modules and must not change the public file layout of the repository.

Behavior

- hammingDistance(a, b)
  - Accepts two string arguments and returns the number of positions with differing Unicode code points.
  - Must iterate over code points (not UTF-16 code units) so that surrogate-pair characters count as a single position.
  - Throws TypeError if either argument is not a string.
  - Throws RangeError if strings have different lengths when measured in code points.

- hammingDistanceBits(x, y)
  - Accepts two non-negative integers and returns the number of differing bits in their binary representation.
  - Throws TypeError if either argument is not an integer number type.
  - Throws RangeError if either integer is negative.

Exports

- Both functions must be exported as named exports from src/lib/main.js.

Tests and Examples

- Add comprehensive unit tests under tests/unit/ to cover normal cases, edge cases, and error conditions.
- Update README with usage examples showing both functions in simple form and edge cases.

Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- Invalid types throw TypeError as specified
- All unit tests pass
