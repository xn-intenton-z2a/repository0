# FIZZBUZZ_EXAMPLES

Summary

Provide a small, focused examples and statistics feature that demonstrates canonical library usage across the public surface (fizzBuzz, fizzBuzzSingle and the additive helpers) and adds two small, testable helper exports: fizzBuzzStats and fizzBuzzGenerator. The examples are intended for reviewers and contributors to quickly verify behaviour without reading source code: concise README examples and a single runnable examples/simple-run.js script that prints deterministic JSON and basic stats. This feature is deliberately small so it can be implemented alongside existing features and tests in a single repository.

Specification

- Deliverables
  - README additions: two short usage examples in the README showing named imports from src/lib/main.js, one demonstrating fizzBuzzSingle and one demonstrating fizzBuzz with JSON output. Examples must be prose paragraphs and minimal code-like lines per repository conventions. Include a brief note describing the stats helper and the generator and how to run the examples script.
  - examples/simple-run.js: a tiny Node script that imports the library, runs fizzBuzz(15) and fizzBuzzSingle(3), prints the JSON array for fizzBuzz(15) to stdout and prints a JSON object of stats from fizzBuzzStats(15). The script must use only the exported named functions and must not reimplement fizzBuzz logic. It must exit 0 on success.
  - Library exports (additive): fizzBuzzStats(n) and fizzBuzzGenerator(n) exported from src/lib/main.js in addition to existing exports. fizzBuzzStats returns an object { fizz, buzz, fizzBuzz, numbers, total } counting occurrences for 1..n. fizzBuzzGenerator is a synchronous generator that yields the canonical strings for 1..n in order.

- Behaviour and constraints
  - Examples must import named exports from the library path used in tests (src/lib/main.js) and must rely on the canonical exports only; do not call internal helper files or assume alternate entry points.
  - The examples script must exit with code 0 on success and print deterministic JSON to stdout so unit tests can assert equality with programmatic outputs.
  - The new helper exports are strictly additive and must not change existing canonical behaviour or signatures of fizzBuzz and fizzBuzzSingle; implement them as thin wrappers around the canonical functions.
  - Validation rules for n in the new helpers must reuse the canonical validation rules (same error types and indicative message substrings for tests).

Testing guidance

- Unit tests (tests/unit/):
  - Add tests that import fizzBuzzStats and fizzBuzzGenerator from src/lib/main.js and assert exact counts for known inputs: fizzBuzzStats(15) returns { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }.
  - Assert fizzBuzzStats(0) returns zeroed counts and total 0.
  - Assert Array.from(fizzBuzzGenerator(5)) equals fizzBuzz(5).
  - Validate that passing invalid n to these helpers throws the same error types and contains the same indicative substrings as the canonical validation (for example "integer" or ">= 0" as appropriate).
  - Add a unit test that spawns node examples/simple-run.js and asserts exit code 0 and stdout contains valid JSON matching JSON.stringify(fizzBuzz(15)) and that the printed stats object matches fizzBuzzStats(15).

Acceptance criteria

- README contains two clear, short usage examples: (1) fizzBuzzSingle example returning Fizz for 3, (2) fizzBuzz example producing a 15-entry array ending with FizzBuzz and JSON usage note, plus a short note about the stats helper and generator.
- examples/simple-run.js exists and when run with node prints a JSON array equal to JSON.stringify(fizzBuzz(15)) and prints a JSON stats object equal to fizzBuzzStats(15); the script exits with code 0.
- fizzBuzzStats(15) returns exactly { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 } and fizzBuzzStats(0) returns counts zeroed with total 0.
- Array.from(fizzBuzzGenerator(5)) equals fizzBuzz(5).
- Unit tests cover the above behaviours and validations and pass.

Notes

- This feature is demonstrative and additive; it must not alter canonical library behaviour or existing exported function signatures.
- Keep examples minimal and readable; the examples script is for contributor onboarding and quick verification. Implementations should use only named exports from src/lib/main.js.

