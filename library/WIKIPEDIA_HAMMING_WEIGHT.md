WIKIPEDIA_HAMMING_WEIGHT

Table of Contents
- Definition (Hamming weight / population count)
- Relation to Hamming distance
- Algorithms and bit-counting methods
- Considerations for JavaScript numeric types
- Complexity
- Reference API patterns

Definition
Hamming weight (population count) of a binary word is the number of symbols that are 1. It is the 1-bit count of a value and is the core operation used to compute bitwise Hamming distance via x XOR y.

Relation to Hamming distance
HammingDistance(a,b) for integers reduces to popcount(a XOR b).

Algorithms and bit-counting methods
- Naive per-bit loop: shift and mask each bit and accumulate count; O(w) time where w = word width.
- Kernighan's algorithm: while (x != 0) { x &= x - 1; count++; } — O(k) iterations where k = number of set bits.
- SWAR / parallel bit-count: use simultaneous masks and shifts to sum groups of bits in parallel. For 32-bit values the sequence is:
  - x = x - ((x >> 1) & 0x55555555)
  - x = (x & 0x33333333) + ((x >> 2) & 0x33333333)
  - x = (x + (x >> 4)) & 0x0F0F0F0F
  - x = x + (x >> 8)
  - x = x + (x >> 16)
  - result = x & 0x0000003F
- Hardware intrinsics: on platforms/languages that expose POPCNT use that for O(1) popcount.

Considerations for JavaScript numeric types
- Bitwise operators in JS operate on signed 32-bit integers (values are ToInt32(value)). For correct popcount on >32-bit values use BigInt and BigInt arithmetic.
- For Numbers up to 2^53-1, convert to BigInt for exact bitwise math when necessary.

Complexity
- Kernighan: O(k) where k is set bits.
- SWAR: O(1) with fixed small constant for 32-bit values.

Reference API patterns
- popcount32(x: number): number — expects 32-bit unsigned integer in JS number range; returns count 0..32.
- popcountBigInt(x: BigInt): number — uses repeated clearing or shifting with BigInt operations; returns integer count.

Digest (retrieval)
- Source: https://en.wikipedia.org/wiki/Hamming_weight
- Retrieved: 2026-03-19
- Data obtained during crawl: 161.0 KB (HTML)

Attribution
Content derived from Wikipedia — Hamming weight (CC BY-SA). Data retrieved on 2026-03-19; HTML size as indicated above.
