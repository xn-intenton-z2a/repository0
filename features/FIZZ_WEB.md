# FIZZ_WEB

## Summary

Add a focused, testable web demonstration for the fizz-buzz library. The web demo is a small interactive UI under src/web/ that imports the library's named exports (fizzBuzz and fizzBuzzSingle) and allows users to run both functions from the browser, see results, and copy JSON output. This feature makes the library behaviour discoverable and provides a lightweight integration point for behaviour tests and manual verification.

## Goals

- Provide a minimal interactive page that demonstrates fizzBuzz(n) and fizzBuzzSingle(n) using the existing library exports.
- Keep the demo small and dependency-free (vanilla HTML/JS) so it can be built with the existing build:web script.
- Add unit-level behaviour tests that assert the demo calls the library and renders expected output for canonical inputs.
- Ensure the demo is accessible from the docs output produced by npm run build:web.

## Acceptance criteria

- The web demo page exists at src/web/fizz-demo.html and includes a numeric input and two buttons: "Run FizzBuzz" and "Run FizzBuzzSingle".
- Running "Run FizzBuzz" with 15 renders one line per value and the last line is FizzBuzz; the page exposes a "Copy JSON" button that copies the fizzBuzz(15) JSON array.
- Running "Run FizzBuzzSingle" with 7 renders the string "7", with 3 renders "Fizz", 5 renders "Buzz", and 15 renders "FizzBuzz".
- Behaviour tests (tests/behaviour/) include a simple Playwright or jsdom verification that the demo calls the exported functions and renders expected text for the canonical inputs.
- The build:web script copies src/web into docs/ so the demo is available when running npm run build:web (no build changes required beyond placing files into src/web/).

## Implementation notes

- The demo must import the library using the library entry point (src/lib/main.js) so it exercises the named exports rather than duplicating logic.
- Keep UI minimal: inputs, buttons, a preformatted results area, and a copy-to-clipboard button.
- Tests should focus on interaction and rendering, not reimplementing fizzBuzz logic. Use the library functions in assertions where possible.

## Files to change

- Add: src/web/fizz-demo.html (interactive demo page)
- Optionally add: src/web/fizz-demo.js (small script imported by fizz-demo.html)
- Add behaviour tests under tests/behaviour/fizz-web.test.js that verify UI and integration with the library
- Update README.md to add a one-line link or mention of the web demo under the website or examples section

## Notes for reviewers

- The feature is UI-only and must not change library behaviour; all core logic remains in src/lib/main.js and unit tests remain the authority for correctness.
- Keep the demo self-contained and free of external dependencies so the docs build remains stable.

