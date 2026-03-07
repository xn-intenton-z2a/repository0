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


# FIZZBUZZ_RULES

## Overview
Add an extensible, in-process rules API that lets callers produce FizzBuzz-like outputs from a configurable ordered list of divisor-to-token mappings. This enables users to add or change rules (for example adding 7->"Bazz") without changing the core algorithm, while keeping the default behavior identical to the canonical FizzBuzz rules.

## Specification
- Expose two optional named exports from src/lib/main.js:
  - createFizzRules(rules): a factory that returns a function rulesFizz(n) which behaves like fizzBuzz but uses the provided rules.
  - defaultRules: a frozen array representing the default ordered rules [{divisor:3, token:'Fizz'}, {divisor:5, token:'Buzz'}].
- Rules input:
  - rules is an array of objects each with integer divisor > 0 and string token.
  - createFizzRules validates rules: non-array or items missing divisor/token or non-integer/divisor<=0 or non-string token should throw TypeError.
  - The returned rulesFizz has the same input validation semantics as fizzBuzz (n=0 returns [], negative RangeError, non-integer TypeError).
- Behaviour:
  - For each integer i from 1..n, iterate the ordered rules and append token when i % divisor === 0; if multiple tokens appended concatenate them in rules order; if no tokens appended, output the numeric string for i.
  - When createFizzRules is passed the defaultRules it must behave identically to existing fizzBuzz.
  - The rules API must be pure and not mutate input rule arrays or the defaultRules export.
- Implementation notes:
  - Implement this in src/lib/main.js as a small helper that reuses the same per-number logic as fizzBuzz to avoid duplication.
  - Keep implementation dependency-free and synchronous to match the rest of the library.
  - Document expected structure of rules in README and examples.

## Tests
- Add unit tests in tests/unit to assert:
  - defaultRules is exported and equals [{divisor:3, token:'Fizz'}, {divisor:5, token:'Buzz'}] (order-sensitive) and is frozen (cannot be mutated).
  - createFizzRules returns a function; calling createFizzRules(defaultRules)(15) returns identical array to fizzBuzz(15).
  - createFizzRules accepts custom rules like [{divisor:7, token:'Bazz'}] and produces expected tokens (e.g., where 7 -> 'Bazz').
  - Validation: passing invalid rules to createFizzRules throws TypeError; passing invalid n to returned rulesFizz throws same TypeError/RangeError semantics as core functions.
  - The API does not mutate the provided rules array or defaultRules (assert object identity and immutability where applicable).
  - Edge cases: n=0 returns [] for rulesFizz; large n behaves consistently with performance expectations in unit scope.

## Acceptance Criteria
- src/lib/main.js exports createFizzRules and defaultRules as named exports alongside fizzBuzz and fizzBuzzSingle.
- createFizzRules(defaultRules)(15) is identical to fizzBuzz(15) in output for canonical cases.
- Unit tests for the rules API are present and pass under npm test.
- README includes a short Usage example describing how to create and use a custom rule set and references defaultRules.

## Notes
- This enhancement keeps the core API stable while enabling flexible rule composition entirely within the single source file.
- Implementation and tests must be limited to changes in src/lib/main.js, tests/unit/*, README.md, and examples/ to stay within repository constraints.