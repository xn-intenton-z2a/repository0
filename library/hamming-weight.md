Title: Hamming Weight (Popcount)

Summary

The Hamming weight (also called popcount or population count) is the number of symbols in a string that are different from the zero symbol; in the binary case it is the number of 1 bits in a word.

Key points

- Hamming weight(x) equals Hamming distance(x, 0).
- Common names: popcount, bitcount, sideways sum.
- Widely used in cryptography, bitboard chess engines, distributed systems, and algorithmics.

Efficient implementations

- Wegner's method: repeatedly clear the least-significant 1-bit (x &= x-1) and count iterations — good when few bits set.
- Parallel (SWAR) methods: use masks (m1, m2, m4, m8, ...) to add bit counts in wider slices, culminating in a reduced sum; see mask-based popcount implementations.
- Lookup tables: precompute counts for 8/16-bit chunks and sum table lookups.
- Hardware: use POPCNT instruction or compiler intrinsics (__builtin_popcount, std::popcount in C++20, Integer.bitCount in Java, int.bit_count() in Python 3.8+/3.10+).

Example (64-bit SWAR-style outline):

const uint64_t m1 = 0x5555555555555555; // 0101...
const uint64_t m2 = 0x3333333333333333; // 00110011...
const uint64_t m4 = 0x0f0f0f0f0f0f0f0f; // 4-bit groups
// then: x = (x & m1) + ((x >> 1) & m1); ... combine progressively and multiply-add to collect result

Notes

- Choose algorithm based on data distribution (few bits set vs dense) and hardware availability.

Source: Wikipedia: Hamming weight; discussion of algorithms and platform support.