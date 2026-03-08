# FIZZBUZZ_EXAMPLES

Summary

Provide canonical plain-text usage examples and a minimal interactive web demonstration that exercise the library API (fizzBuzz and fizzBuzzSingle) so consumers and behaviour tests can verify correct results for sample inputs such as 15.

Specification

- Usage examples: add plain-text examples in README.md that illustrate calling fizzBuzz(15) and fizzBuzzSingle(3), fizzBuzzSingle(5), and fizzBuzzSingle(7), showing expected outputs. Examples must be simple calls and their expected return values, written so unit tests can assert against the same examples.

- Web demo: provide a single-page demo under src/web/ (index.html plus a small ES module script) that imports the named exports from src/lib/main.js using a relative path and renders:
  - an input for a positive integer n and a button to render fizzBuzz(n) as a comma-separated list in a results area;
  - an input or control to evaluate fizzBuzzSingle(k) for a single integer k and display the single-result string in a separate area;
  - clear, user-friendly messages for invalid input (non-integer, negative) reusing the library's thrown errors and messages.
  The demo must not duplicate fizz/fizzbuzz logic; it must call the exported functions.

- Examples page path: after running npm run build:web the demo must be present in docs/ at a predictable path (for example docs/index.html or docs/examples/index.html) so behaviour tests can open it.

Testing guidance

- Unit tests (tests/unit/): add or update tests that import fizzBuzz and fizzBuzzSingle from src/lib/main.js and assert exact outputs for the documented examples including:
  - fizzBuzz(15) returns an array of 15 strings ending with FizzBuzz;
  - fizzBuzzSingle(3) returns Fizz; fizzBuzzSingle(5) returns Buzz; fizzBuzzSingle(15) returns FizzBuzz; fizzBuzzSingle(7) returns "7";
  - fizzBuzz(0) returns [];
  - input validation tests already specified in FIZZBUZZ_VALIDATION must be maintained.

- Behaviour tests (tests/behaviour/ or Playwright): ensure npm run build:web copies the demo into docs/; write or update a behaviour test that opens the built demo and verifies:
  - entering 15 into the demo input and triggering the render shows 15 entries and the final entry equals FizzBuzz;
  - evaluating fizzBuzzSingle(3) via the demo UI displays Fizz;
  - invalid input shows the documented error message to the user and the page does not crash.

Acceptance criteria

- README.md contains plain-text usage examples showing fizzBuzz(15) and fizzBuzzSingle calls with their expected outputs.
- The demo page is present under docs/ after npm run build:web at a stable path and imports the library from src/lib/main.js.
- Behaviour test(s) confirm the demo renders the 15-element sequence ending with FizzBuzz for n=15 and that single evaluations like fizzBuzzSingle(3) display Fizz.
- Unit tests cover the examples and validation behaviour and pass.

Implementation notes

- Keep the demo minimal: a single HTML page and a short ES module script that imports the named exports and updates the DOM; prefer vanilla DOM APIs and no extra bundling.
- Reuse errors/messages from the library rather than inventing new strings so unit tests can assert on error message substrings documented in FIZZBUZZ_VALIDATION.
- Update README.md with the plain-text examples so documentation and tests are consistent.

Compatibility and scope

- This feature stays within the repository: it updates README.md examples, src/web demo files that are already referenced by npm run build:web, and unit/behaviour tests as needed.
- Do not modify the library API in src/lib/main.js; only add examples, demo UI, and tests that call the exports.

Notes

This expanded specification clarifies paths, exact example inputs, and testable acceptance criteria so the demo and examples can be used by both humans and automated behaviour tests.