# INTEGER_HAMMING

Purpose
This feature specifies the integer bit-level Hamming distance API, supporting arbitrary-size non-negative integers.

Specification
Provide a named export called computeIntegerHamming that accepts two integers (Number or BigInt) and returns the number of differing bits as a Number.

Behavior
- Accept Number or BigInt values. If a value is a Number and not an integer, throw TypeError.
- Coerce inputs to BigInt for computation.
- If either integer is negative, throw RangeError.
- Compute XOR of the two BigInts and count set bits using a Kernighan-style loop over BigInt.
- Return the count as a Number.

Acceptance criteria
- computeIntegerHamming applied to 1 and 4 returns 2.
- computeIntegerHamming applied to 0 and 0 returns 0.
- Negative integers cause RangeError.
- Non-integer Number inputs cause TypeError.

Test cases
- 1 vs 4 -> 2
- 0 vs 0 -> 0
- large BigInt values -> correct popcount
- fractional numbers -> TypeError

Implementation notes
- Use BigInt XOR and a BigInt Kernighan loop: while v is nonzero then v = v & (v - 1) and increment count.
- Consider fast paths for 32-bit Number inputs but ensure correctness by using BigInt as the canonical path.
