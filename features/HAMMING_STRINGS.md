# HAMMING_STRINGS

Purpose

Provide a precise specification for computing the Hamming distance between two strings of equal length using Unicode code points (not UTF-16 code units). This feature defines expected behaviour, error handling, and testable acceptance criteria for the string-based Hamming distance API.

Behavior

- Export a named function hammingString(a, b) from src/lib/main.js.
- Accept exactly two arguments. Both arguments must be strings.
- Compare strings by Unicode code points (grapheme clusters are out of scope; compare by Unicode scalar/code point sequence). Positions are compared by code point index; the Hamming distance is the count of positions where code points differ.
- If strings are equal, return 0. If empty, return 0.
- If strings have different lengths (in code point count), throw RangeError.

Inputs and Validation

- If either argument is not a string, throw TypeError.
- If either argument is null or undefined, throw TypeError.

Acceptance criteria

- hammingString("karolin", "kathrin") returns 3.
- hammingString("", "") returns 0.
- hammingString("a", "á") returns 1 (different code points).
- hammingString("ab", "a") throws RangeError due to unequal lengths.
- Passing non-string arguments (e.g., 1, {}) throws TypeError.

Test notes

- Tests should count code points correctly for Unicode supplementary characters (e.g., emoji or characters outside the BMP).
- Unit tests should cover empty strings, multi-byte code points, and error cases described above.
