# FIZZBUZZ_STREAM

## Overview
Introduce a streaming API for FizzBuzz to support memory-efficient, incremental consumption of results in both library and CLI contexts. The feature adds an async-generator based fizzBuzzStream(n) export plus an optional Node Readable wrapper helper createFizzBuzzReadable(n) implemented in src/lib/main.js, and tests that assert parity with the existing fizzBuzz and fizzBuzzSingle behaviour and the same error handling rules.

## Specification
- Exports:
  - fizzBuzzStream(n): an async generator that yields strings for each integer from 1 to n in order. For each value, yield "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, otherwise the numeric string.
  - createFizzBuzzReadable(n): a convenience function that returns a Node.js Readable stream (objectMode: true) that emits the same strings produced by fizzBuzzStream for environments that prefer streams.
- Behaviour and validation (same rules as core functions):
  - If n is 0, the generator ends immediately and the returned Readable emits no data.
  - If n is negative, throw RangeError synchronously when the generator function is first called or when createFizzBuzzReadable is invoked.
  - If n is not an integer, throw TypeError synchronously.
  - The generator yields results in increasing order and completes after yielding the value for n.
- Implementation notes:
  - Implement fizzBuzzStream as an async generator function to allow awaiting between yields if desired by callers; the actual implementation can be synchronous but must be declared async to support future async sources.
  - Implement createFizzBuzzReadable using stream.Readable.from or by constructing a Readable that iterates the async generator; ensure objectMode is set so each emitted chunk is a string.
  - Keep both functions as named exports in src/lib/main.js alongside fizzBuzz and fizzBuzzSingle.
  - Do not change existing API signatures for fizzBuzz or fizzBuzzSingle.

## Tests
- Unit tests to add/extend in tests/unit:
  - Verify that collecting all values from fizzBuzzStream(15) yields the same 15-element array as fizzBuzz(15).
  - Verify that consuming createFizzBuzzReadable(15) produces the same sequence of strings in order (can be gathered by piping to an array in tests or collecting 'data' events).
  - Edge cases: fizzBuzzStream(0) yields no values; createFizzBuzzReadable(0) emits no data.
  - Error cases: calling fizzBuzzStream with a negative integer or non-integer must throw the same errors as fizzBuzz (RangeError / TypeError). For createFizzBuzzReadable, invoking with invalid input should throw before returning the stream.
  - Ensure named exports exist on the module: fizzBuzzStream and createFizzBuzzReadable are present.

## Acceptance Criteria
- The repository exports fizzBuzzStream and createFizzBuzzReadable as named exports from src/lib/main.js.
- fizzBuzzStream(15) yields the same sequence as fizzBuzz(15) and fizzBuzzSingle produces matching single values for spot checks.
- fizzBuzzStream(0) completes without yielding; createFizzBuzzReadable(0) emits no data.
- Passing negative or non-integer n to either function results in RangeError or TypeError respectively, matching core behaviour.
- Unit tests for all above behaviours are present in tests/unit and pass under npm test.

## Notes
- This feature is implementable entirely within src/lib/main.js and tests under tests/unit; no additional files are required.
- The CLI feature (if present) may optionally add a --stream flag to print results as they are produced; this is recommended but optional and should be implemented in the CLI feature file if desired.
