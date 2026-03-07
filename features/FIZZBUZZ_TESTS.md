# FIZZBUZZ_TESTS

## Overview
Define a clear unit test plan and required test cases for the FizzBuzz library to ensure correctness and edge-case coverage. Tests should live in tests/unit and run under the existing test script.

## Specification
- Ensure tests cover: basic outputs, multiples of 3, multiples of 5, multiples of both, zero, negative inputs (RangeError), non-integer inputs (TypeError), and very large but reasonable n values.
- Add tests that assert exported functions are named exports on the module and that the CLI script is callable without silent failures.

## Acceptance Criteria
- Tests run with npm test and cover the scenarios listed.
- Any modifications to tests keep existing test structure and use Vitest.