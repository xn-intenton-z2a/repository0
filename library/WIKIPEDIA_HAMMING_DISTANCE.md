WIKIPEDIA_HAMMING_DISTANCE

Table of contents
- Definition
- Formal properties
- Applications
- Algorithms and examples
- Supplementary details
- Reference details
- Digest and retrieval
- Attribution and size

Definition
The Hamming distance between two strings of equal length is the number of positions at which the corresponding symbols are different.
For binary vectors of equal length it equals the number of bit positions that differ.
For non-negative integers represented in binary of equal bit-length, Hamming distance equals the population count of the bitwise XOR of the integers: distance(a,b) = popcount(a XOR b).

Formal properties
- Non-negative integer value.
- d(x,y) = 0 iff x == y.
- Symmetric: d(x,y) = d(y,x).
- For fixed-length vectors, satisfies triangle inequality when extended appropriately for metric spaces used in coding theory.

Applications
- Error-detecting and error-correcting codes (minimum Hamming distance determines error-detection/correction capacity).
- Similarity measures for fixed-length tokens (strings, fingerprints, bitmasks).

Algorithms and examples
- String Hamming distance (Unicode-aware): iterate code points of each string in parallel and count mismatches. Must validate equal code point counts first; comparing JavaScript UTF-16 code units is incorrect for characters outside BMP (use codePoint iteration or Array.from(string) to get code points).
- Integer bit Hamming distance (popcount of XOR): compute xor = a ^ b; result = popcount(xor). For BigInt values in JS use BigInt operators: xor = BigInt(a) ^ BigInt(b); then count set bits.

Examples
- stringHamming('karolin', 'kathrin') => 3
- stringHamming('', '') => 0
- bitHamming(1,4) => 2  (1 = 001, 4 = 100)  => xor = 101 => popcount = 2
- bitHamming(0,0) => 0

Supplementary details
Validation rules to implement:
- stringHamming(s1, s2): if typeof s1 !== 'string' or typeof s2 !== 'string' throw TypeError. Convert to code point arrays: p1 = Array.from(s1); p2 = Array.from(s2); if p1.length !== p2.length throw RangeError. Then iterate indices and count p1[i] !== p2[i]. Return count.
- bitHamming(a, b): if typeof a !== 'number' && typeof a !== 'bigint' throw TypeError. If a < 0 or b < 0 throw RangeError. Convert to BigInt for computation: A = BigInt(a); B = BigInt(b); X = A ^ B; popcount loop: count = 0; while (X) { count += Number(X & 1n); X >>= 1n; } Return count.

Reference details
- Population count (popcount) exact algorithm for BigInt in JS:
  let count = 0n;
  while (x !== 0n) {
    count += x & 1n;
    x >>= 1n;
  }
  return Number(count);
- Use BigInt XOR: x = A ^ B; use 1n, shift with >>= 1n.
- For performance with Number-sized integers (<= 2^53-1), use Number XOR and Kernighan's bit-counting loop:
  let v = a ^ b; let c = 0; while (v) { v &= v - 1; c++; } return c;

Digest and retrieval
- Source: https://en.wikipedia.org/wiki/Hamming_distance
- Retrieval date: 2026-03-20
- Extracted sections: Definition, properties, algorithms, examples (string and integer), applications to coding theory.

Attribution and size
- Source: Wikipedia (CC BY-SA 3.0 / 4.0). Content extracted and condensed.
- Crawl size: initial HTML head snippet fetched (~120 KB header content omitted); document created with essential technical points only.
