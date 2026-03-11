# POPCOUNT_OPTIMIZATION

# Summary

Provide a concise, auditable, and well-tested popcount implementation for BigInt values used by the hamming-distance library. The implementation must be dependency-free, use a 256-entry byte lookup table for predictable performance, and expose a small Kernighan fallback for parity testing.

# Motivation

popcount is the core primitive for integer Hamming computations (XOR then popcount). A compact, deterministic implementation reduces risk, makes behaviour easy to reason about, and enables unit tests that exercise large BigInt widths without platform-specific optimisations. Exposing a Kernighan fallback keeps a clear reference implementation for cross-checking correctness.

# Specification

1. Named export
   - Export the following named functions from src/lib/main.js:
     - popcount(value: bigint): number
     - popcountKernighan(value: bigint): number
   - Keep hammingDistanceBits(x, y) using popcount internally so tests can cross-check via the exported popcount.

2. BYTE_POPCOUNT table
   - Implement a const BYTE_POPCOUNT = new Uint8Array(256) initialised at module load with counts for 0..255.
   - Document with a short comment why 256-entry lookup is chosen (simplicity, portability, cache-friendly for typical BigInt sizes).

3. popcount(value: bigint)
   - Validate: if typeof value !== 'bigint' throw TypeError whose message contains bigint or number.
   - Validate: if value < 0n throw RangeError whose message contains non-negative.
   - Implementation: iterate while value !== 0n, accumulating BYTE_POPCOUNT[Number(value & 0xffn)] and shifting value >>= 8n. Return sum as Number.
   - Keep implementation small and side-effect free.

4. popcountKernighan(value: bigint)
   - Same validation rules as popcount.
   - Implementation: classic Wegner/Kernighan loop: while (v !== 0n) { v &= v - 1n; count++; } return count as Number.
   - Include this function for test parity; it need not be used in production code paths.

5. Error message keywords
   - Error messages must include canonical substrings so tests can match reliably: bigint, non-negative.
   - Use short, deterministic phrases (e.g., "value must be bigint" and "non-negative") so unit tests can assert substring membership rather than full messages.

6. Tests
   - Add or update tests in tests/unit/popcount.test.js to assert:
     - popcount(0n) === 0
     - popcount(0xffn) === 8
     - popcount((1n << 100n) - 1n) === 100
     - popcount throws TypeError for Number input and that the message includes bigint or number
     - popcount throws RangeError for negative BigInt and that the message includes non-negative
     - popcountKernighan returns identical results to popcount for a sampled set of values (small, dense, sparse, large)
     - hammingDistanceBits(x, y) === Number(popcount(BigInt(x) ^ BigInt(y))) for sampled pairs
   - Tests must use substring matching for error messages (canonical keywords) to stay robust.

7. README and examples
   - Add a one-line mention of the popcount export to README.md with a short example (popcount(0xffn) -> 8) and note that the function accepts only BigInt and rejects negatives.
   - Ensure any examples or demo pages that rely on popcount use the exported function and reflect its constraints.

# Acceptance Criteria

- src/lib/main.js exports popcount and popcountKernighan as named exports.
- popcount uses a precomputed 256-entry BYTE_POPCOUNT lookup and returns correct counts for the unit tests above.
- popcountKernighan returns identical results for sampled values.
- Unit tests in tests/unit/popcount.test.js assert correctness, error handling (substring checks for bigint and non-negative), and parity between implementations and pass locally.
- hammingDistanceBits continues to use popcount internally and unit tests cross-check hammingDistanceBits against popcount for sample inputs.
- README contains a short reference and example for popcount.

# Files to change (minimal set)

- src/lib/main.js — implement BYTE_POPCOUNT, popcount, popcountKernighan, and export them. Ensure hammingDistanceBits calls popcount internally. Keep changes minimal and well-documented.
- tests/unit/popcount.test.js — new or updated tests exercising correctness, error handling, and parity with Kernighan.
- README.md — add a short API note and example for popcount.

# Notes

- Keep implementation portable and dependency-free; the 256-byte lookup trades minimal memory for simple, auditable performance.
- Error messages should be short but include canonical keywords for robust tests.
- This feature is narrowly scoped and achievable within a single repository change set.
