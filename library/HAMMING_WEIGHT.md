TITLE: HAMMING_WEIGHT

TABLE OF CONTENTS
1. Definition
2. Primary algorithms
  2.1 Kernighan's algorithm
  2.2 Table lookup (byte-wise)
  2.3 SWAR (SIMD Within A Register) / parallel bit count
  2.4 Hardware popcount (POPCNT)
3. Complexity and performance guidance
4. Implementation details and edge cases
5. Reference details (function signatures)
6. Detailed digest (source: https://en.wikipedia.org/wiki/Hamming_weight) — retrieved 2026-03-14
7. Attribution and data size

NORMALISED EXTRACT
1. Definition
Hamming weight of a binary word is the number of symbols that are '1' — equivalently, the population count or popcount.

2. Primary algorithms
2.1 Kernighan's algorithm
- Loop: count = 0; while (x !== 0) { x &= (x - 1); count++; } Returns count. Complexity proportional to number of set bits.

2.2 Table lookup (byte-wise)
- Precompute table[0..255] of popcounts for each byte. For a large integer or buffer, iterate every byte and sum table[byte]. Very fast for byte-addressable platforms.

2.3 SWAR parallel bit count (32-bit example)
- Sequence of bitwise ops to aggregate partial counts into bytes then words. Example 32-bit sequence:
  x = x - ((x >> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
  x = (x + (x >> 4)) & 0x0F0F0F0F;
  x = x + (x >> 8);
  x = x + (x >> 16);
  return x & 0x0000003F;
- Efficient for CPUs without popcount instruction.

2.4 Hardware popcount (POPCNT)
- Use CPU POPCNT or compiler intrinsic for best performance when available (e.g., __builtin_popcount, __builtin_popcountll in GCC/Clang).

3. Complexity and performance guidance
- Time: O(k) where k is number of machine words processed (or number of set bits for Kernighan). Table lookup and SWAR are O(n/byte) or O(1) per machine word.
- Choose table lookup for byte-oriented workloads; choose hardware popcount when available; choose Kernighan when inputs have very few set bits.

IMPLEMENTATION NOTES
- For large buffers, prefer blocking in cache-friendly sizes and summing partial results into a 64-bit accumulator to avoid overflow.
- For vectorized implementations, use SIMD instructions (e.g., AVX2 / NEON) to process many bytes in parallel.

REFERENCE DETAILS
- popcount32(x: number) -> integer
- popcount64(x: BigInt or 64-bit integer) -> integer
- For buffers: popcountBuffer(buf: Uint8Array) -> integer

DETAILED DIGEST
Source: https://en.wikipedia.org/wiki/Hamming_weight — retrieved 2026-03-14
Data obtained: definition, algorithms (Kernighan, table lookup, SWAR), references to hardware popcount.

ATTRIBUTION
Source: https://en.wikipedia.org/wiki/Hamming_weight — retrieved 2026-03-14. Data size retrieved: ~160 KB (HTML). License: CC BY-SA (Wikipedia).