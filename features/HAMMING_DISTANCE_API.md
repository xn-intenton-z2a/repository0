# HAMMING_DISTANCE_API (ARCHIVED)

This feature has been implemented in src/lib/main.js and is archived from the active feature set.

Implementation location: `src/lib/main.js`

Replaced by focused feature specs:
- `features/HAMMING_DISTANCE_TESTS.md` — unit test requirements and acceptance criteria
- `features/HAMMING_DISTANCE_README.md` — README documentation and examples
- `features/HAMMING_DISTANCE_EXPORTS.md` — export/API surface verification

Rationale

Keep the original spec for historical context but mark it archived so the active features list reflects current outstanding work.

Motivation

Provide a single, well-specified API for computing Hamming distances for strings and integers that is safe, well-tested, and easy to use from the library, CLI and website.

Specification

- Exports: named exports hammingDistance and hammingDistanceBits from src/lib/main.js.
- hammingDistance(a, b): accepts two strings and returns an integer count of positions where Unicode code points differ.
  - Must treat strings as sequences of Unicode code points, not UTF-16 code units — use proper iteration over code points.
  - If inputs are not strings, throw TypeError.
  - If strings have different code point lengths, throw RangeError.
  - Empty strings are valid and return 0.
- hammingDistanceBits(x, y): accepts two non-negative integers and returns the count of differing bits.
  - If inputs are not integers (number type but not integral) or are negative, throw TypeError for wrong type and RangeError for negative values.
  - Use bitwise operations on BigInt when necessary to support large integers beyond 32 bits.
  - Accept zero and return 0 when both are zero.

API

- hammingDistance(a, b) -> Number
  - Parameters: a: string, b: string
  - Returns: non-negative integer
  - Errors: TypeError for non-string inputs; RangeError for unequal-length strings

- hammingDistanceBits(x, y) -> Number
  - Parameters: x: non-negative integer, y: non-negative integer
  - Returns: non-negative integer (count of differing bits)
  - Errors: TypeError for non-integer inputs; RangeError for negative integers

Examples

hammingDistance("karolin", "kathrin") -> 3
hammingDistance("", "") -> 0
hammingDistance("a", "bb") -> throws RangeError

hammingDistanceBits(1, 4) -> 2
hammingDistanceBits(0, 0) -> 0

Acceptance Criteria

- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistanceBits(1, 4) returns 2
- hammingDistanceBits(0, 0) returns 0
- Unicode grapheme clusters are not required; comparison is by Unicode code points (so surrogate pairs are counted as single code points)
- Both functions are exported as named exports from src/lib/main.js
- Unit tests exist in tests/unit/ that cover normal, edge and error cases
- README.md contains usage examples and API documentation for both functions

Implementation Notes

- Implement hammingDistance using for-of iteration over strings to iterate code points rather than indexing by charCodeAt.
- For hammingDistanceBits use BigInt to accept large non-negative integers and use x ^ y followed by a population count loop (e.g., Brian Kernighan algorithm) on BigInt.
- Validate numeric integrality with Number.isInteger for Number inputs; accept BigInt inputs as integers as well.
- Keep changes limited: update src/lib/main.js, tests/unit/main.test.js, README.md, and examples/ if present.

Files to change

- src/lib/main.js: export the two functions and ensure proper validation and Unicode handling
- tests/unit/main.test.js: add unit tests that assert acceptance criteria
- README.md: document API and add usage examples
- package.json: no dependency changes required; prefer built-in BigInt and JS utilities

Testing and Verification

- Tests must be runnable with npm test and pass on a clean environment.
- Ensure tests cover empty strings, surrogate pairs, zero, large integers, negative and non-integer inputs raising correct errors.

Notes

This feature is intentionally scoped to a single-file implementation augmented by tests and README updates so it is achievable within this repository without adding external dependencies.

