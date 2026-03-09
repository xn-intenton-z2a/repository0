# WEB_DEMO

Feature name

WEB_DEMO

Summary

A minimal interactive web demonstration that imports the named exports fizzBuzz and fizzBuzzSingle from src/lib/main.js and exposes a simple UI for trying the functions. The demo is intended to be used by behavioural tests and as a quick manual verification for the library outputs.

Motivation

Provide an executable, visible demonstration of the library functions for end-to-end behaviour tests and to satisfy the mission requirement that the website uses the library.

Specification

Pages and assets

- src/web/index.html: Simple page with an input for a number, two buttons (Generate Range, Evaluate Single) and two output areas with IDs:
  - input number: id="n-input"
  - generate result container: id="range-output"
  - single result container: id="single-output"
  - buttons: id="btn-range", id="btn-single"

Behavior

- On clicking Generate Range, read integer from n-input, call fizzBuzz(n) and render the returned array as a comma-separated string inside range-output. Handle errors by showing the error message.
- On clicking Evaluate Single, read integer from n-input, call fizzBuzzSingle(n) and render the returned string inside single-output. Handle errors by showing the error message.

Implementation notes

- Import named exports from src/lib/main.js using standard ESM import syntax in a small module script tag.
- Keep DOM manipulation minimal and resilient to invalid inputs.
- No additional runtime libraries; use vanilla JS.

Testing and acceptance criteria

- The page can be built/copied to docs/ by the build:web script and served for behaviour tests.
- Behavioural tests reference the IDs above to interact with the page and assert correct outputs for sample inputs (for example n=15 shows trailing "FizzBuzz").

Compatibility and constraints

- Keep changes limited to allowed files (source, tests, README, examples, and web assets). Do not add new top-level files outside those.

Notes

- Ensure the demo imports named exports (not default) to match the library API and to avoid mismatches during tests.