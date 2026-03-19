# STRING_HAMMING

Overview

Compute the Hamming distance between two strings of equal length by comparing Unicode code points (not UTF-16 code units). This feature provides a named export hammingString that handles Unicode correctly and validates inputs.

Behaviour

- Export a named function hammingString(a, b) from src/lib/main.js.
- Validate inputs:
  - If either argument is not a string, throw TypeError.
- Normalize iteration to Unicode code points (iterate over strings using for...of or Array.from to handle surrogate pairs).
- If the strings contain different numbers of Unicode code points, throw RangeError.
- Return the number of positions where code points differ (integer >= 0).

Acceptance Criteria

- hammingString("karolin", "kathrin") returns 3
- hammingString("", "") returns 0
- hammingString of unequal-length strings throws RangeError
- hammingString rejects non-string inputs with TypeError
- hammingString handles emoji and surrogate-pair characters correctly, counting differing code points as differing positions
- Unit tests cover combining marks and surrogate pairs to ensure comparison by code point index

Notes

- Provide README examples demonstrating Unicode behaviour and the error cases.