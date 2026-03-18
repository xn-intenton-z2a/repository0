BITHACKS

Source: https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetKernighan
Retrieved: 2026-03-18
Bytes fetched (approx): 101072

Table of contents:
1. CountBitsSetKernighan
2. Kernighan algorithm (explicit steps)
3. JavaScript implementation patterns
4. BigInt-specific pattern
5. Complexity and performance notes
6. Reference details
7. Detailed digest and attribution

1. CountBitsSetKernighan
- Purpose: count the number of 1-bits (population count) in an unsigned integer using repeated clearing of the lowest set bit.
- Key operation: x & (x - 1) clears the lowest-order 1 bit in x.

2. Kernighan algorithm (explicit steps)
- Input: non-negative integer v (conceptually unsigned).
- Steps:
  1. Initialize count = 0.
  2. While v != 0:
     a. v = v & (v - 1)
     b. count = count + 1
  3. Return count
- Complexity: O(k) where k is the number of set bits in v; worst-case O(log2(v)) steps for v with all bits set.

3. JavaScript implementation patterns
- Notes on JS Number and bitwise operators:
  - JavaScript bitwise operators (e.g., ^, &, |, ~, <<, >>, >>>) coerce operands to 32-bit signed integers; using them on Numbers larger than 2^32-1 will truncate values and produce incorrect results for wide integers.
- Pattern for 32-bit-safe values:
  - Compute xor = (a ^ b) >>> 0 to produce an unsigned 32-bit XOR result.
  - Use Kernighan loop on xor: while (xor) { xor &= xor - 1; count++; }
- Pattern for general non-negative integers (safe for large values):
  - Convert inputs to BigInt and use BigInt bitwise operations (see next section).

4. BigInt-specific pattern
- Use BigInt arithmetic to avoid 32-bit truncation and safely process arbitrarily large integers.
- Steps:
  1. Let x = BigInt(a) ^ BigInt(b)
  2. Let count = 0
  3. While x != 0n:
     a. x = x & (x - 1n)
     b. count += 1
  4. Return Number(count) or keep as BigInt as appropriate
- Notes:
  - BigInt supports bitwise operators: &, |, ^, ~, <<, >> (the unsigned right-shift >>> is not supported for BigInt).
  - Use BigInt.asUintN(width, value) to narrow to a fixed unsigned width when required.

5. Complexity and performance notes
- Kernighan's algorithm performs one iteration per set bit; it is highly efficient when the XOR result is sparse.
- For dense bit patterns or very large integers, consider parallel/popcount table approaches (e.g., precomputed 16-bit table lookups) or language-native popcount intrinsics where available.
- BigInt arithmetic cost grows with operand size; for extremely large bit widths, test performance and consider chunked algorithms.

6. Reference details (operators, behavior)
- Clearing lowest set bit: x -> x & (x - 1)
- JavaScript coercion rule: bitwise operators convert Number operands to 32-bit signed integers (truncate to low 32 bits). Do not rely on Number bitwise ops for integers > 2^32-1.
- BigInt: use BigInt(...) to convert; BigInt bitwise operators operate on BigInts without 32-bit truncation.

7. Detailed digest and attribution
- Extracted and condensed from "Bit Twiddling Hacks" (Sean Eron Anderson) CountBitsSetKernighan section, retrieved 2026-03-18. Data fetched ~101,072 bytes (HTML).
- Attribution: Sean Eron Anderson, Bit Twiddling Hacks (public-domain code snippets; aggregate descriptions Copyright 1997-2005). URL: https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetKernighan
