MDN_BITWISE_OPERATORS

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
Retrieved: 2026-03-18
Bytes fetched (approx): 239.2 KB

Table of contents:
1. Overview of bitwise operators
2. XOR operator and semantics
3. 32-bit coercion and signed vs unsigned behaviour
4. Using XOR+popcount to compute bit-level Hamming distance
5. BigInt notes for >32-bit integers
6. Example implementation patterns
7. Reference API signatures
8. Detailed digest and attribution

1. Overview of bitwise operators
- Operators: &, |, ^, ~, <<, >>, >>> operate at bit-level.
- In JavaScript these operate on 32-bit integers: operands coerced to signed 32-bit integers before the operation.

2. XOR operator and semantics
- The bitwise XOR a ^ b sets each bit to 1 where the corresponding bits of a and b differ.
- Use XOR to produce a mask of differing bits; counting set bits in that mask yields the Hamming distance.

3. 32-bit coercion and signed vs unsigned behaviour
- JavaScript bitwise results are signed 32-bit values; to treat inputs/outputs as unsigned use >>> 0.
- Example: (a >>> 0) ensures a is treated as unsigned 32-bit.
- For left/right shifts, >> preserves sign, >>> is zero-fill right shift.

4. Using XOR+popcount to compute bit-level Hamming distance
- Compute mask = (a >>> 0) ^ (b >>> 0)
- Count 1 bits in mask using popcount (see Kernighan algorithm or table methods).
- This yields the number of bit positions that differ between a and b within 32-bit range.

5. BigInt notes for >32-bit integers
- BigInt supports bitwise operations (e.g., ^) for BigInt operands only.
- For large integers use BigInt: let mask = BigInt(a) ^ BigInt(b); then iterate: while (mask) { count += Number(mask & 1n); mask >>= 1n }
- Do not mix BigInt and Number in bitwise ops.

6. Example implementation patterns (plain text pseudocode)
 function hammingDistanceBits(a: number, b: number): number
   if not Number.isInteger(a) or a < 0 -> throw TypeError/RangeError
   let mask = (a >>> 0) ^ (b >>> 0)
   return popcount32(mask)

7. Reference API signatures
 export function hammingDistanceBits(a: number, b: number): number
 export function hammingDistanceBitsBigInt(a: BigInt, b: BigInt): number

8. Detailed digest
- MDN documents JS bitwise semantics, coercion to 32-bit ints, and recommends using >>> 0 for unsigned behaviour; XOR+popcount is the canonical integer Hamming-distance pattern.

Attribution
Content condensed from MDN "Bitwise operators" (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators), retrieved 2026-03-18. Data fetched ~239.2 KB (HTML).