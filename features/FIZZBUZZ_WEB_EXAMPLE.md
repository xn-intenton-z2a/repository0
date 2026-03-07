# FIZZBUZZ_WEB_EXAMPLE

## Summary
Add a focused example in the examples/ directory that demonstrates using the library in a small browser context so the repository website under src/web/ can show live output of fizzBuzz. The example should be small, self-contained, and clearly reference the named exports.

## Goals
- Provide an examples/web-demo.html (or similar) in the examples/ directory that imports the library (or demonstrates the expected usage) and renders the fizzbuzz output for a given input.
- Keep the example simple so it can be copied into src/web/ for the docs build step used by npm run build:web.
- Document the example in README so visitors know where to find it.

## Behavior
- The example page renders a list of fizzbuzz outputs for a default value (e.g., 15) and allows changing the input via a simple input box and button.
- The example must not require a complex build step; prefer a single-file HTML that demonstrates the algorithm or uses a small script tag referencing the library output.

## Acceptance Criteria
- [ ] An example HTML file exists in examples/ that demonstrates fizzBuzz output for n = 15 by default.
- [ ] The README links to the example and explains how to open it locally.
- [ ] The example is compatible with the repository's build:web step so it can be included in docs if copied into src/web/.

---

Notes for contributors: avoid heavy front-end frameworks; the example should be plain HTML/JS so it is easy to maintain.