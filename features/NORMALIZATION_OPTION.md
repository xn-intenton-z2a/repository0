# POPCOUNT_OPTIMIZATION

# Summary

Provide a focused, audited popcount implementation and tests for the hamming-distance library that are fast, dependency-free, and fully deterministic across platforms. This feature specifies a 256-entry byte lookup popcount for BigInt values, an explicit Kernighan fallback for parity checks, named exports for testability, and unit tests that validate correctness and parity with the fallback.

# Motivation

popcount is the core primitive for integer Hamming computations (XOR then popcount). A clear, well-tested BigInt popcount ensures correctness for large integers, allows deterministic unit tests, and gives maintainers a simple path for future performance tuning. Exposing a small, auditable implementation reduces risk compared to opaque platform-specific optimizations.

# Specification

1. Exports and API
   - Add or ensure the following named exports in src/lib/main.js:
     - popcount(value: bigint): number
     - popcountKernighan(value: bigint): number
   - Keep hammingDistanceBits using popcount internally; tests should import popcount directly for cross-checking.

2. Implementation requirements
   - Build a const BYTE_POPCOUNT = new Uint8Array(256) computed at module load with counts for 0..255.
   - popcount(value: bigint):
     - Validate typeof value === 'bigint' otherwise throw TypeError with message containing bigint or number.
     - If value < 0n throw RangeError with message containing non-negative.
     - Use a loop that extracts low 8 bits repeatedly: while (value !== 0n) { sum += BYTE_POPCOUNT[Number(value & 0xffn)]; value >>= 8n; }
     - Return sum as a JavaScript Number.
   - popcountKernighan(value: bigint):
     - Validate as above.
     - Implement the classic Kernighan loop: while (v !== 0n) { v &= v - 1n; count++; } return count.
   - Keep both implementations small, well-commented, and side-effect free.

3. Tests
   - Add unit tests in tests/unit/popcount.test.js (or expand existing tests) to assert:
     - popcount(0n) === 0
     - popcount(0xffn) === 8
     - popcount((1n << 100n) - 1n) === 100
     - popcount throws TypeError for non-bigint (e.g., 1) with message containing bigint or number
     - popcount throws RangeError for negative BigInt (e.g., -1n) with message containing non-negative
     - popcountKernighan behaves identically to popcount for a sampled set of values (small, large sparse, dense)
     - hammingDistanceBits(x, y) for sampled pairs equals Number(popcount(BigInt(x) ^ BigInt(y))) where applicable
   - Tests must assert substring matches for error messages using canonical keywords rather than full exact messages.

4. Performance and code clarity
   - Keep the implementation portable and dependency-free.
   - Include a short comment describing why the 256-byte lookup is used and when Kernighan is preferable.

# Acceptance Criteria

- src/lib/main.js exports popcount and popcountKernighan as named exports.
- popcount uses a 256-entry BYTE_POPCOUNT lookup and returns correct counts for the tests above.
- popcountKernighan returns identical results for sampled values.
- Unit tests covering popcount and parity with the Kernighan fallback are present in tests/unit and pass locally.
- hammingDistanceBits continues to use popcount internally and tests cross-check results using the exported popcount.

# Files to change (minimal set)

- src/lib/main.js — implement BYTE_POPCOUNT, popcount, popcountKernighan, and export them (minimal, well-tested additions). Keep existing hammingDistanceBits usage but update to call popcount.
- tests/unit/popcount.test.js — new or expanded unit tests exercising correctness, error handling, and parity with Kernighan.
- README.md — add a one-line mention of popcount export and a short example showing popcount(0xffn) === 8 (append to existing API docs). Keep change minimal.

# Notes

- Error messages must include canonical substrings (bigint, non-negative) so tests can match reliably.
- Implementation should favour clarity over micro-optimizations; the 256-byte lookup is both fast and easy to audit.
- This feature is self-contained and achievable within the repository by editing src/lib/main.js, adding tests, and a short README addition.

# Acceptance checklist

- popcount export exists and is tested
- Kernighan parity tests pass
- hammingDistanceBits uses popcount for counting set bits

