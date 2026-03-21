# ENCODING_BENCHMARK

Summary

Define deterministic benchmarks and verification tests that measure encoded sizes and basic performance characteristics so the library can prove which printable encoding is the densest for a 16-byte UUID and that density claims remain true over time.

Scope

- Compute and record encoded length for a canonical 16-byte UUID for every registered encoding.
- Compare those lengths against baseline formats (hex: 32 chars, base64 unpadded: 22 chars).
- Run deterministic sampling across representative inputs (nil UUID, all-0xFF, single-byte, and a seeded set of 100 pseudo-random 16-byte values) and assert the densest encoding is consistently the shortest on average and for the median sample.
- Provide a small optional micro-benchmark that records encode/decode throughput (ops/sec) for 16-byte inputs for each encoding; do not require strict performance numbers, only record results to help future optimization.

Design notes

- Tests must use listEncodings to obtain metadata (charsetSize, bitsPerChar, exampleLengthFor16Bytes) rather than hard-coded numbers so documentation and tests are driven by the implementation.
- The canonical UUID used for the deterministic checks should be the nil UUID (all zeros) and one fixed sample UUID (chosen in tests) to avoid flaky randomness.
- Sampling tests should use a seeded pseudo-random generator so results are reproducible.
- Micro-benchmarking must be optional in CI; its results should be recorded in the test output but not cause CI failures if timings vary.

# ACCEPTANCE CRITERIA

- A test feature exists at tests/unit/encoding-benchmark.test.js that:
  - Queries listEncodings and asserts exampleLengthFor16Bytes matches the encoded length produced by encoding a nil UUID for every encoding.
  - Asserts the densest registered encoding (lowest exampleLengthFor16Bytes) produces an encoded UUID shorter than 22 characters.
  - Runs a seeded sample of 100 random 16-byte buffers and asserts that the median encoded length for the densest encoding is less than or equal to the median encoded length for base64 and hex.
  - Records encode/decode throughput for each encoding and includes the numbers in test output without failing the test on timing variance.
- The README comparison table is verified against computed metadata: tests assert the README values for charset size, bitsPerChar (4-decimal), and UUID chars match listEncodings for the built-ins.
- All checks are deterministic and reproducible; any randomness uses a fixed seed.
- The test suite (with micro-benchmark disabled) passes in CI and the benchmark test produces human-readable output when enabled locally.
