# FIZZBUZZ_STREAM

Summary

Add a memory-efficient generator API that yields FizzBuzz outputs one-at-a-time for large or streaming use-cases. The feature introduces a named export fizzBuzzStream(n) in src/lib/main.js which returns a synchronous iterable (generator) producing the canonical FizzBuzz strings for values 1..n without allocating the full array in memory.

Rationale

The core fizzBuzz(n) returns an array which is simple and correct but may be inefficient for very large n or streaming consumers. A generator-based API allows consumers (CLI, web demo, tests) to iterate results lazily, reducing peak memory usage and enabling piping to streaming outputs or frameworks that consume iterables.

Scope

- Add a new named export fizzBuzzStream to src/lib/main.js with the signature: function* fizzBuzzStream(n)
- The generator yields exactly the same strings that fizzBuzz(n) would include, in order, for i from 1 through n
- Input validation mirrors fizzBuzz: non-integer inputs must throw TypeError, negative n must throw RangeError, n = 0 results in a generator that yields nothing
- Update unit tests in tests/unit to include tests that consume the generator and assert equivalence to Array.from(fizzBuzzStream(n)) and to the existing fizzBuzz(n) behaviour for relevant n values
- Demonstrate usage in the CLI and web example by showing how to consume the generator to stream output instead of building an array (examples in README and src/web)

API

- fizzBuzzStream(n) -> Iterable<string>
  - n: integer >= 0 (0 allowed; generator yields nothing)
  - Behaviour: Synchronously yields the FizzBuzz string for each integer i in 1..n using the same rules as fizzBuzzSingle
  - Errors: If n is not an integer, throw TypeError; if n is negative, throw RangeError

Tests

- Unit tests must verify:
  - Array.from(fizzBuzzStream(15)) equals fizzBuzz(15) and has 15 elements ending with FizzBuzz
  - Consuming fizzBuzzStream(0) yields no values
  - fizzBuzzStream throws TypeError for non-integer inputs
  - fizzBuzzStream throws RangeError for negative inputs
  - Iteration order and values match fizzBuzzSingle for sample inputs (3 -> Fizz, 5 -> Buzz, 15 -> FizzBuzz, 7 -> "7")

Acceptance Criteria

- fizzBuzzStream is exported as a named export from src/lib/main.js
- Tests cover generator behaviour and pass in CI
- README contains a short example showing how to iterate the generator and demonstrates streaming output for n=15
- CLI and web example contain example code or comments showing how to consume the iterable to stream output

Implementation Notes

- Implement fizzBuzzStream as a small generator using the same internal logic as fizzBuzzSingle to avoid duplication of rules
- Keep changes constrained to src/lib/main.js, tests in tests/unit, README examples, and small updates to src/web for demonstration
- Do not introduce runtime dependencies; implement with plain JavaScript generator functions

Backward Compatibility

- The existing fizzBuzz and fizzBuzzSingle exports remain unchanged and continue to behave as before
- The new generator API is additive and optional for consumers who need streaming behaviour
