# README_EXAMPLES

Purpose

Specify the README examples and quickstart that demonstrate library usage for new users and validate the public API surface.

Content required

- Short top-level example showing named imports and calling fizzBuzz and fizzBuzzSingle.
- Example showing expected output for fizzBuzz(15) (an array ending with "FizzBuzz").
- Examples for error cases: calling fizzBuzzSingle with a negative number and a non-integer, showing the thrown error type.
- A brief CLI example (node src/lib/main.js) that prints fizzBuzz(15) to stdout.

Acceptance Criteria

- README contains a code usage example that imports { fizzBuzz, fizzBuzzSingle } from the library and prints results.
- README shows expected output for fizzBuzz(15) matching mission acceptance criteria.
- README documents error behavior for negative and non-integer inputs with the correct exception types.
- A short CLI usage example is present and accurate.

Notes

Examples must avoid unnecessary complexity and show only the minimal commands and code required to reproduce results.