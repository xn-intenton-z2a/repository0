BIT_TWIDDLING_POPCOUNT

Table of Contents
- Purpose and applicability
- Kernighan's algorithm (exact steps)
- SWAR / parallel bit-count sequence for 32-bit integers (detailed masks)
- BigInt considerations and large-width support
- Performance trade-offs and selection guidance
- Troubleshooting and pitfalls

Purpose and applicability
- Popcount (population count) computes the number of set bits in a word. It is used to compute Hamming weight and to derive Hamming distance from XOR results.

Kernighan's algorithm
- Input: integer x (non-negative)
- Loop: while x != 0 do {
    x = x & (x - 1)
    increment count
  }
- Result: count is the number of set bits. Complexity: O(k) where k is set bits.
- Works with BigInt in JS when expressed with BigInt arithmetic; for Numbers limited to 53-bit safe values convert to BigInt when strict correctness beyond 32-bit is required.

SWAR / parallel bit-count for 32-bit values (mask sequence)
- Applicable range: unsigned 32-bit values represented in JS using ToUint32 or logical >>> 0.
- Sequence (apply in-place to a 32-bit variable x):
  1) x = x - ((x >>> 1) & 0x55555555)
  2) x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)
  3) x = (x + (x >>> 4)) & 0x0F0F0F0F
  4) x = x + (x >>> 8)
  5) x = x + (x >>> 16)
  6) result = x & 0x0000003F
- This yields the popcount in constant time with a fixed small number of operations.

BigInt and large-width support
- For integers >32 bits use BigInt and either Kernighan's method or chunking into 32-bit slices and summing counts.
- Avoid using JS Number bitwise operators for values >32 bits because they truncate to 32 bits.

Performance trade-offs
- Kernighan is excellent for sparse bitsets.
- SWAR is fastest for dense 32-bit workloads and has predictable latency.
- For hot paths consider native extensions/intrinsics if available.

Troubleshooting and pitfalls
- Mistakenly using Number bitwise ops on values > 32 bits will produce incorrect results due to ToInt32 conversion.
- Forgetting to handle negative inputs or non-integer types will produce wrong counts or exceptions; validate and convert types explicitly.

Digest (retrieval)
- Source: https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel
- Retrieved: 2026-03-19
- Data obtained during crawl: 98.7 KB (HTML)

Attribution
Content derived from "Bit Twiddling Hacks" by Sean Eron Anderson (public domain code snippets; aggregate collection copyright as noted). Data retrieved on 2026-03-19.
