# FIZZBUZZ_TEST_SUITE

## Summary

Add a focused, high-quality unit test suite and README examples for the core fizz-buzz library to ensure the mission acceptance criteria are fully covered and easily verified. This feature complements the FIZZBUZZ_WEB_DEMO feature by strengthening API-level tests and documentation examples without changing library exports.

## Goals

- Ensure fizzBuzz and fizzBuzzSingle are validated for normal cases and all edge cases specified in MISSION.md.
- Provide deterministic, minimal tests that run quickly under the existing test script and that assert exact output shapes and error types.
- Add README usage examples that mirror test inputs so users and CI can reproduce results easily.

## Scope

Files to update or create in-repo as part of this feature (single-source constraint):
- tests/unit/main.test.js — Expand or create tests covering the acceptance criteria and error conditions.
- README.md — Add a short Examples section showing library usage and the CLI examples referenced by the web demo feature.

This feature must not change src/lib/main.js exports or behaviour; tests may import and call named exports only.

## Acceptance Criteria

1. Unit tests include assertions for the following behaviours and pass under npm test:
   - fizzBuzz(15) returns an array of 15 strings with the final element equal to FizzBuzz.
   - fizzBuzzSingle(3) returns the string Fizz.
   - fizzBuzzSingle(5) returns the string Buzz.
   - fizzBuzzSingle(15) returns the string FizzBuzz.
   - fizzBuzzSingle(7) returns the string 7.
   - fizzBuzz(0) returns an empty array.
   - fizzBuzz and fizzBuzzSingle throw RangeError when passed negative integers.
   - fizzBuzz and fizzBuzzSingle throw TypeError when passed non-integer values (e.g., 1.5 or a string).
2. README.md contains an Examples section showing:
   - Importing fizzBuzz and fizzBuzzSingle and calling them programmatically.
   - CLI examples: node src/lib/main.js --n 15 and node src/lib/main.js --single 7 with expected output snippets.
3. Tests are concise, deterministic, and limited to tests/unit/main.test.js; they run under the repository's existing npm test script.

## Implementation Notes

- Tests should use strict equality checks for strings and arrays where applicable.
- Use Vitest test style consistent with existing tests in the repository.
- Keep tests small and focused; do not add new helper libraries or test frameworks.

## Rationale

Improving the unit test coverage directly supports the mission by guaranteeing the core FizzBuzz behaviour and edge-case handling are correct and auditable. Clear README examples make it trivial for humans and CI to verify the library quickly.
