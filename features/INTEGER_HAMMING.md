# INTEGER_HAMMING

Summary
Compute the Hamming distance between two non-negative integers by counting differing bits. This supports both Number and BigInt inputs to cover large integers.

Specification
- Public API: named export hammingBits(a, b)
- Inputs: a and b must be integer values: either Number with no fractional part or BigInt. If inputs are not integers, throw TypeError. If either input is negative, throw RangeError.
- Implementation guidance: convert Number inputs to BigInt when needed and perform XOR then count set bits (Hamming weight) on the result. Use an efficient bit-counting algorithm to support large integers.
- Result: return the number of differing bits as a non-negative integer.

Acceptance criteria
- hammingBits(1, 4) is 2
- hammingBits(0, 0) is 0
- hammingBits(0n, 1n) is 1
- Negative integer inputs throw RangeError
- Non-integer number inputs (for example 1.5) throw TypeError
- Very large integers are supported; for example hammingBits(1n << 100n, 0n) is 1

Notes
Prefer BigInt-based XOR and bit counting to avoid precision issues for values outside the safe integer range for Number.