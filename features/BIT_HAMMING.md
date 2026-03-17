# BIT_HAMMING

Summary

Specifies behaviour for computing Hamming distance between two non-negative integers at the bit level. The function counts differing bits using XOR and a bit-counting algorithm.

Behavior

- Accepts two arguments and returns the count of differing bits between their integer binary representations.
- Both arguments must be Numbers that are integers, non-negative, and within the safe integer range (Number.isSafeInteger).
- Implementation may accept BigInt in a future extension, but current tests target Number values.

Public API

- Named export: hammingDistanceBits(a, b)
  - a: non-negative integer (Number)
  - b: non-negative integer (Number)
  - Returns: non-negative integer (number of differing bits)
  - Throws TypeError if either argument is not a Number or not an integer
  - Throws RangeError if either argument is negative or not a safe integer

Acceptance criteria (testable)

1. hammingDistanceBits(1, 4) === 2 (binary 001 vs 100).
2. hammingDistanceBits(0, 0) === 0.
3. hammingDistanceBits(0, 1) === 1.
4. hammingDistanceBits(42, 42) === 0.
5. hammingDistanceBits(-1, 1) throws RangeError.
6. hammingDistanceBits(1.5, 1) throws TypeError.
7. hammingDistanceBits(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) === 0 (if both equal).

Examples for unit tests

- assert(hammingDistanceBits(1, 4) === 2)
- assert.throws(() => hammingDistanceBits(-1, 1), RangeError)
- assert.throws(() => hammingDistanceBits(1.5, 1), TypeError)

Notes for implementer

- Use XOR (a ^ b) and an efficient bit-popcount (loop with x &= x - 1) to count set bits.
- Validate with Number.isInteger and Number.isSafeInteger; throw meaningful errors to help tests assert on error types.