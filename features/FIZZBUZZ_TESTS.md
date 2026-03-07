# FIZZBUZZ_EXAMPLES

## Overview
Provide clear, runnable examples and documentation snippets that demonstrate how to use the FizzBuzz library from code, the CLI, and streaming/stream-compatible APIs. Examples should be small, copy-pasteable, and placed where users expect them: README usage section and the examples/ directory. This feature also preserves the existing unit test requirements so behaviour is fully specified and verifiable.

## Specification
- README usage: add a concise "Usage" section to README.md showing examples for:
  - Importing named exports fizzBuzz and fizzBuzzSingle and calling them from a script.
  - Using the optional fizzBuzzStream and createFizzBuzzReadable APIs to consume results incrementally.
  - Invoking the CLI (npm run start:cli) in single and range modes with sample commands and expected output.
- examples/: add small example scripts (examples/fizz-range.js, examples/fizz-single.js, examples/fizz-stream.js) that demonstrate programmatic use and can be run with node to produce the expected outputs.
- Example style: keep each example under 40 lines, use only the library's public API, and include expected output comments so readers can verify behaviour.
- Backwards-compatibility: examples must use named imports from src/lib/main.js and must not rely on unpublished or undocumented APIs.
- Tests and docs parity: examples must reflect the authoritative behaviour described in the unit tests and MISSION.md.

## Streaming API (integrated)
- Exports to support streaming (if implemented in src/lib/main.js):
  - fizzBuzzStream(n): an async generator that yields strings for each integer from 1 to n: "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both, otherwise the numeric string.
  - createFizzBuzzReadable(n): returns a Node.js Readable stream (objectMode: true) that emits the same strings produced by fizzBuzzStream.
- Behaviour and validation (same rules as core functions):
  - fizzBuzzStream(0) ends immediately; createFizzBuzzReadable(0) emits no data.
  - Negative n throws RangeError synchronously; non-integers throw TypeError.
  - The generator yields results in increasing order and completes after yielding for n.
- Implementation notes:
  - fizzBuzzStream should be an async generator to allow for future async sources.
  - createFizzBuzzReadable may be implemented with stream.Readable.from or by wrapping the async generator; ensure objectMode is set.

## Tests
- Unit tests should assert:
  - Basic outputs: multiples of 3 -> "Fizz", multiples of 5 -> "Buzz", multiples of both -> "FizzBuzz".
  - fizzBuzz(0) returns empty array; negative inputs throw RangeError; non-integers throw TypeError.
  - fizzBuzzStream(15) yields the same 15-element array as fizzBuzz(15) when collected.
  - Consuming createFizzBuzzReadable(15) produces the same sequence of strings in order.
  - fizzBuzzStream(0) and createFizzBuzzReadable(0) produce no output.
  - Invalid inputs to streaming functions throw the same errors as core functions.
  - The examples in examples/ run without throwing and produce the documented output; tests may run the scripts or import them and capture output.
  - Assert fizzBuzz and fizzBuzzSingle are named exports on the module and streaming exports exist when implemented.

## Acceptance Criteria
- README.md contains a Usage section with copy-paste examples for fizzBuzz, fizzBuzzSingle, CLI usage, and streaming usage if available.
- examples/ contains runnable example scripts demonstrating programmatic and streaming usage.
- Unit tests cover the functional scenarios listed and pass under npm test.
- Basic integration test asserts that each example script runs and exits successfully and that its console output contains the documented example output.

## Notes
- Implementable within this repository by editing README.md, adding small example scripts under examples/, and extending tests in tests/unit. No API changes are required to the core functions; examples must use the public exports described in MISSION.md and FIZZBUZZ_CORE.
- Keep examples minimal and focused on teaching usage rather than exhaustive behaviour.
