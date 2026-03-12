# HAMMING_DISTANCE_BIGINT

Specification

Ensure hammingDistanceBits accepts and correctly handles large integers (BigInt) and that behaviour matches Number inputs where both are representable.

Acceptance Criteria

- `hammingDistanceBits(1n, 4n)` returns `2`.
- `hammingDistanceBits(0n, 0n)` returns `0`.
- `hammingDistanceBits(2n ** 64n - 1n, 0n)` returns `64`.
- `hammingDistanceBits(Number.MAX_SAFE_INTEGER, BigInt(Number.MAX_SAFE_INTEGER))` returns `0`.
- Passing BigInt and Number combinations (e.g., `1n` and `4`) behave correctly and consistently.
- Non-integer or negative BigInt values are rejected with the same error semantics as Number inputs.

Notes

This feature focuses on large-integer correctness and interop between Number and BigInt inputs; tests should live in `tests/unit/` and be runnable with `npm test`.
