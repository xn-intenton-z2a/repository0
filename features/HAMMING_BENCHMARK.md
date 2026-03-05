# HAMMING_BENCHMARK

## Overview

Add a small, focused benchmarking feature that lets maintainers measure and track the performance of the Hamming distance implementations in src/lib/main.js. The feature provides a tiny benchmark function export and a CLI subcommand that runs reproducible micro-benchmarks for string and integer Hamming distance computations.

## Motivation

As the library evolves, small implementation changes can unintentionally degrade performance. A lightweight, dependency-free benchmark helps maintainers detect regressions, choose between algorithmic alternatives, and validate that the library meets practical speed expectations for typical use-cases.

## Behavior

- Export a new named function from src/lib/main.js: benchmarkHamming({type, iterations, size}) that returns a results object with metrics (opsPerSecond, meanMs, totalMs, iterations).
  - type: "string" or "bits" (default: "string").
  - iterations: positive integer controlling how many samples to run (default: 10000 for bits, 1000 for strings).
  - size: for strings, number of code points in generated test strings; for bits, the approximate bit-width (e.g., 32).
- Add a CLI subcommand: node src/lib/main.js cli benchmark string|bits [--iterations N] [--size N]
  - Runs the benchmark and prints a short human-readable summary to stdout (ops/sec, avg ms/op, total ms) and exits 0 on success.
  - Writes a compact JSON metrics object to stdout when invoked with --json.
  - Validation errors print to stderr and exit with code 2.

## API

- benchmarkHamming(options)
  - options.type: "string" | "bits" (optional)
  - options.iterations: positive integer (optional)
  - options.size: positive integer (optional)
  - Returns: { type, iterations, size, totalMs, meanMs, opsPerSecond }
  - Throws TypeError on invalid option types and RangeError for non-positive numeric options.

## Requirements

1. Implementation must be dependency-free and live inside src/lib/main.js so it can be shipped with the library.
2. Benchmarks should generate consistent test data: reproducible pseudo-random strings (using a small fixed PRNG seeded for determinism) and integers constructed deterministically from the seed.
3. The benchmark should measure only the core function invocation (hammingDistance or hammingDistanceBits), avoiding heavy per-iteration allocations where possible.
4. The CLI should be minimal and reuse the existing CLI parsing conventions described in HAMMING_CLI.md.
5. The feature must be achievable in a single source file modification and documented in README.md (short usage example and command form).

## Tests and Acceptance Criteria

- Unit tests (non-flaky) should exercise the benchmark function for very small iteration counts and assert the returned results object shape and value ranges:
  - benchmarkHamming({type: "string", iterations: 1, size: 1}) returns an object with iterations=1 and meanMs >= 0.
  - benchmarkHamming({type: "bits", iterations: 1, size: 8}) returns an object with iterations=1 and opsPerSecond >= 0.
- CLI integration tests should run the CLI with small iteration counts and assert exit code 0 and presence of expected numeric fields in stdout.
- Acceptance criteria (formal):
  1. benchmarkHamming is exported as a named export from src/lib/main.js.
  2. CLI subcommand node src/lib/main.js cli benchmark string  --iterations 10 --size 8 prints a human summary and exits 0.
  3. CLI supports --json and prints valid JSON with fields type, iterations, size, totalMs, meanMs, opsPerSecond.
  4. Unit tests cover deterministic behavior for iteration=1 and validate result object shape and numeric ranges.

## Implementation notes

- Use a tiny, deterministic PRNG (e.g., multiply-with-carry or xorshift) seeded with a constant to generate example strings and integers so tests are deterministic.
- For strings, generate code points in the ASCII range and build strings by joining code points; ensure created strings have the requested code point length.
- Counting time: use globalThis.performance.now if available, otherwise Date.now(); measure in milliseconds and compute ops/sec as iterations / totalSeconds.
- Keep the benchmark lightweight so it can run in CI with small iteration counts for tests but also be usable locally with larger iterations for profiling.

## Files to modify

- src/lib/main.js: add benchmarkHamming export and minimal CLI subcommand handling for "benchmark".
- README.md: add a short usage snippet showing the CLI benchmark command and the JS API usage example.
- tests/unit/main.test.js: add small deterministic tests for benchmarkHamming and CLI invocation with low iteration counts.

## Notes

This feature is strictly optional for end-users of the library but provides maintainers and contributors a practical tool to guard performance regressions and compare implementation variants without external tooling.