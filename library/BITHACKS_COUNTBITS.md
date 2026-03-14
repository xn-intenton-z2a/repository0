NORMALISED EXTRACT
Definition
CountBitsSetParallel (SWAR) is a bit-parallel algorithm that computes the population count of a machine word using mask, shift, add, and multiply operations. The method reduces multiple bits into summed nibbles and extracts the total count with a final multiply-and-shift.

Table of contents
1. 32-bit SWAR algorithm (exact operations and constants)
2. 64-bit adaptation
3. Implementation notes and correctness
4. Performance and trade-offs

Detailed information
1. 32-bit algorithm (exact sequence)
- Given 32-bit unsigned v:
  v = v - ((v >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  v = (v + (v >>> 4)) & 0x0F0F0F0F;
  result = (v * 0x01010101) >>> 24; // result in 0..32
- Explanation: stepwise collapse of bit counts into 4-bit groups, then aggregate via multiplication and high-byte extraction.

2. 64-bit adaptation
- Use 64-bit constants and unsigned 64-bit arithmetic (in languages with native 64-bit): masks 0x5555555555555555, 0x3333333333333333, 0x0F0F0F0F0F0F0F0F, final multiply by 0x0101010101010101 and shift by 56.
- In environments without native 64-bit (e.g., JS), split into two 32-bit halves, apply 32-bit SWAR to each and sum.

3. Implementation notes
- Use logical right shift (unsigned) for correct mask alignment; in C use >> for unsigned types or explicit unsigned shifts.
- Ensure constants are appropriately typed to avoid sign-extension when languages default to signed integers.
- The final multiply step folds per-byte counts into the MSB of a summed word; extracting top byte yields the total.

4. Performance and trade-offs
- SWAR performs a small fixed number of integer ops; fast where multiply and bitwise ops are cheap and POPCNT not available.
- For sparse bitsets, Kernighan's method may be faster due to fewer iterations.

SUPPLEMENTARY DETAILS
- Use SWAR when implementing popcount in portable C, embedded systems, or as fallback when hardware POPCNT is absent. Use 32-bit variant in JS with >>>0 coercion.

REFERENCE DETAILS
- Exact constants and operations provided above are the canonical implementation; signature:
  popcount32(v: uint32): uint32
  popcount64(v: uint64): uint64
- Returns integer count of set bits.

DETAILED DIGEST
Source: https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel
Retrieved: 2026-03-14
Extracted content: canonical SWAR sequence, constants for 32/64-bit, explanation of steps and final extraction via multiply, usage notes. Data size retrieved: ~98.7 KB.

ATTRIBUTION
Content derived from Sean Eron Anderson's Bit Twiddling Hacks (public domain code snippets; aggregate content copyrighted by author); crawl size ~98.7 KB.