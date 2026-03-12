Title: Hamming Weight (Popcount)

Summary

The Hamming weight (also called popcount or population count) is the number of symbols in a string that are different from the zero symbol; for binary words it is the number of 1 bits in the word.

Key points

- Hamming weight(x) equals Hamming distance(x, 0).
- Common names: popcount, bitcount, sideways sum.
- Use cases: cryptography, bitboards, data structures, error‑correcting codes.

Efficient implementations

- Wegner's method: repeatedly clear the least‑significant 1 bit (x &= x-1) and count iterations — good when few bits are set.
- Parallel (SWAR) methods: use masks (m1, m2, m4, ...) to add bit counts in widening groups; suitable for CPUs without POPCNT.
- Lookup tables: precompute counts for 8/16-bit chunks and sum table lookups.
- Hardware/intrinsics: use POPCNT instruction or compiler builtin (e.g., __builtin_popcount, std::popcount, Integer.bitCount, int.bit_count()).

Example (64-bit SWAR outline):

const uint64_t m1 = 0x5555555555555555; // 0101...
const uint64_t m2 = 0x3333333333333333; // 00110011...
const uint64_t m4 = 0x0f0f0f0f0f0f0f0f; // 4-bit groups
// then: x = (x & m1) + ((x >> 1) & m1); ... combine progressively and collect result

Notes

- Choose algorithm based on data distribution (sparse vs dense) and hardware availability.

Source: https://en.wikipedia.org/wiki/Hamming_weight
