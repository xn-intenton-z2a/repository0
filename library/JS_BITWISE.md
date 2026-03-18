TABLE OF CONTENTS

- Bitwise operator semantics in JavaScript
- Number vs BigInt bitwise behavior
- Using XOR and popcount to compute Hamming distance
- Integer validation and error rules
- Implementation pseudocode (BigInt-safe)
- Performance considerations
- References and crawl digest


BITWISE OPERATOR SEMANTICS (NUMBERS)

- For Number operands, JavaScript bitwise operators coerce values to signed 32-bit integers (ToInt32) before performing the operation and return a 32-bit signed integer (as a Number).
- Consequence: using ^ with large integers will truncate to 32 bits; for correctness on values that exceed 32-bit range, use BigInt.

BIGINT BITWISE BEHAVIOUR

- BigInt supports bitwise operators with BigInt operands only. Example: 1n ^ 4n = 5n
- BigInt bitwise operators operate on infinite-precision two's complement semantics for negative BigInts; for non-negative inputs this behaves as expected.
- Mix of Number and BigInt operands is not allowed for bitwise operators; operands must have the same numeric category.

USING XOR + POPCOUNT

- Hamming distance between integers a and b: popcount(BigInt(a) ^ BigInt(b))
- Use Kernighan-style popcount loop with BigInt to avoid 32-bit truncation and to support arbitrarily large integers.

IMPLEMENTATION (PSEUDOCODE)

computeIntegerHamming(a, b):
- if typeof a !== 'number' && typeof a !== 'bigint' throw TypeError
- if typeof a === 'number' and not Number.isInteger(a) throw TypeError
- X = BigInt(a)
- Y = BigInt(b)
- if X < 0n || Y < 0n throw RangeError
- V = X ^ Y
- count = 0
- while V != 0n:
    V = V & (V - 1n)
    count += 1
- return count

PERFORMANCE CONSIDERATIONS

- For values known to fit in 32 bits, converting to Number and using native ^ and a fast integer popcount (via lookup or JS micro-optimisations) may be faster, but be mindful of signed 32-bit semantics and negative values.
- For safety and correctness across the full non-negative-integer domain, prefer BigInt-based approach.

REFERENCES AND CRAWL DIGEST

Source used (retrieved 2026-03-18):
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators  (retrieved 2026-03-18; bytes downloaded: 244981)

Attribution: MDN bitwise operators page for coercion rules and BigInt operator semantics.
