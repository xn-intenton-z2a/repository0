# FIZZBUZZ_WEB

Overview

Provide a small set of interactive web examples in src/web and documentation pages that demonstrate the fizzBuzz library in the browser. This feature improves discoverability for web users and shows how the same library can be used in a frontend context.

Specification

- Add lightweight example pages in src/web that import the library (src/lib/main.js) and render:
  - A simple static example showing fizzBuzz(15) output in a preformatted block.
  - An interactive example with an input box for n and a button that renders fizzBuzz(n) using the library functions.
  - A single-value example that shows fizzBuzzSingle for a user-provided number.
- Examples must handle validation in the UI and show friendly messages for invalid input (non-integer, negative) mirroring library error semantics.
- Keep pages dependency-free (no build step beyond the repo's existing build:web copy) and use plain JS/HTML so docs/build copies them into docs/ for local preview.

Testing

- Manual verification: npm run build:web should copy src/web into docs/ and the example pages should open in a static server (npm start) and demonstrate correct outputs for n=3,5,15 and show validation messages for 0 and invalid input.
- Automated tests are not required but a lightweight smoke test could be added to ensure docs/src files exist after build:web.

Acceptance Criteria

- src/web contains at least three example HTML/JS pages: static-15.html, interactive.html, single-value.html demonstrating fizzBuzz and fizzBuzzSingle.
- Running npm run build:web copies these examples into docs/ and they are viewable with npm start.
- The interactive example returns correct output for inputs 3, 5, and 15 and shows validation messages for invalid inputs.

Implementation Notes

- Use minimal, dependency-free JavaScript in src/web so the repository build:web script can copy files without additional tooling.
- Keep examples small and focused on demonstrating the library API and edge cases.
