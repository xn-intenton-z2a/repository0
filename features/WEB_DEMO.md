# WEB_DEMO

## Overview

Provide an interactive web demonstration for the FizzBuzz library that lives in src/web and is included in the static docs produced by the existing build:web script. The demo makes the core API visible and easy to exercise in a browser so reviewers and CI behaviour tests can confirm the library behaviour end-to-end.

## Specification

- Add a small interactive widget under src/web/ (or an entry file there) that exposes two controls:
  - Single mode: input a positive integer and display the result of fizzBuzzSingle for that integer.
  - Range mode: input a non-negative integer n and display the fizzBuzz(n) output as a numbered list.
- The widget must use the library exports from src/lib/main.js rather than reimplementing logic.
- Inputs must validate according to FIZZBUZZ_CORE rules and display validation errors inline when the input is invalid.
- The widget should be static-servable so the existing build:web script copies it into docs/ and start serves it via npm start.

## Acceptance criteria

- Building the site with the build:web script copies the demo into docs/ so it can be served by npm start.
- Opening the demo in a browser and entering 3 in single mode shows the text Fizz.
- Entering 5 in single mode shows Buzz; entering 15 shows FizzBuzz; entering 7 shows 7.
- Entering 0 in range mode shows an empty output area and no list items.
- Invalid inputs (non-integer, negative where disallowed) display a clear validation error and do not call the library function.
- The demo uses the exported named functions fizzBuzz and fizzBuzzSingle from src/lib/main.js.
- Behaviour tests can script the UI (playwright) to confirm the visible outputs match the core acceptance criteria.

## Implementation notes

- Keep the demo minimal and dependency-free: plain JavaScript and DOM manipulation or a single small module under src/web/demo.js that imports from /src/lib/main.js.
- Prefer progressive enhancement so the demo degrades to readable text when JavaScript is disabled.
- Reuse existing build:web tooling so no new scripts are required.

---
