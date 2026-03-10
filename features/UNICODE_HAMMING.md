# UNICODE_HAMMING

## Summary
This feature specifies a Unicode-aware Hamming distance API and test matrix for the repository. It defines precise validation, behaviour for Unicode code points, bitwise distance semantics for integers, and the unit tests and README examples required to meet the mission.

## Motivation
The library must correctly compare strings at the Unicode code point level so that astral characters and composed sequences are treated as distinct code points rather than UTF-16 code units. Clear validation rules and exhaustive unit tests prevent regressions and make behaviour explicit for library consumers.

## Scope
Update the following files within this repository only:
- src/lib/main.js: export named functions hammingDistance and hammingDistanceBits with the behaviour described below.
- tests/unit/main.test.js: add unit tests covering normal cases, edge cases, and error cases.
- README.md: add API documentation and short examples demonstrating Unicode and bitwise behaviour.
- src/web/: optionally add or update a minimal interactive demo that exercises both functions.

Changes must be small and focused to keep the feature implementable in a single pull request.

## Behaviour Specification
- hammingDistance(a, b)
  - Parameters: two values a and b.
  - Type validation: if either a or b is not of type string, throw TypeError.
  - Length validation: measure length in Unicode code points (use the string iterator or Array.from to obtain code points). If the two strings have different code point counts, throw RangeError.
  - Comparison: compare corresponding code points (not UTF-16 code units). Each code point position is counted once, so characters outside the BMP count as one position.
  - Return: a non-negative integer equal to the number of positions where corresponding code points differ.
  - Normalisation and grapheme clusters: do not attempt to perform Unicode normalization or grapheme cluster segmentation; treat combining marks and clusters as sequences of code points and compare per code point.

- hammingDistanceBits(x, y)
  - Parameters: two values x and y.
  - Type validation: if either x or y is not a number or not an integer, throw TypeError.
  - Range validation: if either integer is negative, throw RangeError.
  - Comparison: compute the bitwise XOR of the two integers and count set bits (population count).
  - Return: a non-negative integer equal to the number of differing bits.

## Errors and Validation
- hammingDistance throws TypeError for non-string arguments and RangeError when code point lengths differ.
- hammingDistanceBits throws TypeError for non-integer or non-number arguments and RangeError for negative integers.
- The functions must not coerce inputs silently; callers are required to pass correctly typed arguments.

## Testing and Acceptance Criteria
Add unit tests that assert the following behaviour exactly:
- hammingDistance("karolin", "kathrin") returns 3
- hammingDistance("", "") returns 0
- hammingDistance("a", "bb") throws RangeError
- hammingDistance("😃", "😄") compares as two single-position strings and returns 1 when code points differ
- hammingDistance handles astral characters: each astral code point counts as one position
- hammingDistance treats combining marks as separate code points (do not normalise)
- hammingDistanceBits(1, 4) returns 2 (binary 001 vs 100)
- hammingDistanceBits(0, 0) returns 0
- hammingDistanceBits on large integers and zero behaves correctly (include a test for a 32-bit boundary case)
- Appropriate TypeError and RangeError tests for invalid inputs

All tests must be runnable with the existing test script and pass under the repository Node engine constraint.

## README Examples
Supply short, copy-pasteable examples (no code fences) that demonstrate:
- String example: hammingDistance("karolin", "kathrin") -> 3
- Empty strings: hammingDistance("", "") -> 0
- Emoji/astral example: hammingDistance("😃", "😄") -> 1
- Bitwise example: hammingDistanceBits(1, 4) -> 2

## Deliverables
- Updated features/UNICODE_HAMMING.md (this file) describing the feature and acceptance criteria.
- Implementation in src/lib/main.js exporting named functions hammingDistance and hammingDistanceBits.
- Unit tests in tests/unit/main.test.js that cover all acceptance criteria.
- README.md updated with concise API docs and examples.

## Acceptance Checklist
1. hammingDistance("karolin", "kathrin") returns 3
2. hammingDistance("", "") returns 0
3. hammingDistance("a", "bb") throws RangeError
4. Astral characters count as single positions when comparing code points
5. hammingDistanceBits(1, 4) returns 2
6. hammingDistanceBits(0, 0) returns 0
7. All unit tests pass with npm test

## Notes
- Prefer clear, idiomatic JavaScript (use for..of or Array.from for code points).
- Keep the implementation and tests minimal and focused so the feature can be completed in a single PR.
