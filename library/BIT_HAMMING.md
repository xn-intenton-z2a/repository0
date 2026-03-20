BIT_HAMMING

Table of contents
1. Overview
2. Input validation
3. Integer representation and BigInt support
4. Popcount (Hamming weight) algorithms
5. Bitwise Hamming distance algorithm
6. Complexity and limits
7. Supplementary details
8. Reference details (API signatures and patterns)
9. Digest (sources and retrieval date)
10. Attribution and data size

1. Overview
Compute Hamming distance between two non-negative integers by counting the number of differing bits in their binary representations (XOR and popcount). For integers a and b, distance = popcount(a XOR b).

2. Input validation
- Both inputs must be integers (Number or BigInt). If not, throw TypeError.
- Negative integers are invalid; throw RangeError for negative values.
- If using Number ensure inputs are safe integers (Number.isSafeInteger) or prefer BigInt for large values.

3. Integer representation and BigInt support
- Use BigInt when inputs may exceed Number.MAX_SAFE_INTEGER or for bitwise operations on large bit widths.
- For Number inputs within safe range, convert to BigInt for uniform XOR/popcount implementation: BigInt(a) ^ BigInt(b).
- Avoid using Number bitwise operators (|,&,^,~) on values beyond 32-bit; JavaScript Number bitwise ops coerce to 32-bit signed ints.

4. Popcount (Hamming weight) algorithms
- Kernighan's algorithm (loop clearing lowest set bit):
  count = 0
  while (x !== 0n) { x = x & (x - 1n); count++; }
  Works with BigInt and is O(k) where k is number of set bits.
- Lookup table for 8-bit chunks: precompute 256-entry table and sum over bytes; useful for performance when BigInt can be split into bytes.
- Builtins: No native popcount in JS; implement in JS with BigInt-aware operations.

5. Bitwise Hamming distance algorithm
- Steps:
  a. Validate inputs as non-negative integers.
  b. Convert to BigInt: A = BigInt(a); B = BigInt(b).
  c. Compute diff = A ^ B (BigInt XOR).
  d. Compute count = popcount(diff) using Kernighan or byte table.
  e. Return Number(count) if within Number range or return BigInt(count) if caller expects BigInt; specification: return Number.
- Example: 1 (1) XOR 4 (100) = 101 => popcount = 2.

6. Complexity and limits
- Time: O(k) with Kernighan's algorithm where k is number of differing bits; worst-case O(w) where w is bit-width of inputs.
- Space: O(1) for Kernighan; O(n) for lookup table approach where n is table size (constant 256).
- Performance: For dense bit differences, Kernighan performs proportional to set bits; lookup table can be faster for large dense numbers when splitting into bytes.

7. Supplementary details
- Return type: choose Number for distances that fit within Number range; if inputs are extremely large consider returning BigInt to avoid precision loss.
- Implementation note: when converting Number to BigInt, use BigInt(Math.trunc(n)) after validating Number.isSafeInteger(n).
- Edge cases: distance between equal numbers is 0; between 0 and 0 returns 0.

8. Reference details (API signatures and patterns)
- function hammingBits(a: number|BigInt, b: number|BigInt): number
  - Throws TypeError if inputs are not integer-like.
  - Throws RangeError if inputs are negative.
  - Converts inputs to BigInt and computes diff = A ^ B; then computes popcount via Kernighan and returns Number(count).
- Kernighan popcount pseudocode (BigInt):
  let x = diff;
  let count = 0;
  while (x > 0n) {
    x = x & (x - 1n);
    count++;
  }
  return count;

9. Digest (sources and retrieval date)
- Wikipedia: Hamming weight, population count algorithms and Kernighan algorithm. Retrieved 2026-03-20.
- MDN BigInt and bitwise operation notes (32-bit coercion warning). Retrieved 2026-03-20.
- Wikipedia Bitwise operation reference for XOR semantics. Retrieved 2026-03-20.

10. Attribution and data size
- Sources used: Wikipedia (Hamming weight, population count), MDN BigInt, MDN Bitwise operations, npm hamming-distance.
- Total crawled content size approximate: 7.2 KB combined (HTML/text snippets extracted).