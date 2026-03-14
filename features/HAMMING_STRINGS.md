# HAMMING_STRINGS

Purpose

Define string-based Hamming distance behaviour using Unicode code points and validation rules for the library.

Summary

Provide a named export hammingString(a, b) from src/lib/main.js that computes the Hamming distance between two strings of equal length, comparing by Unicode code points (Array.from semantics), not UTF-16 code units.

Behaviour

- Accept exactly two arguments; both must be strings.
- Convert strings to code point arrays (for example using Array.from) and compare positions by code point index.
- Return the number of positions where the two code points differ.
- Return 0 for identical strings, including empty strings.

Validation

- If either argument is not a string, throw TypeError.
- If the two strings differ in code point length, throw RangeError.

Acceptance criteria (testable)

- hammingString("karolin", "kathrin") returns 3.
- hammingString("", "") returns 0.
- hammingString("a", "á") returns 1.
- hammingString("ab", "a") throws RangeError due to unequal lengths.
- Passing non-string arguments (e.g., 1 or null) throws TypeError.

Notes

- Tests should include supplementary Unicode characters (emoji or characters outside BMP) to verify code point counting.
- Grapheme clusters (user-visible combined characters) are out of scope; compare by Unicode code point sequence.
