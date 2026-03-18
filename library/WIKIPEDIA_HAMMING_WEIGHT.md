WIKIPEDIA_HAMMING_WEIGHT

Table of contents
1. Definition
2. Popcount algorithms
3. Brian Kernighan algorithm (implementation detail)
4. Parallel and table-based methods
5. JavaScript adaptations (Number vs BigInt)
6. Digest and attribution

Normalised extract
Definition: The Hamming weight of a binary string or integer is the number of symbols equal to 1; equivalently, the population count (popcount) of the integer's binary representation.

Popcount algorithms (actionable techniques):
- Brian Kernighan's algorithm (bit-clear loop): while (n != 0) { n &= (n - 1); count++; } This uses one iteration per set bit and is efficient for sparse set bits.
- Table lookup: split word into bytes (or nibble), precompute popcounts per small block, then sum using table index. Useful for fixed-width words and high throughput.
- Parallel (divide-and-conquer) bit hacks: use masks and shifts to combine partial counts (see Hacker's Delight algorithms) to compute popcount in O(log w) operations where w is word width.

Brian Kernighan algorithm (explicit patterns):
- For Number (32-bit context): let x = x >>> 0; let count=0; while (x){ x &= x - 1; count++; } return count;
- For BigInt (arbitrary width): let d = BigInt(x) ^ BigInt(y); let count = 0; while (d !== 0n) { d &= d - 1n; count++; } return Number(count);

Parallel and table-based methods (notes):
- Table approach: precompute popcount for 0..255 in an array of 256 entries; for a 32/64-bit value, extract bytes and sum table[byte_i]. Memory-cost vs speed tradeoff.
- Parallel bit-count: successive masking and shifting steps reduce groups of bits to counts. Use when avoiding loops is beneficial and word width is known.

JavaScript-specific considerations:
- Use BigInt to count bits above 32 bits reliably; Number bitwise operators truncate to 32 bits.
- When using 32-bit Number representation, coerce with >>>0 to treat as unsigned 32-bit.

Reference details (APIs and exact patterns)
- Function: popcountNumber(n: number) -> number
  - Preconditions: n is a finite integer; treat as unsigned 32-bit: n = n >>> 0.
  - Pattern: let count=0; while (n){ n &= n - 1; count++; } return count;

- Function: popcountBigInt(n: bigint) -> number
  - Preconditions: n >= 0n
  - Pattern: let d = n; let count = 0; while (d !== 0n) { d &= d - 1n; count++; } return Number(count);

Digest (retrieved: 2026-03-18)
- Extracted: definition of Hamming weight, Kernighan algorithm, table and parallel methods for popcount and JS adaptation notes.
- Source: https://en.wikipedia.org/wiki/Hamming_weight
- Bytes retrieved: 155444
