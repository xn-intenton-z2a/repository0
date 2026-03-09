# FIZZBUZZ_FORMATTER

Summary

Add an optional formatter argument to the core fizzBuzz function to allow callers to customise how each item in the sequence is rendered. The formatter is a pure function called for every integer in the sequence and receives the integer and the default fizzbuzz string for that integer; it returns the string to be included in the output array. This feature keeps the default behaviour unchanged when the formatter is omitted and allows easy demonstration in the web example and README.

Rationale

Providing a formatter makes the library more flexible while preserving its simple core API. It supports demonstration scenarios on the website, makes testing deterministic, and remains implementable entirely within src/lib/main.js with accompanying unit tests and README examples.

Scope

- Extend the existing fizzBuzz(n) function signature to accept an optional second parameter formatter: fizzBuzz(n, formatter)
- The formatter is a function with signature (value, defaultString) => string
- If formatter is not provided, behaviour is identical to the existing fizzBuzz(n)
- Input validation rules remain unchanged: non-integer inputs throw TypeError, negative n throws RangeError, fizzBuzz(0) returns []
- Update unit tests in tests/unit to include tests for custom formatter behaviour and that the default behaviour is preserved when formatter is omitted
- Update README with usage example showing a formatter that prefixes index and value
- Demonstrate formatter in src/web example so the page can toggle between default rendering and formatted rendering

API Changes

- fizzBuzz(n, formatter?) -> Array<string>
  - n: positive integer (0 allowed returning [])
  - formatter: optional function (value: number, defaultString: string) => string
  - Behaviour: For each i from 1..n compute defaultString per fizzbuzz rules; then if formatter provided call formatter(i, defaultString) and include its return value in the result array; otherwise include defaultString.

Tests

- Unit tests must assert:
  - Default behaviour unchanged: fizzBuzz(15) returns the canonical array ending with FizzBuzz when no formatter is passed
  - Formatter is called for every element when provided and its return values are used
  - A sample formatter that returns `${i}:${defaultString}` produces expected outputs for n=5 and n=15
  - Passing a non-function as formatter results in a TypeError
  - Edge-case behaviours: fizzBuzz(0, formatter) returns [] and does not call formatter
  - Existing tests for fizzBuzzSingle remain unchanged

Acceptance Criteria

- fizzBuzz remains exported as a named export and accepts an optional formatter without breaking existing tests
- New unit tests covering formatter behaviour are added and pass
- README contains a short example showing usage of the formatter
- The web example demonstrates toggling to formatted output and shows formatted list for n=15 ending with a formatted FizzBuzz entry

Implementation Notes

- Keep the change minimal: modify src/lib/main.js to accept and validate an optional second parameter and to call it when present
- Do not change the behaviour of fizzBuzzSingle
- Add minimal unit tests to tests/unit to cover the new behaviour; reuse existing test patterns
- Avoid external dependencies; implement in plain JavaScript

Backward Compatibility

- When formatter is omitted, the function must behave exactly as before and all existing tests should remain valid.
