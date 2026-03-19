# STRING_HAMMING

Purpose

Provide a clear, testable specification for computing the Hamming distance between two strings of equal length. This feature defines behavior, errors, examples, and acceptance criteria so the library can implement and test string Hamming distances.

Behavior

- Export a named function stringHamming(a, b) from src/lib/main.js that returns the number of positions at which two input strings differ, measured by Unicode code points.
- If a and b are equal-length strings, return a non-negative integer representing differing code point positions.
- If both strings are empty, return 0.

Input validation

- If either argument is not a string, throw TypeError.
- If the strings differ in code point length, throw RangeError.

Examples (for tests)

- stringHamming("karolin", "kathrin") -> 3
- stringHamming("", "") -> 0
- stringHamming("a", "b") -> 1

Acceptance criteria

- Hamming distance between "karolin" and "kathrin" is 3.
- Hamming distance between "" and "" is 0.
- Calling stringHamming on strings of unequal code point length throws RangeError.
- Passing a non-string for either argument throws TypeError.

Notes for implementation

- Implementation must compare Unicode code points (not UTF-16 code units). Use an approach that iterates code points (for example spread-to-array or for-of on strings) when measuring length and indexing positions for comparison.
- Tests should include ASCII and multi-code-point inputs to ensure behavior is correct.
