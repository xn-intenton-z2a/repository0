NORMALISED EXTRACT

Popcount (Hamming weight) and bitwise operators in JavaScript
- Hamming distance for integers computed as popcount(x ^ y).
- JavaScript Number is IEEE-754 double; bitwise operators operate on 32-bit signed integers (Number coerced to 32-bit int via ToInt32).
- For integers beyond 32 bits, use BigInt and BigInt bitwise operations where supported.

TABLE OF CONTENTS
1. XOR and bitwise basis
2. Popcount algorithms
3. JS numeric types and implications
4. Example implementation patterns

DETAILED CONTENT
1. XOR and bitwise basis
- XOR (^) produces bits set where operands differ.
- For two non-negative integers a,b: x = a ^ b; popcount(x) is the Hamming distance.

2. Popcount algorithms
- Kernighan's algorithm (works for BigInt and Number): count = 0; while (x) { x &= x - 1; count++; }
- Parallel bit-count tricks (32-bit): use masks and multiplication-based fast popcount sequences for high performance.
- For BigInt, use looped Kernighan or convert to binary string and count '1's (less efficient).

3. JS numeric types and implications
- Use a>>>0 to coerce to unsigned 32-bit when using Number.
- For values exceeding 32 bits, represent as BigInt and use BigInt operators: (a ^ b) is not allowed between BigInt and Number; both operands must be BigInt.

4. Example implementation patterns
- intHammingNumber(a,b): if not integers or negative -> TypeError/RangeError; x = (a>>>0) ^ (b>>>0); return popcount32(x).
- intHammingBigInt(a,b): coerce to BigInt, x = a ^ b; use Kernighan loop: while (x > 0n) { x &= x - 1n; count++; }

SUPPLEMENTARY DETAILS

Performance
- For many small integers (<=32-bit), Number-based bitwise ops are fastest.
- For very large integers, BigInt with Kernighan is linear in number of set bits.

REFERENCE DETAILS

Bitwise operator behaviours (MDN)
- ^ XOR: a ^ b -> 32-bit result per ToInt32 coercion
- >>> zero-fill right shift: use for unsigned conversion

DIGEST

Sources: MDN Bitwise Operators, Wikipedia Hamming weight
Retrieved: 2026-03-19
Size fetched: ~5 KB

ATTRIBUTION
MDN Web Docs and Wikipedia pages listed in SOURCES.md
