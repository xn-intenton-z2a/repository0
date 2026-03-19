STRING_HAMMING

Overview

Compute Hamming distance between two strings of equal length, comparing user-visible Unicode code points (not UTF-16 code units). The function should validate inputs and throw appropriate errors.

Behavior

- Export a named function stringHamming(a, b) from src/lib/main.js.
- If either argument is not a string, throw TypeError.
- Convert each string to an array of Unicode code points (handle surrogate pairs and combining marks using standard JavaScript iteration over code points) and compare by code point index.
- If the strings contain different numbers of code points, throw RangeError.
- Return the number of positions where code points differ (integer >= 0).

Acceptance Criteria

- stringHamming("karolin", "kathrin") returns 3
- stringHamming("", "") returns 0
- stringHamming of unequal-length strings throws RangeError
- stringHamming rejects non-string inputs with TypeError
- Handles Unicode correctly: stringHamming("a\u{1F600}", "a\u{1F603}") counts differing emoji code points as 1

Notes

- This feature focuses on library API and unit tests. Ensure examples and README show usage and error handling.
