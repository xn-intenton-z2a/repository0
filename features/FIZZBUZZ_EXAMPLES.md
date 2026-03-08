# FIZZBUZZ_EXAMPLES

Summary

Provide canonical usage examples and a lightweight web demonstration that show the library API in action and make the library immediately usable by consumers and behaviour tests.

Specification

- Add a clear set of usage examples that exercise both named exports fizzBuzz and fizzBuzzSingle and demonstrate correct input handling and error conditions. Examples must be phrased as plain text usage examples suitable for README and the website examples page.
- Provide a small interactive web demo under src/web/ that imports the library (src/lib/main.js) and renders an input for a positive integer n and a result area that shows the fizzBuzz array joined by commas and the fizzBuzzSingle result for a selected value. The demo should not require build tooling beyond the repository's existing npm scripts and must work when npm run build:web is executed and the docs are served.
- Add an examples/ directory (or reuse src/web/examples) content reference in this feature spec so behaviour tests can point at a predictable example page path (docs/index.html or docs/examples.html after the build step) and assert visible content for n=15.
- Reuse the exported functions fizzBuzz and fizzBuzzSingle from src/lib/main.js; do not duplicate logic in the web demo.

Testing guidance

- Unit tests: add or update tests under tests/unit/ to assert that example inputs produce the documented outputs. Tests must import the named exports from src/lib/main.js and assert exact array contents or string results.
- Behaviour tests: the repository already builds docs with npm run build:web; add or update a behaviour test to navigate to the built example page and assert that entering 15 (or using prefilled example) renders 15 entries and the final entry equals FizzBuzz. The test should also assert that clicking a demonstration control shows fizzBuzzSingle(3) => Fizz, and that invalid input produces the documented error shown to the user.

Acceptance criteria

- README and the examples page clearly document how to call fizzBuzz and fizzBuzzSingle and include at least one working example for n=15 that is consistent with unit tests.
- The web demo page built by npm run build:web imports the library and displays a working interactive control that shows the fizzBuzz results and fizzBuzzSingle for sample inputs.
- Behaviour test demonstrates that the demo page shows the 15-element sequence ending with FizzBuzz for n=15 and that fizzBuzzSingle(3) returns Fizz when exercised by the demo.
- All unit tests that reference example behaviour pass.

Implementation notes

- Keep the demo minimal: a single HTML page with a small script that imports the named exports from the library entry point and updates DOM elements. Prefer plain ES module import with relative path to src/lib/main.js so the demo works when copied to docs/ by the existing build:web script.
- Do not change the library API: use the existing named exports fizzBuzz and fizzBuzzSingle.
- Follow CONTRIBUTING.md guidance: small, focused change; update README.md with the plain-text examples; keep tests deterministic and avoid flaky UI interactions.

Notes

This feature complements the existing FIZZBUZZ_CORE, FIZZBUZZ_VALIDATION and FIZZBUZZ_CLI features by providing user-facing examples and a site-level demonstration suitable for behaviour tests and non-programmer users.
