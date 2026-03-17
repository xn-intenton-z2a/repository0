# BIT_HAMMING

Summary

Specifies the behaviour for computing Hamming distance between two non-negative integers at bit level. The function counts differing bits in the binary representation of both integers.

Behavior

- Accepts two arguments and returns the count of differing bits.
- Both arguments must be integers (Number) and non-negative.
- The function must treat numbers as standard JS numbers (safe integers) and provide sensible behaviour for large integers up to Number.MAX_SAFE_INTEGER.

Public API

- Named export: hammingDistanceBits(a, b)
  - a: non-negative integer (Number)
  - b: non-negative integer (Number)
  - Returns: non-negative integer (number of differing bits)
  - Throws TypeError if either argument is not a number or not an integer
  - Throws RangeError if either argument is negative

Acceptance criteria (testable)

1. hammingDistanceBits(1, 4) returns 2 (binary 001 vs 100).
2. hammingDistanceBits(0, 0) returns 0.
3. hammingDistanceBits(0, 1) returns 1.
4. hammingDistanceBits(42, 42) returns 0.
5. hammingDistanceBits(-1, 1) throws a RangeError.
6. hammingDistanceBits(1.5, 1) throws a TypeError.

Examples (to appear in unit tests)

- hammingDistanceBits(1, 4) === 2
- hammingDistanceBits(0, 0) === 0

Notes for implementer

- Use bitwise operations or XOR + bit-counting to compute differing bits. Ensure use of integer checks (Number.isInteger) and non-negativity checks.
- Document behaviour for values near Number.MAX_SAFE_INTEGER; prefer rejecting non-safe integer inputs or explicitly documenting the safe range.
