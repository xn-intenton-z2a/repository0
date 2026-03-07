# FIZZBUZZ_EXAMPLES

## Overview
Provide clear, runnable examples and documentation snippets that demonstrate how to use the FizzBuzz library from code, the CLI, and streaming/stream-compatible APIs. Examples should be small, copy-pasteable, and placed where users expect them: README usage section and the examples/ directory. This feature also preserves the existing unit test requirements so behaviour is fully specified and verifiable.

## Specification
- README usage: add a concise "Usage" section to README.md showing examples for:
  - Importing named exports fizzBuzz and fizzBuzzSingle and calling them from a script.
  - Using the optional fizzBuzzStream and createFizzBuzzReadable APIs (if present) to consume results incrementally.
  - Invoking the CLI (npm run start:cli) in single and range modes with sample commands and expected output.
- examples/: add small example scripts (examples/fizz-range.js, examples/fizz-single.js, examples/fizz-stream.js) that demonstrate programmatic use and can be run with node to produce the expected outputs.
- Example style: each example should be less than 40 lines, use only the library's public API, and include expected output comments so readers can verify behaviour.
- Backwards-compatibility: examples must use named imports from src/lib/main.js and must not rely on unpublished or undocumented APIs.
- Tests and docs parity: examples must reflect the authoritative behaviour described in the unit tests and MISSION.md (Fizz/Buzz/FizzBuzz rules and error handling).

## Tests
- Preserve and continue to enforce unit test requirements from the original tests plan:
  - Cover basic outputs, multiples of 3, multiples of 5, multiples of both, zero, negative inputs (RangeError), non-integer inputs (TypeError), and large but reasonable n values.
  - Assert that fizzBuzz and fizzBuzzSingle are named exports on the module.
  - Assert that CLI invocation surface (exported helpers or script) is callable and reports errors for invalid input.
- Add lightweight integration checks that the examples run without throwing and produce the documented output; these checks may be simple Node-run invocations executed by tests or by an examples-check test harness.

## Acceptance Criteria
- README.md contains a Usage section with copy-paste examples for fizzBuzz, fizzBuzzSingle, and CLI usage.
- examples/ contains runnable example scripts that demonstrate programmatic and streaming usage (if streaming APIs exist).
- Unit tests cover the functional scenarios listed and pass under npm test.
- A basic integration test asserts that each example script runs and exits successfully and that its console output contains the documented example output.

## Notes
- Implementable within this repository by editing README.md, adding small example scripts under examples/, and extending tests in tests/unit. No API changes are required; examples must use the public exports described in MISSION.md and FIZZBUZZ_CORE.
- Keep examples minimal and focused on teaching usage rather than exhaustive behaviour.
