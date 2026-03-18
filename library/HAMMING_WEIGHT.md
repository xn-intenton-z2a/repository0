TABLE OF CONTENTS

- Definition
- Popcount / Hamming weight
- Common algorithms (Kernighan, table-lookup, SWAR/word-parallel)
- Hardware support and intrinsics
- BigInt considerations for JavaScript
- Implementation pseudocode (BigInt-safe)
- Complexity & performance
- References and crawl digest


DEFINITION

Hamming weight (also called population count or popcount) is the number of symbols equal to 1 in the binary representation of a non-negative integer.


POPCOUNT / HAMMING WEIGHT

- For integer v, popcount(v) = number of set bits in v.
- Relationship to Hamming distance: Hamming distance between integers a and b equals popcount(a XOR b).


COMMON ALGORITHMS

1) Brian Kernighan's algorithm (bit-removal loop):
- while v != 0:
    v = v & (v - 1)
    count += 1
- This performs one iteration per set bit and is efficient when the number of set bits is small.

2) Table-lookup (8-bit or 16-bit blocks):
- Precompute popcount for all 256 possible byte values in a table T[0..255].
- Sum T[(v >> 0) & 0xff] + T[(v >> 8) & 0xff] + ...
- Useful for fixed-size machine words and vectorized implementations.

3) Word-parallel (SWAR) technique (32/64-bit):
- Sequence of arithmetic/bitwise operations to pairwise sum bits into bytes then words; final multiplication and shift yields total count.
- Example (32-bit): v = v - ((v >> 1) & 0x55555555); v = (v & 0x33333333) + ((v >> 2) & 0x33333333); v = ((v + (v >> 4)) & 0x0F0F0F0F); count = (v * 0x01010101) >> 24
- Avoid in JS Number domain for values >32 bits; use BigInt loops instead.

HARDWARE SUPPORT

- Modern CPUs offer POPCNT instruction that returns popcount for a machine word in hardware; use compiler intrinsics where available for C/assembly implementations.
- JavaScript engines do not expose a direct popcount primitive; use algorithmic approaches.

BIGINT CONSIDERATIONS (JavaScript)

- Use BigInt to avoid 32-bit truncation. For BigInt v, Kernighan-style loop with v &= v - 1n works correctly.
- Example pseudocode:
    count = 0
    while v != 0n:
        v = v & (v - 1n)
        count += 1
    return count

COMPLEXITY & PERFORMANCE

- Kernighan: O(popcount) average; worst-case O(B) where B is bit-width.
- Table-lookup: O(B/word_size) with low constant; requires precomputed table memory.
- SWAR: O(1) with respect to bit-count but relies on fixed-width arithmetic; in JS limited to 32-bit Number semantics.

REFERENCES AND CRAWL DIGEST

Source used (retrieved 2026-03-18):
- https://en.wikipedia.org/wiki/Hamming_weight  (retrieved 2026-03-18; bytes downloaded: 164722)

Attribution: algorithm descriptions and trade-offs adapted from the Hamming weight (popcount) reference.
