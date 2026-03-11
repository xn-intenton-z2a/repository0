HAMMING_WEIGHT

TABLE OF CONTENTS
1. Normalised Extract
  1.1 Definition
  1.2 Binary/popcount relationship
  1.3 Efficient popcount algorithms and masks
2. Supplementary Details
  2.1 Complexity and micro-optimisations
  2.2 Platform support and intrinsics
3. Reference Details (API specs, signatures, constants)
4. Detailed Digest and Provenance
5. Attribution and Crawl Data

1. NORMALISED EXTRACT

1.1 Definition
The Hamming weight of a symbol sequence equals the count of symbols differing from the zero-symbol; for binary words it equals the number of 1 bits (population count, popcount). For integer x, HammingWeight(x) = popcount(x).

1.2 Binary/popcount relationship
To compute Hamming distance between binary words A and B: compute V = A XOR B, then HammingDistance = popcount(V). For arbitrary-precision integers use BigInt in JS; for bounded-width values use fixed-width types (uint32, uint64) and apply popcount over that width.

1.3 Efficient popcount algorithms and masks
Mask constants (64-bit values) used by parallel-add algorithms:
- m1  = 0x5555555555555555
- m2  = 0x3333333333333333
- m4  = 0x0f0f0f0f0f0f0f0f
- m8  = 0x00ff00ff00ff00ff
- m16 = 0x0000ffff0000ffff
- m32 = 0x00000000ffffffff
- h01 = 0x0101010101010101

Parallel-add (tree) method (semantic steps):
1. x = (x & m1) + ((x >> 1) & m1)
2. x = (x & m2) + ((x >> 2) & m2)
3. x = (x & m4) + ((x >> 4) & m4)
4. x = (x & m8) + ((x >> 8) & m8)
5. x = (x & m16) + ((x >> 16) & m16)
6. x = (x & m32) + ((x >> 32) & m32)
Return x (contains total count in lower bits as specified by variant).

Multiply-accumulate trick: after reducing counts to bytes, compute (x * h01) >> 56 to extract total popcount.

Wegner loop: while (x) { count++; x &= x - 1; } — O(popcount) iterations; best when few bits set.

Lookup-table: precompute popcount for 16-bit words (size 65536) then compute for 32/64-bit values by table lookups and adds.

Hardware/intrinsic: use processor POPCNT instruction or compiler builtin (__builtin_popcount / __builtin_popcountll) when available, best perf.

2. SUPPLEMENTARY DETAILS

2.1 Complexity and micro-optimisations
- Parallel-add algorithms: O(1) machine-word operations proportional to word size (small constant). Best worst-case time for software-only approaches.
- Wegner loop: O(k) where k is number of set bits; optimal when expected k is small.
- Lookup-table: O(1) with memory trade-off; use for high-throughput pipelines where table fits cache.
- Use vectorised/SIMD (Harley–Seal, Muła techniques) for batched popcount on wide registers.
- For JavaScript: prefer BigInt for >32-bit integers; emulate popcount using BigInt bit ops and Wegner or split into 32-bit chunks for table/parallel methods.

2.2 Platform support and intrinsics
- C/C++: __builtin_popcount, __builtin_popcountll (GCC/Clang). C++20: std::popcount in <bit>.
- x86/x64: POPCNT instruction (SSE4.2 variant availability differs by CPU); use compiler intrinsics when available.
- ARM NEON: VCNT for vector popcount.
- Java: Integer.bitCount(int), Long.bitCount(long), BigInteger.bitCount().
- Python: int.bit_count().

3. REFERENCE DETAILS (API specs, signatures, constants)

Popcount function signatures (canonical):
- C: int popcount32(uint32_t x) -> returns number of 1 bits (0..32)
- C: int popcount64(uint64_t x) -> returns number of 1 bits (0..64)
- C++: unsigned int std::popcount(unsigned int x) (C++20)
- JS (BigInt-safe): function popcountBigInt(x: bigint): number — returns non-negative integer count; throws TypeError for non-integer or negative inputs.

Exact constant values (hex):
- m1  = 0x5555555555555555
- m2  = 0x3333333333333333
- m4  = 0x0f0f0f0f0f0f0f0f
- m8  = 0x00ff00ff00ff00ff
- m16 = 0x0000ffff0000ffff
- m32 = 0x00000000ffffffff
- h01 = 0x0101010101010101

Error handling patterns:
- Validate numeric type/range before bit operations. For JS, coerce to BigInt or throw.
- Document whether negative numbers are allowed (usually not for bit-popcount semantics); reject negative inputs with RangeError.

4. DETAILED DIGEST AND PROVENANCE
Source: https://en.wikipedia.org/wiki/Hamming_weight
Retrieved: 2026-03-11T20:55:48.165Z
Extracted sections: definition, efficient implementations, algorithmic examples, mask constants, Wegner loop, lookup-table approach, hardware instruction references.

5. ATTRIBUTION AND CRAWL DATA
Source: Wikipedia — Hamming weight (popcount) page; last retrieved 2026-03-11. Crawl returned ~17KB (content truncated note present); exact byte count not provided by fetch API.
