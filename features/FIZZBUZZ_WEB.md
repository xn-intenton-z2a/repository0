# FIZZBUZZ_WEB

## Summary

Specification for a small interactive web example that demonstrates the FizzBuzz library in the repository's website under src/web/. The page allows entering a positive integer and displays the FizzBuzz sequence, showcasing the library for visitors.

## Motivation

A web example helps validate the library in-browser and provides a simple visual demo for the README and docs. The repository contains a src/web/ site; this feature defines the behaviour and acceptance criteria for a FizzBuzz demo page.

## Behaviour

- Page should be located in src/web/ and discoverable when the docs are built (npm run build:web produces docs/).
- UI: single numeric input and a button labeled Generate.
- On submit: validate input client-side (integers only, non-negative). If invalid, show a clear inline error message.
- On valid input: render the FizzBuzz sequence as a list of items on the page.
- No server-side components required; pure static client-side JS that imports or bundles the library code if feasible.

## Accessibility and UX

- Input should have a label and aria attributes for accessibility.
- Results should be presented in a semantic ordered list.
- Errors should be announced or visible to assistive technologies.

## Acceptance criteria

- [ ] Page exists in src/web/ and is copied to docs/ when running npm run build:web.
- [ ] Entering 15 and clicking Generate displays 15 items with the expected final item FizzBuzz.
- [ ] Entering 0 displays an empty result area (no list items) and no error.
- [ ] Non-integer input displays an inline error and does not render results.
- [ ] The page uses the same library functions for generating the sequence (avoid duplicating logic in the page script).

## Tests (guidance)

- Simple DOM tests can be authored as unit tests using JSDOM (in tests/unit/) to validate that the page markup responds correctly to input and shows expected results.
- Alternatively, an automated end-to-end smoke test can be added that builds the docs and inspects the generated HTML for expected snippets.

## Implementation notes

- Keep the demo lightweight: a single HTML file with a small JavaScript module that imports the library functions.
- Ensure the script does not execute heavy work on page load; only when the user triggers Generate.
- Document the demo in README.md with a short paragraph and a screenshot placeholder description.
