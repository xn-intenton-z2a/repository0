# HAMMING_DISTANCE_PERFORMANCE

Specification

Hamming distance for integers (`hammingDistanceBits`) must correctly handle large integers (BigInt) and reasonable performance for typical inputs.

Acceptance Criteria

- `hammingDistanceBits(1n, 4n)` returns `2`.
- `hammingDistanceBits(0n, 0n)` returns `0`.
- `hammingDistanceBits(2n ** 64n - 1n, 0n)` returns `64`.
- `hammingDistanceBits(Number.MAX_SAFE_INTEGER, BigInt(Number.MAX_SAFE_INTEGER))` returns `0`.
- Passing a Number and BigInt pair (e.g., `1n` and `4`) behaves consistently and returns the correct numeric distance.

Notes

Focus is correctness for large widths; microbenchmarks are optional but helpful. Implementation may use BigInt XOR and bit-iteration or population-counting techniques.
