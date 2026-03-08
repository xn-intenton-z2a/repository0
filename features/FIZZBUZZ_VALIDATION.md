# FIZZBUZZ_EXAMPLES

Summary

Provide a small, focused examples feature that demonstrates canonical library usage across the public surface (fizzBuzz, fizzBuzzSingle and the additive helpers) and shows CLI and web demo integration. The examples are intended for reviewers and contributors to quickly verify behaviour without reading source code: they consist of concise README examples and an examples/ folder with runnable snippets that import the library, exercise edge cases and print machine-checkable output (JSON). This feature is deliberately small so it can be implemented alongside existing features and tests in a single repository.

Specification

- Deliverables
  - README additions: two short usage examples in the README showing named imports from src/lib/main.js, one demonstrating fizzBuzzSingle and one demonstrating fizzBuzz with JSON output. Examples must be prose paragraphs and minimal code-like lines (avoid heavy escaping) per repository conventions.
  - examples/ folder content (examples/simple-run.js): a tiny Node script that imports the library, runs fizzBuzz(15), fizzBuzzSingle(3) and prints JSON to stdout for automated checks. The script must use only the exported named functions and must not reimplement fizzBuzz logic.
  - Example for CLI usage documented in README: show how to run npm run start:cli or node src/lib/main.js 15 --format=json and indicate expected JSON output equals JSON.stringify(fizzBuzz(15)).
  - A short note in README about running the web demo (npm run build:web and open docs/fizzbuzz-demo.html) and what to expect (the demo shows 15 results with FizzBuzz at position 15).

- Behaviour and constraints
  - Examples must import named exports from the library path used in tests (src/lib/main.js) and must rely on the canonical exports only; do not call internal helper files or assume alternate entry points.
  - The examples script must exit with code 0 on success and print deterministic JSON to stdout so behaviour tests can assert equality with programmatic outputs.
  - Keep examples dependency-free and runnable with node using the repository's declared node engine.

Testing guidance

- Unit tests: add or update a unit test that uses require/import of examples/simple-run.js (or spawns node) and asserts it exits 0 and prints JSON parsable output matching JSON.stringify(fizzBuzz(15)). Prefer using child_process spawnSync in tests/unit to run the script and assert stdout.
- Behaviour tests: document that the examples are complementary to the web demo and CLI behaviour tests already specified (they should not duplicate heavy Playwright tests but provide a quick local verification path).

Acceptance criteria

- README contains two clear, short usage examples: (1) fizzBuzzSingle example returning Fizz for 3, (2) fizzBuzz example producing a 15-entry array ending with FizzBuzz and JSON usage note.
- examples/simple-run.js exists and when run with node prints a JSON array equal to JSON.stringify(fizzBuzz(15)) and prints the single-value example for fizzBuzzSingle(3).
- A unit test exists (or is easily added) that runs examples/simple-run.js and asserts exit code 0 and stdout is valid JSON matching programmatic fizzBuzz(15).
- Examples and README mention CLI --format=json behaviour and label overrides as documented by the CLI feature, without changing library behaviour.

Notes

- This feature is strictly demonstrative and must not alter canonical library behaviour or exported function signatures.
- Keep examples minimal and readable; they are for contributor onboarding and quick verification. Implementations should be a few lines long and use only named exports from src/lib/main.js.

