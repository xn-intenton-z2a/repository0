# FIZZ_CORE

# Summary

Provide the canonical FizzBuzz library API required by the mission: two named exports from src/lib/main.js — fizzBuzz(n) and fizzBuzzSingle(n). This feature defines behaviour, edge-case handling, tests, and README examples to ensure a minimal, well-tested library suitable for use by the website and CLI.

# Motivation

The repository's mission is to offer a JavaScript library exporting FizzBuzz functions. This feature encodes the exact behaviour, edge cases, and acceptance criteria so the source, tests, and documentation can be implemented with high confidence.

# Scope

In-scope:
- Implementation of fizzBuzz(n) returning an array of strings from 1 to n with Fizz/Buzz/FizzBuzz substitutions.
- Implementation of fizzBuzzSingle(n) returning the FizzBuzz string for a single positive integer.
- Edge-case handling: n = 0 returns [], negative numbers throw RangeError, non-integers throw TypeError, zero or non-number types validated.
- Unit tests in tests/unit covering normal cases and all edge cases listed in the mission.
- README usage examples showing both functions.

Out-of-scope:
- Any extended options or customization (covered by a separate feature).
- Web UI or website examples beyond README usage (covered by separate feature).

# API

Exports (from src/lib/main.js):
- fizzBuzz(n): Array<string>
- fizzBuzzSingle(n): string

Behaviour details:
- Both functions accept a single argument n.
- If n is not a number, throw TypeError with a descriptive message.
- If n is not an integer, throw TypeError with a descriptive message.
- If n < 0, throw RangeError.
- fizzBuzz(0) returns an empty array.
- fizzBuzz(n) returns array of length n where index i (1-based) is fizzBuzzSingle(i).
- fizzBuzzSingle follows classic rules: multiples of 3 => "Fizz", multiples of 5 => "Buzz", multiples of both => "FizzBuzz", otherwise decimal string of number.

# Tests

Unit tests must cover:
- fizzBuzz(15) returns correct 15-element array ending with "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns [].
- TypeError thrown for non-number inputs (e.g., null, "5", 3.5).
- RangeError thrown for negative inputs (e.g., -1).

# Documentation

README examples showing:
- Importing named exports and calling fizzBuzz(15) and fizzBuzzSingle(3).
- Explanation of error behaviour.

# Acceptance Criteria

- fizzBuzz(15) returns the correct 15-element array ending with "FizzBuzz".
- fizzBuzzSingle(3) returns "Fizz".
- fizzBuzzSingle(5) returns "Buzz".
- fizzBuzzSingle(15) returns "FizzBuzz".
- fizzBuzzSingle(7) returns "7".
- fizzBuzz(0) returns [].
- All unit tests described above exist and pass.
- README documents usage with examples that run in Node >=24.

# Implementation Notes

- Place core logic in src/lib/main.js as named exports.
- Keep implementation minimal and dependency-free.
- Tests should live in tests/unit/main.test.js to match existing test patterns.