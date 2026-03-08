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