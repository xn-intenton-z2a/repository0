NORMALISED EXTRACT
Definition
Hamming weight (population count) of an integer is the number of 1 bits in its binary representation. Denote weight(x) = count of set-bits. For fixed-width words, weight(x) in range 0..word_size.

Table of contents
1. Definition and semantics
2. Algorithms for counting set bits
3. Software implementations and patterns
4. Complexity and constraints

Detailed information
1. Definition and semantics
- Applies to unsigned integer words. For signed values, convert to unsigned representation before counting.
- Typical widths: 8, 16, 32, 64 bits; JavaScript bitwise operations operate on 32-bit signed ints (conceptually use >>>0 to coerce to unsigned 32-bit).

2. Algorithms
- Lookup table (byte-wise): precompute table[0..255] with popcount for each byte; sum table[(x>>i)&0xFF] over bytes.
- Kernighan's method: while(x){ x &= x-1; count++; } — iterates once per set bit; best when few bits set.
- Parallel (SWAR) / CountBitsSetParallel: arithmetic mask-and-shift technique producing counts in O(log W) arithmetic steps; example 32-bit sequence:
  v = v - ((v >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  v = (v + (v >>> 4)) & 0x0F0F0F0F;
  c = (v * 0x01010101) >>> 24;
- Hardware instruction: POPCNT (x86/ARM) returns weight in one instruction.

3. Software implementations and patterns
- JavaScript (32-bit): coerce to >>>0, use parallel sequence above with >>> for unsigned shifts and ensure constants are 32-bit unsigned.
- For larger widths (64-bit), split into two 32-bit halves and sum.
- For arrays of bytes use 256-entry table for maximum throughput.

4. Complexity
- Lookup table: O(n/8) operations with constant-time table lookups; kernel is memory-bound.
- Kernighan: O(k) where k = number of set bits.
- Parallel SWAR: constant number (~5-7) of arithmetic ops per word.

SUPPLEMENTARY DETAILS
- For performance-critical code, prefer hardware POPCNT or the SWAR method tuned to machine word size.
- In JS, use TypedArrays and process 32-bit words via DataView for faster loops; avoid per-element boxing.

REFERENCE DETAILS
- Function examples:
  - popcount32(v: number): number — returns integer 0..32; implementation uses SWAR constants above.
  - popcountBytes(buf: Uint8Array): number — sums lookup table entries.

DETAILED DIGEST
Source: https://en.wikipedia.org/wiki/Hamming_weight
Retrieved: 2026-03-14
Extracted content: definition, relation to Hamming distance, counting algorithms (lookup table, Kernighan, SWAR/parallel), hardware POPCNT note. Data size retrieved: ~160.7 KB.

ATTRIBUTION
Content derived from Wikipedia: Hamming weight; crawl size ~160.7 KB.