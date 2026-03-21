# UNIT_TESTS

Summary

Add comprehensive unit tests in tests/unit/main.test.js that verify normal behaviour and edge cases for fizzBuzz and fizzBuzzSingle.

Specification

- Tests must import named exports from src/lib/main.js and assert exact outputs and thrown errors.
- Tests cover: standard sequences, the zero case, negative inputs, non-integers, non-number inputs, and export presence.
- Tests should be runnable with npm test and included in the test:unit command.

Acceptance Criteria

- [ ] A test file tests/unit/main.test.js exists and covers all specified behaviours.
- [ ] Tests assert fizzBuzz(15) result and individual fizzBuzzSingle cases listed in the mission.
- [ ] Tests assert error throwing for invalid inputs as defined in INPUT_VALIDATION.
- [ ] Running npm test exits with status 0 when implementation meets the spec.
