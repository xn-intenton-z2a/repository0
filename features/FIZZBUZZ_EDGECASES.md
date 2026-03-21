# FIZZBUZZ_EDGECASES

Goal

Specify tests and README examples covering edge cases and error handling for the FizzBuzz library.

Specification

- Define unit tests that assert input validation: non-integers cause TypeError, negative integers cause RangeError, and zero returns an empty array.
- Add README usage examples for both functions showing typical usage and expected outputs for 0, 1, 3, 5, 15.
- Ensure tests assert exact string outputs (e.g., "7" not 7) and cover boundary inputs like 1 and 2.

Acceptance Criteria

- fizzBuzz(0) returns [] and is documented in README examples.
- Tests assert TypeError for fizzBuzzSingle(1.5) and RangeError for fizzBuzzSingle(-1).
- README includes minimal code examples demonstrating both functions and their expected outputs.