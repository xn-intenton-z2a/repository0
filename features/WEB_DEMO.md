# WEB_DEMO

## Overview

Provide a minimal interactive web widget under src/web that demonstrates the exported fizzBuzz and fizzBuzzSingle functions and can be copied into docs/ by the existing build:web script for manual or scripted verification.

## Specification

- UI controls
  - Single mode: input (positive integer) + button. On valid input, call fizzBuzzSingle(n) and display the returned string in a result area.
  - Range mode: input (non-negative integer) + button. On valid input, call fizzBuzz(n) and display results as a numbered list. For n = 0 display no list items.
- Validation
  - Validate inputs in the browser using the same rules as FIZZBUZZ_CORE and display inline validation messages with the exact core messages:
    - Input must be a number
    - Input must be an integer
    - Input must be >= 1 (for single)
    - Input must be >= 0 (for range)
  - Do not call the library when validation fails.
- Implementation
  - Implement with plain DOM APIs or a small module at src/web/demo.js that imports { fizzBuzz, fizzBuzzSingle } from ../../src/lib/main.js.
  - Keep assets static so build:web copies src/web into docs/ without additional tooling changes.

## Acceptance criteria

- npm run build:web copies the demo into docs/ so it can be served by npm start.
- Visiting the demo and entering 3 in Single mode displays Fizz in the result area.
- Entering 5 displays Buzz; entering 15 displays FizzBuzz; entering 7 displays 7.
- Entering 0 in Range mode results in no list items displayed.
- Invalid inputs show the exact validation messages above and do not call the library.
- Behaviour tests (playwright) can script the UI to assert visible text and list items match core acceptance criteria.

## Implementation notes

- Keep the demo minimal and dependency-free; use plain JavaScript and DOM manipulation.
- Reuse the core exports; do not reimplement fizzbuzz logic in the demo.
- Ensure progressive enhancement (readable fallback when JS is disabled) where reasonable.
