# FIZZBUZZ_EXAMPLES

Summary

Provide concise, runnable examples and small example scripts that demonstrate the canonical library exports and additive helpers. This feature supplies a single minimal examples script that imports the library, prints deterministic JSON output and stats for n=15, and documents how to run the CLI and web demo in the README. It is intentionally small, fully testable, and uses only the exported API so it remains stable as the canonical code evolves.

Specification

Public example artefacts and files

- examples/simple-run.js
  - A tiny Node script that imports named exports from src/lib/main.js and performs two actions:
    - Prints JSON-serialised fizzBuzz(15) to stdout followed by a newline.
    - Prints JSON-serialised fizzBuzzStats(15) to stdout followed by a newline.
  - The script must only call the library exports and must exit with code 0 on success.

- README.md additions
  - Add a short prose paragraph that mentions fizzBuzzSingle(3) and what it returns and a second sentence that states fizzBuzz(15) returns a 15-element sequence ending with FizzBuzz.
  - Include an instruction referencing examples/simple-run.js and node src/lib/main.js 15 (the CLI demo) and the command npm test.
  - Keep prose concise and inline (no fenced code blocks) so automated checks can match substrings.

- Behaviour and unit test guidance
  - Unit tests should import examples/simple-run.js via a child process in an integration-style test and assert it exits 0 and that stdout contains JSON matching JSON.stringify(fizzBuzz(15)) and the stats object matching fizzBuzzStats(15).
  - Unit tests should also assert the README contains the substrings fizzBuzz(15), fizzBuzzSingle(3), examples/simple-run.js or node src/lib/main.js 15, and npm test.

Testing guidance

- Integration test: spawn node examples/simple-run.js and assert exit code 0 and that stdout contains two JSON objects; the first equals the programmatic fizzBuzz(15) and the second equals fizzBuzzStats(15).
- Unit tests: import fizzBuzzStats and fizzBuzz from src/lib/main.js and assert fizzBuzzStats(15) equals { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 } and Array.from(fizzBuzzGenerator(5)) equals fizzBuzz(5).
- README assertions: automated checks must find the required substrings and the prose must mention npm test and build:web usage for the web demo.

Acceptance criteria

- examples/simple-run.js exists and prints deterministic JSON for fizzBuzz(15) and fizzBuzzStats(15) and exits 0.
- README.md contains fizzBuzz(15), fizzBuzzSingle(3), and mentions examples/simple-run.js or node src/lib/main.js 15 and npm test.
- Unit/integration tests assert the examples script output matches programmatic outputs from the library and that stats are correct for n=15.

Notes

- This feature is explicitly additive: it must not change existing library exports or canonical behaviour; the examples script and README are documentation and demonstration artefacts only.
- Keep the examples script minimal and dependency-free; it should be easy to spawn and assert in CI.
