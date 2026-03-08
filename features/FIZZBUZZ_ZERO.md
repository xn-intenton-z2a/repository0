# FIZZBUZZ_ZERO

Summary

Specify canonical handling for zero and edge-case numeric inputs so the library behaviour matches the mission: fizzBuzz(0) must return an empty array; negative numbers must throw RangeError; non-integer numeric inputs must throw TypeError. This feature documents precise validation semantics, unit test expectations and guidance for implementation as a small, local change in src/lib/main.js and accompanying unit tests.

Specification

- Behaviour:
  - fizzBuzz(0) returns [] (an empty array) without throwing.
  - fizzBuzzSingle(0) is not defined for the single-value API; callers should use fizzBuzz and read index 0 if needed. Implementations may throw RangeError for fizzBuzzSingle(0) if single-value semantics require n >= 1; tests must document which behaviour is chosen.
  - For any negative integer n (n < 0) functions must throw new RangeError('n must be >= 0') — message must include the substring '>= 0' for test assertions.
  - For non-integer numeric values (for example 3.5, NaN, Infinity) functions must throw new TypeError('n must be an integer') — message must include the substring 'integer' so tests can assert on it.
  - For non-number types (string, null, undefined, object) functions must throw new TypeError('n must be a number').

- Validation rules (concise):
  - If typeof n !== 'number' -> throw TypeError('n must be a number')
  - If Number.isNaN(n) or !Number.isFinite(n) -> throw TypeError('n must be an integer')
  - If !Number.isInteger(n) -> throw TypeError('n must be an integer')
  - If n < 0 -> throw RangeError('n must be >= 0')
  - Accept n === 0 and return an empty array from fizzBuzz(0)

- Compatibility note:
  - This feature is intentionally conservative: it preserves canonical fizzBuzz output semantics while explicitly allowing the zero-length case for array-producing APIs. It must not change the content values (Fizz, Buzz, FizzBuzz) or their positions for positive n.

Testing guidance

- Unit tests (tests/unit/) should be added or updated to assert exact behaviours:
  - fizzBuzz(0) returns []
  - fizzBuzz(15) unchanged and ends with "FizzBuzz"
  - fizzBuzzSingle(3) === "Fizz"; fizzBuzzSingle(5) === "Buzz"; fizzBuzzSingle(15) === "FizzBuzz"
  - Passing a negative integer (e.g., -1) throws RangeError and the message contains '>= 0'
  - Passing a non-integer number (e.g., 3.5) throws TypeError and message contains 'integer'
  - Passing non-number types (e.g., '5', null) throws TypeError and message contains 'number'

Acceptance criteria

- fizzBuzz(0) returns an empty array and does not throw.
- Existing positive-number behaviour is unchanged and all previous fizz/buzz acceptance criteria still hold.
- Error types and messages match the validation rules above so tests can assert on error type and a substring of the message.
- Unit tests covering the above behaviours are present in tests/unit/ and pass in CI.

Implementation notes

- Implement validation as a small central check in src/lib/main.js reused by all exported helpers so the error types and messages are consistent.
- Keep change minimal: allow zero as a special-case accepted value for array-producing APIs and keep all canonical replacement logic untouched.
- Update README examples if they reference behaviour for n=0 to document that fizzBuzz(0) yields an empty array.

