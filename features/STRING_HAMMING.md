# STRING_HAMMING

Summary

Specifies computing Hamming distance between two strings of equal length measured in Unicode code points. The implementation must compare code points (not UTF-16 code units) and validate inputs precisely.

Behavior

- Accepts two arguments and returns the number of positions at which corresponding Unicode code points differ.
- Both arguments must be strings and must contain the same number of Unicode code points.
- Comparison is performed at code point granularity. Grapheme cluster equivalence (composed characters) is out of scope; the library operates on code points.

Public API

- Named export: hammingDistanceStrings(a, b)
  - a: string
  - b: string
  - Returns: non-negative integer (number of differing code points)
  - Throws TypeError if either argument is not a string
  - Throws RangeError if strings contain different numbers of code points

Acceptance criteria (testable)

1. hammingDistanceStrings("karolin", "kathrin") === 3.
2. hammingDistanceStrings("", "") === 0.
3. hammingDistanceStrings("a", "ab") throws RangeError.
4. hammingDistanceStrings(42, "a") throws TypeError.
5. Implementation compares using code points (Array.from or spread operator) so astral symbols count as single code points (see UNICODE_SUPPORT for examples).

Examples for unit tests

- assert(hammingDistanceStrings("karolin", "kathrin") === 3)
- assert(hammingDistanceStrings("", "") === 0)
- assert.throws(() => hammingDistanceStrings("a", "ab"), RangeError)

Notes for implementer

- Convert both strings to arrays of code points: const aPoints = Array.from(a); const bPoints = Array.from(b); then compare lengths and iterate by index.
- Avoid indexing the original string by code unit (str[i]) before splitting to code points.