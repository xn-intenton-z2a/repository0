FIZZBUZZ_EXAMPLES

# Summary

Provide a focused, testable examples feature that demonstrates canonical library usage and adds two thin, testable helper exports: fizzBuzzStats and fizzBuzzGenerator. This feature supplies examples suitable for unit and behaviour tests, a small examples script under examples/, and concise README examples. All behaviour must be additive and reuse the canonical exports from src/lib/main.js.

# Specification

Public exports (src/lib/main.js)

- fizzBuzzStats(n)
  - Returns an object with counts: { fizz, buzz, fizzBuzz, numbers, total } representing occurrences in 1..n.
  - Behaviour: for n === 0 return zeros and total 0. For n > 0 compute exact counts and total.
  - Validation: reuse canonical validation for n (same error types and message substrings as fizzBuzz).

- fizzBuzzGenerator(n)
  - A synchronous generator that yields the canonical string or number representation for each integer from 1..n in order.
  - Behaviour: Array.from(fizzBuzzGenerator(n)) must equal fizzBuzz(n).
  - Validation: reuse canonical validation for n.

Examples script (examples/simple-run.js)

- A tiny Node script that imports the library's named exports and does the following when executed:
  - Obtain sequence = fizzBuzz(15) and print the JSON-serialised sequence to stdout.
  - Obtain stats = fizzBuzzStats(15) and print the JSON-serialised stats to stdout.
  - Exit with code 0 on success.
- Script must rely exclusively on the library exports and not reimplement FizzBuzz logic.

README additions

- Two short usage examples as prose (no fenced code blocks):
  - Example 1: fizzBuzzSingle(3) returns Fizz and show the canonical single-value behaviour.
  - Example 2: fizzBuzz(15) returns a 15-element sequence ending with FizzBuzz and mention how to run examples/simple-run.js.
- One-line note mentioning fizzBuzzStats and fizzBuzzGenerator and where to find the examples script.

# Testing guidance

- Unit tests (tests/unit/) must import fizzBuzzStats and fizzBuzzGenerator from src/lib/main.js and assert exact outputs and thrown errors for invalid inputs:
  - fizzBuzzStats(15) must equal { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }.
  - fizzBuzzStats(0) must return zeros and total 0.
  - Array.from(fizzBuzzGenerator(5)) must equal fizzBuzz(5).
  - Invalid n values (non-number, non-integer, negative) must throw the same error types and message substrings used by the canonical validation.
- Integration test: spawn examples/simple-run.js and assert it exits 0 and that stdout contains JSON matching JSON.stringify(fizzBuzz(15)) and the stats object matches fizzBuzzStats(15).

# Acceptance criteria

- src/lib/main.js exports fizzBuzzStats and fizzBuzzGenerator with the specified behaviour and validation.
- examples/simple-run.js exists in the repository and prints deterministic JSON for fizzBuzz(15) and the stats object and exits 0.
- README includes the two concise examples described and references the examples script.
- Unit tests cover the helper functions, the generator equivalence, examples script output, and validation behaviour for invalid inputs.

# Notes

- All new behaviour must be additive and must not change existing canonical exports or their behaviour.
- Implement helpers by delegating to the canonical functions to ensure consistent validation and output.
- Keep the examples script minimal and deterministic to ease CI assertions.


FIZZBUZZ_README

# Summary

Ensure README.md documents the canonical API, usage examples, CLI and web demo pointers, and how to run tests and examples. The README must be precise, minimal, and suitable for automated checks that assert the presence of key usage strings and commands.

# Specification

- Update README.md to include the following sections, written as plain prose paragraphs (no fenced code blocks):
  - API summary listing exported functions: fizzBuzz(n), fizzBuzzSingle(n), fizzBuzzFormatted(n, formatter), fizzBuzzSingleFormatted(n, formatter), fizzBuzzStats(n) and fizzBuzzGenerator(n). Briefly state their purpose in one sentence each.
  - Usage examples as prose showing how to call fizzBuzzSingle(3) and what it returns, and describing that fizzBuzz(15) returns a 15-element sequence ending with FizzBuzz. Include a one-line instruction mentioning examples/simple-run.js and node src/lib/main.js 15 for the CLI demo.
  - How to run tests: mention npm test and npm run test:unit and that test suite asserts validation and edge cases.
  - Web demo note: mention that a static demo exists under src/web/ and is copied into docs/ by npm run build:web; suggest opening docs/fizzbuzz-demo.html after npm run build:web or using npm run start.
  - Contribution note: short line directing readers to CONTRIBUTING.md for contribution guidelines.

- Text requirements for automation checks:
  - README.md must contain the substring fizzBuzz(15).
  - README.md must contain the substring fizzBuzzSingle(3).
  - README.md must mention examples/simple-run.js or node src/lib/main.js 15.
  - README.md must mention npm test.

- Style constraints:
  - Keep prose concise, one or two sentences per bullet point.
  - Do not include fenced code blocks; examples must be inline prose to keep README small and parseable.
  - Do not change other files; this feature only requires editing README.md content.

# Testing guidance

- Automated checks will assert README.md contains the required substrings and that the prose describes the functions listed in the API summary.
- No unit tests are required for README changes, but the examples/simple-run.js integration test will reference README for human guidance.

# Acceptance criteria

- README.md contains a concise API summary listing the named exports and one-line descriptions.
- README.md contains the usage prose including fizzBuzzSingle(3) and fizzBuzz(15) statements and references to examples/simple-run.js or node src/lib/main.js 15.
- README.md mentions how to run tests (npm test) and how to build/view the web demo (npm run build:web and docs/).
- README.md satisfies the automation substring checks listed above.

# Notes

- This feature only modifies README.md and does not change library behaviour or tests.
- Keep the README changes minimal and focused to avoid altering unrelated project documentation.