# FIZZBUZZ_TESTS

# Summary

Define a tight, machine-verifiable test feature that specifies the unit and behaviour tests required to validate the canonical fizzBuzz library exports and the CLI and web demo behaviours. Tests must be deterministic, runnable with the existing npm test and npm run test:behaviour scripts, and reference exact file paths and messages so automated CI can assert compliance.

# Specification

This feature mandates a set of unit and behaviour tests with explicit file locations, exact expectations and error message substrings. Tests must follow the repository conventions (Vitest for unit tests, Playwright for behaviour tests) and avoid timing-dependent assertions.

Unit tests

- Location: tests/unit/fizzbuzz.test.js
- Purpose: Verify canonical exports exist and behave exactly as specified in FIZZBUZZ_CORE and acceptance criteria in MISSION.md.
- Assertions (exact):
  - fizzBuzz is a named export and calling fizzBuzz(15) returns an array of length 15 whose last element equals the exact string FizzBuzz.
  - fizzBuzzSingle(3) returns the exact string Fizz.
  - fizzBuzzSingle(5) returns the exact string Buzz.
  - fizzBuzzSingle(15) returns the exact string FizzBuzz.
  - fizzBuzzSingle(7) returns the exact string 7.
  - fizzBuzz(0) returns an empty array.
  - Calling fizzBuzz with a non-number like the string 10 throws TypeError and the error message includes the substring number.
  - Calling fizzBuzz with NaN or Infinity throws TypeError and message includes finite.
  - Calling fizzBuzz with a non-integer such as 1.5 throws TypeError and message includes integer.
  - Calling fizzBuzz with a negative integer such as -1 throws RangeError and the error message includes >= 0.
  - fizzBuzzFormatted and fizzBuzzSingleFormatted apply a provided formatter function and throw TypeError when formatter is not a function.
  - fizzBuzzStats(15) returns an object equal to { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }.
  - Array.from(fizzBuzzGenerator(5)) strictly equals fizzBuzz(5) (deep equality).
  - fizzBuzzWithWords(15, { fizz: 'Foo', buzz: 'Bar' }) returns an array where canonical positions for Fizz, Buzz and FizzBuzz contain Foo, Bar and FooBar respectively and calling fizzBuzz(15) afterwards still returns canonical values (no mutation).

Behaviour tests (web and CLI)

- CLI behaviour tests
  - Location: tests/behaviour/cli.test.js (or equivalent Playwright/node script used by test harness)
  - Assertions:
    - Running node src/lib/main.js 15 exits with code 0 and stdout contains exactly 15 newline-separated entries with the final line exactly FizzBuzz.
    - Running node src/lib/main.js 15 --format=json exits 0 and stdout is valid JSON equal to JSON.stringify(fizzBuzz(15)).
    - Running node src/lib/main.js 15 --labels fizz=Foo,buzz=Bar exits 0 and stdout shows Foo, Bar and FooBar at canonical positions and does not change the canonical output from fizzBuzz(15) when called programmatically.
    - Running without args prints a concise usage message to stdout and exits 0. Invalid input prints an error to stderr and exits non-zero.

- Web demo behaviour tests
  - Location: tests/behaviour/web.demo.test.js (Playwright)
  - Precondition: run npm run build:web to copy src/web demo into docs/ as required by existing build script.
  - Assertions:
    - Opening the demo page and entering 15 with one-per-line output shows 15 lines and the last line equals FizzBuzz.
    - Selecting JSON output and rendering produces a JSON string that, when parsed, equals the programmatic output of fizzBuzz(15) imported into the test harness.
    - Entering labels fizz=Foo and buzz=Bar displays Foo, Bar and FooBar in the correct positions.
    - The demo shows an accessible validation message and prevents rendering when n is invalid (empty, non-integer, negative).

Testing guidance and stability

- Tests must assert exact strings where specified and check for substring matches in error messages (for example message includes number, finite, integer, or >= 0).
- Avoid fragile timing assertions; wait for DOM stability in Playwright using built-in waitFor methods when asserting dynamic content.
- Unit tests should import named exports directly from src/lib/main.js and perform deep equality checks using strict deep equality utilities provided by Vitest.

Acceptance criteria

- All unit tests pass under npm test and verify the exact assertions listed above.
- Behaviour tests pass under npm run test:behaviour and validate both CLI and web demo behaviours as described.
- README and examples scripts referenced by FIZZBUZZ_EXAMPLES remain unchanged and the examples script output is asserted by at least one integration-style test.

Notes

- This feature document does not add new helper functions; it standardises the test surface and exact expectations so automated tooling and CI can verify compliance with the mission. Tests should be small, explicit and avoid adding new test frameworks or dependencies.
