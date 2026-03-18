WIKIPEDIA_HAMMING_WEIGHT

Source: https://en.wikipedia.org/wiki/Hamming_weight
Retrieved: 2026-03-18
Bytes fetched (approx): 161.0 KB

Table of contents:
1. Definition
2. popcount meaning
3. Algorithms to compute popcount
4. Complexity and language support
5. JavaScript-specific notes and patterns
6. Reference API signatures
7. Detailed digest and attribution

1. Definition
Hamming weight (popcount) of a binary string or non-negative integer is the number of '1' bits in its binary representation.

2. popcount meaning
popcount(x) = number of ones in binary expansion of x. For two integers a and b, Hamming distance is popcount(a XOR b).

3. Algorithms to compute popcount
- Naive bit-scan: iterate bits via shifting and mask (x & 1) then shift right. Complexity O(w), w = word width.
- Kernighan's algorithm: while x != 0, x &= x - 1, count++ ; complexity O(k) where k = number of set bits.
- Table lookup: split word into bytes and sum precomputed table entries; useful for fixed-width words.
- CPU builtins: many languages expose hardware/popcount intrinsics (e.g., __builtin_popcount in C/C++), which are O(1) per word.

4. Complexity and language support
- Time: proportional to number of bits examined or number of set bits (Kernighan).
- Space: O(1) extra for integer algorithms; table-lookup uses O(1) table of size 256 for byte-wise method.

5. JavaScript-specific notes and patterns
- Bitwise operators operate on 32-bit signed integers; to treat numbers as 32-bit unsigned, use >>> 0.
- For 32-bit values: use x >>> 0 then Kernighan or table lookup for popcount.
- For integers beyond 32 bits, use BigInt and BigInt bitwise ops, iterating with x &= x - 1n or shift with x >>= 1n.

Example patterns (plain text pseudocode):
 function popcount32(x: number): number
   x = x >>> 0
   let c = 0
   while x != 0
     x = x & (x - 1)
     c++
   return c

 function popcountBigInt(x: BigInt): number
   let c = 0
   while x != 0n
     if (x & 1n) c++
     x >>= 1n
   return c

6. Reference API signatures
 export function popcount32(x: number): number
 export function popcountBigInt(x: BigInt): number

7. Detailed digest
- Hamming weight is the core building block for integer Hamming distance via XOR+popcount.
- Kernighan's algorithm is succinct and efficient when the number of set bits is small relative to word width.

Attribution
Content condensed from Wikipedia "Hamming weight" (https://en.wikipedia.org/wiki/Hamming_weight), retrieved 2026-03-18. Data fetched ~161.0 KB (HTML).