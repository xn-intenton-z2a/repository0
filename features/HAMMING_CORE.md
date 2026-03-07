# HAMMING_CORE

Overview

Define and specify the core Hamming distance feature: two named exports that compute Hamming distance for Unicode strings and for non-negative integers at bit level. This feature focuses on correctness, input validation, clear edge case behaviour, and testable acceptance criteria that map directly to unit tests in tests/unit.

Specification

API

- hammingDistance(a, b)
  - Named export from src/lib/main.js.
  - Accepts two string arguments and returns an integer representing the number of positions where the two strings differ when compared by Unicode code points.
  - If either argument is not a string, throws TypeError.
  - If the strings have different lengths when counted in Unicode code points, throws RangeError.
  - Correctly handles surrogate pairs and combining sequences by iterating over code points rather than UTF-16 code units.

- hammingDistanceBits(x, y)
  - Named export from src/lib/main.js.
  - Accepts two non-negative integers and returns the number of differing bits between their binary representations.
  - If either argument is not a safe integer, throws TypeError.
  - If either integer is negative, throws RangeError.
  - The function treats inputs as integer values and counts differing bits up to the highest set bit in either value.

Validation and Errors

- Type checking must be explicit and throw native Error subtypes: TypeError for wrong types, RangeError for invalid ranges or unequal string lengths.
- Implementations should prefer early validation and clear error messages to aid debugging.

Tests Required

- Unit tests must cover:
  - Normal cases: known string pairs and integer pairs with expected distances.
  - Edge cases: empty strings, identical strings, strings containing astral plane characters, long strings, zero and large integers.
  - Error cases: non-string inputs for hammingDistance, mismatched-length strings, non-integer or negative inputs for hammingDistanceBits.

Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- Both functions are exported as named exports from src/lib/main.js
- Unit tests exist and cover the above scenarios

Implementation Notes

- Implementation should be contained to a single source file: src/lib/main.js.
- For Unicode-safe string iteration, use an ES iterator over string code points (for example, using for..of) or equivalent logic to compare lengths and positions by code point.
- For bit distance, use an XOR and population-count algorithm suitable for JavaScript numbers; document behaviour for values beyond Number.MAX_SAFE_INTEGER and prefer rejecting non-safe integers via TypeError.
- Keep the implementation minimal and well-documented so that tests can verify correctness without relying on third-party libraries.
