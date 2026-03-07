# FIZZBUZZ_BENCH

## Overview
Provide a small benchmarking utility for the FizzBuzz library to measure execution time and throughput for the core fizzBuzz implementation in realistic, local environments. The feature adds a non-invasive, optional benchmark helper that can be used in tests, examples, or by consumers who want a performance sanity-check.

## Specification
- Export a benchmark helper from src/lib/main.js named benchmarkFizzBuzz that accepts the arguments:
  - n (integer): the upper bound for fizzBuzz, same validation rules as fizzBuzz.
  - iterations (positive integer, optional, default 100): how many times to run the fizzBuzz function for averaging.
  - options (optional object): may include warmup boolean (default true) to run a single warmup invocation before measuring.
- Behaviour:
  - Validate inputs as for core functions: non-integers throw TypeError, negative n throws RangeError, iterations must be positive integer else TypeError.
  - If n is 0, return a measured result with zero-work timings (should be small but valid number).
  - Perform an optional warmup run if requested, then run fizzBuzz n iterations times, measuring wall-clock time using a high-resolution timer (performance.now or process.hrtime depending on environment).
  - Return an object with fields: iterations, totalMs, avgMs, opsPerSecond, n.
  - The function must not modify library state or exports and must be side-effect free except for any synchronous console.debug output (optional).
- Implementation notes:
  - Keep implementation local to src/lib/main.js to satisfy single-file constraint. Use a minimal dependency-free approach (no new packages).
  - Ensure the function is efficient and uses an in-process timer for accuracy.

## Tests
- Add unit tests in tests/unit to assert:
  - benchmarkFizzBuzz is a named export on the module.
  - Calling benchmarkFizzBuzz(15, 5) returns an object with keys iterations, totalMs, avgMs, opsPerSecond, n and numeric values > 0 (avgMs may be small but should be numeric).
  - Input validation: non-integer or negative n throws the same TypeError/RangeError rules; invalid iterations throws TypeError.
  - Running benchmarkFizzBuzz(0, 1) returns a valid numeric timing object.
  - Benchmark runs do not change the behaviour of fizzBuzz or fizzBuzzSingle (sanity checks before and after a run).

## Acceptance Criteria
- The repository exports benchmarkFizzBuzz as a named export from src/lib/main.js.
- Unit tests for benchmarkFizzBuzz exist and pass under npm test.
- Benchmark helper is documented in README.md's Usage or Examples section and appears in examples/ as an optional benchmark script if desired.

## Notes
- This feature is optional and non-critical to correctness; it is intended for local developer convenience and CI sanity checks when timing variability is acceptable.
- Keep the implementation minimal and dependency-free so it remains easy to maintain and test.
