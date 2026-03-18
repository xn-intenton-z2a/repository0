# HAMMING_BENCHMARK

Status: PROPOSED

Purpose
Provide a lightweight, reproducible benchmark script to measure performance characteristics of the integer Hamming implementation and any bit-counting optimisations. Benchmarks help detect regressions when handling very large BigInt values or long inputs.

Scope
- Add a small script under examples/benchmark.js that exercises hammingDistanceInt with a range of sizes and prints labelled timings to stdout.
- The script should be runnable with node examples/benchmark.js and return exit code 0 on success.
- The benchmark is informational and not part of unit tests, but results should be reproducible enough for local comparisons.

Benchmark concerns
- Measure bit-level Hamming for numbers near and beyond Number.MAX_SAFE_INTEGER (use BigInt) to ensure performance remains acceptable.
- Measure string-based scenarios for long inputs (e.g., strings of length 10k) to spot O(n) behaviour and constant factors.

Acceptance Criteria
- examples/benchmark.js exists and can be executed with node examples/benchmark.js without throwing.
- The script prints labelled timing lines such as: hammingDistanceInt, size=..., elapsedMs=... and exits 0.
- Running the benchmark before and after a change should be straightforward and produce comparable output formats for automated parsing.

Notes
- This feature does not mandate micro-benchmarking frameworks; a small, plain script that records process.hrtime or performance.now is sufficient.
