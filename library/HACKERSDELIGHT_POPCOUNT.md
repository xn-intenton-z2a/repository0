HACKERS_DELIGHT_POPCOUNT

Table of contents
- Overview
- Key algorithms
  - Linear bit-scan (kernighan)
  - Parallel word-level popcount (divide-and-conquer masks)
  - Use of hardware instructions
- Implementation details
  - 32-bit and 64-bit masks and constants
  - Sequence of arithmetic and bitwise ops for parallel popcount
- Supplementary details
  - Complexity and performance notes
  - When to use BigInt vs native Number
- Reference details
  - Exact mask constants and step sequence
- Digest
  - Source: https://www.hackersdelight.org/hdcodetxt/popcnt.c
  - Retrieved: 2026-03-20
- Attribution
  - Data size fetched: popcnt.c (approx 4 KB)

Overview
Hacker's Delight provides multiple population-count (popcount) algorithms optimized for different word sizes and CPU capabilities. Implementations include a simple loop-based count that removes the lowest set bit iteratively, and highly optimized parallel algorithms using masks and shift-add sequences that compute counts for 32-bit and 64-bit words in a small fixed number of operations.

Key algorithms

Linear bit-scan (Kernighan)
- Principle: Repeatedly clear the lowest set bit using x = x & (x - 1) and increment a counter until x == 0.
- Operations per set bit: one subtraction, one bitwise AND, one assignment, one increment.
- Complexity: O(number of set bits). Best when values are sparse.
- Use case: small inputs or when branching cost is acceptable.

Parallel word-level popcount (divide-and-conquer masks)
- Principle: Use successive masks, shifts, and adds to pairwise sum bit counts across adjacent groups, doubling group size each step until a full-word count is produced.
- Typical 32-bit sequence (conceptual):
  1. x = x - ((x >> 1) & 0x55555555)             ; pairwise counts
  2. x = (x & 0x33333333) + ((x >> 2) & 0x33333333) ; 4-bit groups
  3. x = (x + (x >> 4)) & 0x0F0F0F0F             ; 8-bit groups
  4. x = x + (x >> 8)
  5. x = x + (x >> 16)
  6. result = x & 0x0000003F
- Typical 64-bit sequence uses 0x5555555555555555, 0x3333333333333333, 0x0F0F0F0F0F0F0F0F, shifts of 8,16,32 and final mask 0x7F or 0xFF as appropriate.
- Operations: fixed number of shifts, ANDs, adds — no per-bit loops.
- Complexity: O(1) in word-size; fastest for dense inputs and large-scale operations.

Use of hardware instructions
- When available, use CPU POPCNT instruction or compiler builtin (e.g., __builtin_popcount, __builtin_popcountll) for best performance.
- Fallback to the parallel mask algorithm or Kernighan loop when hardware popcount is unavailable.

Implementation details

32-bit constants and step sequence
- Masks: 0x55555555, 0x33333333, 0x0F0F0F0F
- Sequence: subtract shifted bits, accumulate partial sums per group, fold into final byte/word.

64-bit constants and step sequence
- Masks: 0x5555555555555555, 0x3333333333333333, 0x0F0F0F0F0F0F0F0F
- Sequence: same as 32-bit with extended shifts (>>8, >>16, >>32) and appropriate final mask (0x7F or low 8-bits).

BigInt considerations
- JavaScript Number is IEEE-754 double and accurately represents integers up to 2^53-1. For larger integers use BigInt.
- For BigInt, parallel bitwise shifts and masks are supported; adapt mask constants as BigInt literals (e.g., 0x5555n).
- Performance: BigInt operations are slower; for very large bit-widths, consider chunking into 64-bit parts and summing popcounts.

Supplementary details

Complexity and performance
- Kernighan: O(popcount(x)) with low overhead for sparse words.
- Parallel masks: fixed number of arithmetic/bitwise ops independent of popcount density; preferred for dense values and bulk processing.
- Hardware POPCNT: fastest when available; always prefer compiler/host intrinsic if portability allows.

When to chunk and aggregate
- For integers larger than native word size (e.g., BigInt or arrays of words), split into 64-bit (or 32-bit) chunks, compute popcount per chunk, then sum.
- For streaming data, accumulate counts per block.

Reference details (exact constants and step sequence)
- 32-bit masks: 0x55555555, 0x33333333, 0x0F0F0F0F
- 64-bit masks: 0x5555555555555555, 0x3333333333333333, 0x0F0F0F0F0F0F0F0F
- 32-bit fold steps: subtract shifted by 1 then mask, add shifted by 2 then mask, fold by shifts 4,8,16, and mask final.
- 64-bit fold steps: same with shifts 1,2,4,8,16,32.

Digest
- Extracted technical sequence and mask constants from Hacker's Delight popcnt.c on 2026-03-20.
- Source contained C implementations of parallel popcount and references to hardware intrinsics and alternative algorithms.

Attribution
- Source: Hacker's Delight: Henry S. Warren, Jr.
- URL: https://www.hackersdelight.org/hdcodetxt/popcnt.c
- Retrieved: 2026-03-20
- Size: ~4 KB
