BITHACKS_POPCOUNT

Table of contents:
- Purpose
- Counting bits: methods overview
- Naive and table lookup
- Kernighan's algorithm (looping by clearing lowest set bit)
- Parallel (SIMD-like) counting method (32-bit and 64-bit constants)
- BigInt and JavaScript considerations
- Performance and complexity
- Implementation patterns and exact operations
- Troubleshooting and edge cases
- Digest (retrieved 2026-03-18)
- Attribution and data size

Purpose
Provide concrete, implementable algorithms for computing the Hamming weight (number of 1 bits) of an integer value. These algorithms are the canonical references used to implement bit-level Hamming distance by XORing two integers and counting set bits in the XOR result.

Counting bits: methods overview
- Naive bit-by-bit scan: test each bit position and accumulate a count. Complexity O(word_size).
- Lookup table: split the word into bytes and sum precomputed counts from a 256-entry table. Complexity O(word_size/8) with memory lookup overhead.
- Kernighan's method: repeatedly clear the lowest set bit (v &= v - 1) and increment a counter. Complexity O(popcount) where popcount is number of 1 bits.
- Parallel (arithmetic/bitwise) method: use a sequence of masked shifts and additions to accumulate bit counts in parallel across subfields; fixed number of operations independent of number of set bits (O(log word_size) fixed operations).

Kernighan's method (exact pattern)
- Algorithm (C-like pseudocode):
  count = 0;
  while (v != 0) {
    v = v & (v - 1);   // clear lowest set bit
    count = count + 1;
  }
- Complexity: O(k) where k is number of set bits. Works naturally with arbitrary-size integers if language supports them (BigInt in JS) when using corresponding bitwise ops.

Parallel counting method (exact 32-bit sequence)
- This sequence counts bits in a 32-bit unsigned word using successive masks and adds. Use 32-bit unsigned arithmetic.
  1) v = v - ((v >> 1) & 0x55555555);
  2) v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
  3) v = (v + (v >> 4)) & 0x0F0F0F0F;
  4) v = v + (v >> 8);
  5) v = v + (v >> 16);
  6) count = v & 0x0000003F; // lower 6 bits hold the count
- Explanation: step 1 collapses adjacent bit pairs into 2-bit counts, step 2 collapses into 4-bit counts, step 3 into 8-bit groups, and subsequent adds accumulate into a single field.

Parallel counting method (64-bit constants)
- For 64-bit values, use constants extended to 64 bits:
  0x5555555555555555, 0x3333333333333333, 0x0F0F0F0F0F0F0F0F and final mask 0x7F (or 0x000000000000003F depending on use). The same sequence generalises by replacing constants and shifts accordingly.

BigInt and JavaScript considerations
- JavaScript Number is a double-precision floating-point value with only 53 bits of precise integer range; bitwise operators operate on 32-bit signed integers. For arbitrary large non-negative integers use BigInt.
- Kernighan's method adapts directly to BigInt: use n &= n - 1n in a loop until n === 0n. Example pattern (pseudocode):
  count = 0n;
  while (n !== 0n) {
    n &= n - 1n;
    count += 1n;
  }
  // convert count to Number if needed (be aware of range)
- The parallel masking method relies on fixed-width machine arithmetic and 32/64-bit masks; it is suitable for 32-bit and 64-bit Number/typed-integer contexts but not directly applicable to arbitrary-precision BigInt without explicit chunking.
- Practical JS approach to count bits of a BigInt XOR result:
  - Use Kernighan's method with BigInt operations for correctness and simplicity.
  - For small integers that fit in 32-bit unsigned, use XOR followed by the 32-bit parallel counting sequence using Number and >>> 0 to ensure unsigned behavior.

Performance and complexity
- Kernighan: O(popcount) (best when popcount is low).
- Parallel: O(log word_size) with few arithmetic operations; fastest on fixed-size native words (32/64-bit) where bitwise operations are cheap and vectorisable by CPUs.
- Table lookup: good when many queries and memory is available; uses memory access and 256-entry table.

Implementation patterns (exact operations and recommendations)
- For Hamming distance between two non-negative integers a and b (JS):
  1) Compute xor = a ^ b (for BigInt use a ^ b where a and b are BigInt)
  2) Count set bits in xor using:
     - If xor fits in 32-bit unsigned range: use parallel-32 sequence implemented with Number and >>> 0, then extract lower 6 bits.
     - Otherwise use BigInt Kernighan loop: while (xor !== 0n) { xor &= xor - 1n; count++; }
- Exact 32-bit pattern to implement in JS (Number domain, ensure unsigned):
  let v = (a ^ b) >>> 0; // ensure 32-bit unsigned
  v = v - ((v >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  v = (v + (v >>> 4)) & 0x0F0F0F0F;
  v = v + (v >>> 8);
  v = v + (v >>> 16);
  const count = v & 0x3F;
- For BigInt:
  let v = a ^ b; // BigInt XOR
  let count = 0n;
  while (v !== 0n) {
    v &= v - 1n;
    count += 1n;
  }
  // convert count to Number if the result fits in Number

Troubleshooting and edge cases
- Be explicit about types: mixing Number and BigInt in JS throws TypeError; ensure both inputs are same numeric type before XOR/count.
- For negative integers: specification requires non-negative integers; if negative integers may appear, either reject them (RangeError) or convert to an unsigned representation but prefer rejecting per mission.
- If inputs may exceed 32-bit and performance is critical: chunk the BigInt into 64-bit or 32-bit windows, count each window with the parallel method and sum.

Digest (extracted content)
- The Bit Twiddling Hacks collection documents multiple methods to count set bits, including Brian Kernighan's algorithm and the parallel masked-add sequence with explicit 32-bit and 64-bit constants. It presents C-like implementations and operation counts; the parallel method uses constants 0x55555555, 0x33333333, 0x0F0F0F0F and final mask 0x3F for 32-bit words.
- Retrieval date: 2026-03-18

Attribution
Source: https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel
Data retrieved: 97985 bytes (HTTP response body size measured at fetch time)
