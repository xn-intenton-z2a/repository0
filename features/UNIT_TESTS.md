# UNIT_TESTS

## Summary

Provide a comprehensive unit test suite that verifies normal operation and all edge cases for fizzBuzz and fizzBuzzSingle. Tests live under tests/unit/ and are runnable via the repository test script.

## Specification

- Create tests that assert the exact output of fizzBuzz for common sizes (including 1, 3, 5, 15).
- Create tests that assert fizzBuzzSingle for representative inputs (3, 5, 15, 7).
- Create tests for input validation: zero, negative integers, non-integer numbers, and non-number types.
- Include at least one test asserting fizzBuzz(0) returns an empty array.
- Keep tests deterministic and not dependent on external services.

## Acceptance criteria

- A tests/unit/main.test.js file exists and contains tests covering normal and edge behaviour described above.
- Running npm test exits with success and all new tests pass.
- The tests assert the specific sequences and error types described in the mission acceptance criteria.
