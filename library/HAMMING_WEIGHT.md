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
- Hamming weight (popcount) equals the number of symbols different from the zero-symbol. For binary words it's the count of 1 bits.

1.2 Binary/popcount relationship
- For integers: HammingWeight(x) = popcount(x). For Hamming distance: HammingDistance(A,B) = popcount(A XOR B).

1.3 Efficient popcount algorithms and masks
- Mask constants (64-bit): m1=0x5555555555555555; m2=0x3333333333333333; m4=0x0f0f0f0f0f0f0f0f; m8=0x00ff00ff00ff00ff; m16=0x0000ffff0000ffff; m32=0x00000000ffffffff; h01=0x0101010101010101.
- Algorithms described:
  - Parallel-add/tree folding (popcount64a, popcount64b, popcount64c) with exact sequence of masked shifts and adds.
  - Multiply-accumulate trick: after reducing to byte counts, return (x * h01) >> 56.
  - Wegner loop (popcount64d): while (x) { count++; x &= x - 1; }.
  - Lookup table (wordbits[65536]) for 16-bit precomputation and summation for 32/64-bit values.

2. SUPPLEMENTARY DETAILS

2.1 Complexity and micro-optimisations
- Parallel-add: O(1) in word operations relative to word size; best worst-case.
- Wegner: O(k) where k is number of set bits; efficient when expected set bits are few.
- Lookup-table: constant-time table lookups with memory trade-off; initialize table with popcount of all 16-bit values.
- Vectorized / SIMD methods (Muła / Harley–Seal) for batched popcount outperform scalar methods on wide registers.

2.2 Platform support and intrinsics
- C/C++: __builtin_popcount / __builtin_popcountll; C++20 std::popcount in <bit>.
- x86/x64: POPCNT instruction; ARM NEON: VCNT.
- Java: Integer.bitCount, Long.bitCount, BigInteger.bitCount.
- Python: int.bit_count().

3. REFERENCE DETAILS

Popcount function signatures
- C: int popcount32(uint32_t x) -> 0..32
- C: int popcount64(uint64_t x) -> 0..64
- JS: function popcountBigInt(x: bigint): number  // returns non-negative integer; throw TypeError for non-integer/negative inputs.

Constants (hex)
- m1  = 0x5555555555555555
- m2  = 0x3333333333333333
- m4  = 0x0f0f0f0f0f0f0f0f
- m8  = 0x00ff00ff00ff00ff
- m16 = 0x0000ffff0000ffff
- m32 = 0x00000000ffffffff
- h01 = 0x0101010101010101

Error handling
- Validate inputs before bit operations; for JS coerce to BigInt or throw; reject negative values when semantics expect unsigned.

4. DETAILED DIGEST AND PROVENANCE
Source: Wikipedia — Hamming weight
URL: https://en.wikipedia.org/wiki/Hamming_weight
Retrieved: 2026-03-11T21:26:25.652Z
Extracted: popcount algorithms (parallel-add variants), Wegner loop, lookup-table approach, mask constants, hardware support, and language intrinsics.

5. ATTRIBUTION AND CRAWL DATA
Source: Wikipedia. Crawl returned full page content. Approximate retrieved content: ~20 KB.