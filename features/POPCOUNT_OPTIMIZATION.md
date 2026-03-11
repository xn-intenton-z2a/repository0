# POPCOUNT_OPTIMIZATION

# Summary

Add a small, well-documented optimization and supporting API for computing the population count (popcount) of BigInt values used by Hamming-distance computations. Provide a compact 8-bit lookup-table implementation exported as a named helper and unit tests that assert parity with the canonical Kernighan algorithm used by hammingDistanceBits. Keep the core hammingDistance and hammingDistanceBits behaviour unchanged.

# Motivation

Counting set bits (popcount) is central to hammingDistanceBits performance when comparing large integers or BigInt values. A byte-wise lookup-table offers a simple, fast, deterministic improvement without changing the public behaviour of the existing distance functions. Exposing a tested popcount helper makes it easy to reuse the optimized implementation in the library, the demo, and future microbenchmarks.

# Specification

1. Public API
   - Export a new named function from src/lib/main.js:
     - popcount(value: bigint) => number
   - Do not change existing hammingDistance(a, b) or hammingDistanceBits(x, y) signatures or thrown errors.

2. popcount(big) behaviour and validation
   - Accept a single argument of typeof "bigint"; if an argument is not a bigint, throw TypeError that mentions bigint or number.
   - If bigint is negative (value < 0n) throw RangeError mentioning non-negative or negative.
   - Return a JavaScript Number equal to the number of set bits in the absolute binary representation of the value.

3. Implementation details
   - Implement an 8-bit lookup table (array length 256) computed once at module initialization.
   - For input v (BigInt), iterate by extracting lowest 8-bit chunks: while (v !== 0n) { count += table[Number(v & 0xffn)]; v >>= 8n; }
   - This approach is deterministic, memory-cheap, and generally faster than bit-by-bit loops for wide values.
   - Keep a clear, commented fallback algorithm reference (Kernighan) in source for comparison, but do not export it.

4. Tests
   - Add unit tests tests/unit/popcount.test.js verifying:
     - popcount(0n) === 0
     - popcount(1n) === 1
     - popcount(0xffn) === 8
     - popcount for large BigInt values (e.g., (1n << 100n) - 1n) equals 100
     - popcount(bx ^ by) === hammingDistanceBits(Number or BigInt versions) when used against the existing hammingDistanceBits implementation; include both Number and BigInt inputs to hammingDistanceBits and validate consistency by converting Numbers to BigInt for the XOR before calling popcount.
     - Error cases: passing a Number to popcount throws TypeError; passing a negative BigInt throws RangeError.
   - Ensure tests are deterministic and small in memory.

5. README and examples
   - Update README.md's API section to list the new exported function popcount and a short sentence showing typical usage (one-line example). Do not include multi-line code blocks; keep examples short and consistent with existing README style.

# Acceptance Criteria

- features/POPCOUNT_OPTIMIZATION.md exists with the above specification.
- src/lib/main.js exports a named popcount function (planned implementation) that accepts bigint and returns a Number.
- Unit tests tests/unit/popcount.test.js verify correctness for small, large, and error cases and assert parity with existing hammingDistanceBits output derived via BigInt XOR.
- Documentation updated in README.md to mention popcount and its intended usage.

# Files touched (implementation plan)

- src/lib/main.js — add lookup table and export popcount; keep existing functions untouched.
- tests/unit/popcount.test.js — new tests as described above.
- README.md — small API addition describing popcount.

# Notes

- This feature is intentionally additive and low-risk: it does not change behaviour of existing exports and is achievable in a single source file.
- If a later performance measurement shows negligible gains, the lookup-table implementation remains a safe, documented alternative.
