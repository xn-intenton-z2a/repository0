BIT_HAMMING

Overview

Compute Hamming distance between two non-negative integers by counting differing bits in their binary representation.

Behavior

- Export a named function bitHamming(x, y) from src/lib/main.js.
- If either argument is not a number or is not an integer, throw TypeError.
- If either argument is negative, throw RangeError.
- Compute differing bits using an efficient bit-popcount of x XOR y and return the count (integer >= 0).
- Support large integers within JavaScript safe integer range; validate inputs accordingly.

Acceptance Criteria

- bitHamming(1, 4) returns 2
- bitHamming(0, 0) returns 0
- bitHamming rejects negative integers with RangeError
- bitHamming rejects non-integer or non-number inputs with TypeError
- Works for large integers within Number.isSafeInteger limits

Notes

- Include unit tests demonstrating popcount correctness and edge cases (zero, same values, large values).