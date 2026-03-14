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
6. Detailed digest (source: Wikipedia — Hamming weight) — retrieved 2026-03-14
7. Attribution and data size

NORMALISED EXTRACT
1. Definition
Hamming weight (population count, popcount) of a binary word is the number of 1 bits in the word.

2. Primary algorithms
2.1 Kernighan's algorithm
- count = 0; while (x !== 0) { x &= (x - 1); count++; } Returns count. Efficient when the word contains few set bits.

2.2 Table lookup (byte-wise)
- Precompute table[0..255] of popcounts for bytes; for a large buffer, sum table[byte] for each byte. Fast on byte-addressable platforms.

2.3 SWAR parallel bit count (32-bit example)
- Sequence:
  x = x - ((x >> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
  x = (x + (x >> 4)) & 0x0F0F0F0F;
  x = x + (x >> 8);
  x = x + (x >> 16);
  return x & 0x0000003F;
- Efficient fallback when hardware POPCNT is not available.

2.4 Hardware popcount (POPCNT)
- Use CPU instruction or compiler intrinsic (e.g., __builtin_popcount) for best throughput when available.

3. Complexity and performance guidance
- Table lookup and SWAR operate in O(n/word) with good constant factors. Kernighan is O(popcount) which is beneficial for sparse data.
- For buffers, process in cache-friendly blocks and accumulate into a 64-bit accumulator to avoid overflow.

IMPLEMENTATION NOTES
- For very large buffers consider SIMD vectorized implementations (AVX2/NEON) to process multiple bytes in parallel.
- Be mindful of integer width when porting algorithms; adapt constants and shifts to 32/64-bit variants.

REFERENCE DETAILS
- popcount32(x: number) -> integer
- popcount64(x: BigInt or 64-bit integer) -> integer
- popcountBuffer(buf: Uint8Array) -> integer

DETAILED DIGEST
Source: https://en.wikipedia.org/wiki/Hamming_weight — retrieved 2026-03-14
Data obtained: definition, Kernighan/table/SWAR algorithms, and recommendations for hardware vs software implementations.

ATTRIBUTION
Source: Wikipedia — Hamming weight (CC BY-SA). Retrieved 2026-03-14. Data size retrieved: ~160 KB (HTML).