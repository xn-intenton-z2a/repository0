# BIT_HAMMING

Overview

Compute the Hamming distance between two non-negative integers by counting differing bits in their binary representation. This feature provides a single named export from the library (hammingBits) that is safe, validated, and efficient.

Behaviour

- Export a named function hammingBits(x, y) from src/lib/main.js.
- Validate inputs:
  - If either argument is not a number or not an integer, throw TypeError.
  - If either argument is negative, throw RangeError.
  - If either argument is not a safe integer (Number.isSafeInteger), throw RangeError.
- Implementation:
  - Compute the XOR of x and y, then count set bits (popcount) to return the number of differing bits.
  - Use an efficient bitwise popcount algorithm suitable for JavaScript Numbers within the safe integer range.
- Documentation and tests should show normal, edge and error cases.

Acceptance Criteria

- hammingBits(1, 4) returns 2
- hammingBits(0, 0) returns 0
- hammingBits rejects negative integers with RangeError
- hammingBits rejects non-integer or non-number inputs with TypeError
- hammingBits rejects values outside Number.isSafeInteger with RangeError
- Unit tests cover large values within safe integer range and edge cases

Notes

- Keep API small and focused; the README and example pages should include simple usage examples and the expected outputs.