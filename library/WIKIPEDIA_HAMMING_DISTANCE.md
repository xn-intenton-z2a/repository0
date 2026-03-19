WIKIPEDIA_HAMMING_DISTANCE

Table of Contents
- Definition
- Mathematical formulation
- Use-cases and constraints
- Algorithmic blueprint for strings (Unicode-aware)
- Algorithmic blueprint for integers (bitwise)
- Complexity
- Validation and error semantics

Definition
The Hamming distance between two equal-length sequences is the count of positions at which the corresponding symbols are different. For two binary words of equal length it equals the number of differing bit positions.

Mathematical formulation
Given two sequences A and B of length n, HammingDistance(A,B) = sum_{i=0..n-1} [A[i] != B[i]] where [·] is 1 when true and 0 when false.

Use-cases and constraints
- Error detection/correction codes, similarity metrics for fixed-length tokens, bit-level comparisons for integers.
- Requires equal-length sequences; for strings the equality is per-code-point (not UTF-16 code unit) when Unicode correctness is required.

Algorithmic blueprint for strings (Unicode-aware)
- Normalize input to JavaScript strings (validate type). Reject non-strings with TypeError.
- Convert each string to a sequence of Unicode code points. Recommended approaches:
  - Iterate with for...of which yields Unicode code points (ES2015+), or
  - Use Array.from(str) which creates an array of code points, or
  - Use explicit codePointAt stepping by code unit lengths when necessary.
- If the two code-point sequences lengths differ, throw RangeError.
- Compare corresponding code points at each index and increment a counter when they differ.
- Return the final count.

Algorithmic blueprint for integers (bitwise)
- Validate inputs are numbers (TypeError) and are non-negative integers (RangeError for negatives). Reject non-integer numbers.
- For two non-negative integers a and b compute x = a XOR b; the Hamming distance equals the number of 1 bits in x (the population count / popcount / Hamming weight).
- Compute popcount via one of these methods (choose by performance/compatibility):
  - Kernighan's method: repeatedly clear the least-significant set bit: while (x != 0) { count++; x &= x - 1 } (works for arbitrary-width integers represented in JS Number up to 53-bit safe range when using BigInt for larger values).
  - Parallel bit-count (SWAR) masks for 32-bit integers: apply successive masks and shifts (use 0x55555555, 0x33333333, 0x0F0F0F0F, etc.) to accumulate counts per byte then sum. Use for high-performance 32-bit workloads.
  - Use language-provided intrinsics if available (e.g., BigInt bit operations combined with Kernighan). For Node.js v20+, BigInt-based bit iteration can be used for >32-bit range.

Complexity
- String algorithm: O(n) time, O(n) temporary memory if you create arrays of code points; O(1) additional working space if iterating both strings in lockstep.
- Integer algorithm: O(k) time where k is number of set bits for Kernighan's method (best when x sparse) or O(1) with fixed small constant using SWAR operations for 32-bit values.

Validation and error semantics
- String function should throw TypeError if inputs are not strings.
- Throw RangeError for strings of unequal length (after code-point conversion) or for negative integers.
- For integer bit-distance throw TypeError if inputs are not numbers or BigInts (choose one consistent numeric type) and RangeError for negative values.

Supplementary details
- Unicode: treat surrogate pairs as single code points; do not compare UTF-16 code units directly. Use for...of or Array.from to ensure correct code point iteration.
- Large integers: JavaScript Number is IEEE-754 double; integer bitwise ops truncate to 32 bits. For integers >2^32 use BigInt and BigInt XOR / popcount via Kernighan.

Reference details (API signatures and behaviors)
- Signature (strings): hammingDistanceStrings(a: string, b: string): number
  - Parameters: a, b: strings
  - Returns: non-negative integer (number)
  - Errors: TypeError on non-string, RangeError if lengths differ (in code points)
- Signature (integers): hammingDistanceInts(a: number|BigInt, b: number|BigInt): number
  - Parameters: a, b: non-negative integers (use BigInt for >2^31 range if needed)
  - Returns: non-negative integer (number)
  - Errors: TypeError on wrong types, RangeError for negative values

Digest (retrieval)
- Source: https://en.wikipedia.org/wiki/Hamming_distance
- Retrieved: 2026-03-19
- Data obtained during crawl: 161.8 KB (HTML)

Attribution
Content derived from Wikipedia — Hamming distance (CC BY-SA). Data retrieved on 2026-03-19; HTML size as indicated above.
