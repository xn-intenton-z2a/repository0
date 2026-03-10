# UNICODE_HAMMING

## Summary
Add a feature specification to ensure the library implements and documents Unicode-aware Hamming distance behavior for strings and bitwise Hamming distance for integers. This feature consolidates validation rules, precise behaviour for Unicode code points, and the test matrix required to meet the mission.

## Motivation
The mission is to provide a small JavaScript library that exports Hamming distance functions. Correct handling of Unicode strings is crucial because naive UTF-16 code unit comparisons produce incorrect results for astral and composed characters. This feature makes Unicode handling explicit and testable.

## Scope
Change targets (one or more of these will be updated together):
- src/lib/main.js: implement or refine hammingDistance and hammingDistanceBits and ensure Unicode code point comparison.
- tests/unit/main.test.js: add comprehensive unit tests for normal, edge and error cases described below.
- README.md: document the API, validation rules, and examples that demonstrate Unicode handling and bit distances.
- src/web/: small demo showing interactive examples of both functions (optional but recommended for visibility).

All work must remain achievable within this repository and use the existing test runner.

## Detailed Behavior
- hammingDistance(a, b)
  - Accepts two string arguments representing sequences of Unicode code points.
  - Compare by Unicode code points, not UTF-16 code units. Characters outside the Basic Multilingual Plane count as one position each.
  - If either argument is not a string, throw TypeError.
  - If the two strings have different numbers of code points, throw RangeError.
  - Return the number of positions where corresponding code points differ as a non-negative integer.

- hammingDistanceBits(x, y)
  - Accepts two non-negative integers.
  - If either argument is not a number or not an integer, throw TypeError.
  - If either integer is negative, throw RangeError.
  - Return the count of differing bits in the binary representations of the two integers.

## Validation and Errors
- TypeError for invalid argument types: non-string for hammingDistance, non-integer for hammingDistanceBits.
- RangeError when string lengths (measured in Unicode code points) differ, or when integers are negative.
- No silent coercion: callers must pass correct types.

## Testing and Acceptance Criteria
Include unit tests that assert the following (exact values and error types):
- hammingDistance(karolin, kathrin) returns 3
- hammingDistance(, ) returns 0 for two empty strings
- hammingDistance(a, bb) throws RangeError when code point counts differ
- hammingDistance with astral symbols: e.g., two strings each containing a single emoji or astral character compare as length 1 and differ when different code points
- hammingDistanceBits(1, 4) returns 2 (binary 001 vs 100)
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits large integers and zero behave as expected (e.g., 2^32 and 0)
- Type and Range error tests for negative and non-integer inputs

Add tests for edge cases: combining marks, grapheme clusters are considered a sequence of code points and therefore each code point must be compared; do not attempt to normalize or fold grapheme clusters automatically.

## Examples
Provide usage examples in README demonstrating:
- Basic string example that returns 3
- Empty strings returning 0
- Emoji example showing a single-position comparison for an astral character
- Bitwise example showing two differing bits

## Deliverables
- Feature spec file (this document) in features/
- Implementation changes to src/lib/main.js exporting named functions hammingDistance and hammingDistanceBits
- Unit tests added or updated in tests/unit/main.test.js
- README updated with documentation and examples

## Acceptance Criteria (explicit)
1. hammingDistance("karolin", "kathrin") returns 3
2. hammingDistance("", "") returns 0
3. hammingDistance("a", "bb") throws RangeError
4. hammingDistance handles astral characters as single positions when counting and comparing code points
5. hammingDistanceBits(1, 4) returns 2
6. hammingDistanceBits(0, 0) returns 0
7. All unit tests pass using npm test

## Notes
- The implementation should prefer clarity over micro-optimizations; correct Unicode code point iteration can be achieved using the JavaScript iterator for strings.
- Do not change repository-wide configuration or add new top-level files; modify only the allowed files when implementing this feature.
