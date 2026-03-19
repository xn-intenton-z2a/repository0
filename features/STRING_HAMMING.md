# STRING_HAMMING

Purpose

Provide a clear, testable specification for computing the Hamming distance between two strings of equal length, measured in Unicode code points.

Behavior

- Export a named function stringHamming(a, b) from src/lib/main.js that returns the number of positions at which two input strings differ, measured by Unicode code points.
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

Implementation notes

- Perform length and per-position comparisons in code points (Array.from or for-of iteration). Do not rely on String.prototype.length for code point counts.
- Tests should include ASCII and astral code point examples to validate correct behavior.
