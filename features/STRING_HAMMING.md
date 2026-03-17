# STRING_HAMMING

Summary

Provides a concise specification for computing Hamming distance between two strings of equal length. The implementation must compare Unicode code points (not UTF-16 code units) and validate inputs.

Behavior

- Accepts two arguments and returns the number of positions at which the corresponding code points are different.
- Both arguments must be strings and must contain the same number of Unicode code points.
- Comparison is done by Unicode code points: characters composed of surrogate pairs or combining marks count as their logical code point sequence when appropriate (see UNICODE_SUPPORT feature for guidance).

Public API

- Named export: hammingDistanceStrings(a, b)
  - a: string
  - b: string
  - Returns: non-negative integer (number of differing code points)
  - Throws TypeError if either argument is not a string
  - Throws RangeError if strings contain different numbers of code points

Acceptance criteria (testable)

1. hammingDistanceStrings("karolin", "kathrin") returns 3.
2. hammingDistanceStrings("", "") returns 0.
3. hammingDistanceStrings("a", "ab") throws a RangeError.
4. hammingDistanceStrings(42, "a") throws a TypeError.
5. Implementation uses Unicode code points (see UNICODE_SUPPORT for example tests with astral characters).

Examples (to appear in unit tests)

- hammingDistanceStrings("karolin", "kathrin") === 3
- hammingDistanceStrings("", "") === 0

Notes for implementer

- Use an approach that splits strings into code points (for example Array.from or spread on a string) before length/position comparison.
- Keep behaviour deterministic and well-documented so unit tests can assert exact counts.
