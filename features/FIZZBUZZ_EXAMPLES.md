# FIZZBUZZ_WEB

# Summary

Provide a small, dependency-free static web demo for the canonical FizzBuzz library and retain the existing TypeScript declaration guidance. The demo will be an accessible single-file page under src/web/ that imports the library helpers for rendering and supports interactive validation, formatting, and label overrides. This update preserves the TypeScript declarations feature and folds the web demo into the same feature file to stay within the repository feature limit.

# Specification

- Purpose: ship a static, browser-friendly demonstration of the canonical API so reviewers and behaviour tests can exercise interactive UI flows without adding build tooling or runtime dependencies.

- Primary deliverables:
  - Add: src/web/fizzbuzz-demo.html  (static ES module demo, dependency-free)
  - Update: package.json build:web script already copies src/web into docs/; ensure the demo is picked up by npm run build:web and by start/test:behaviour flows.
  - Preserve: TypeScript declaration guidance from the previous examples feature (src/lib/main.d.ts and package.json.types) — do not remove this requirement.

- Demo requirements:
  - Input for n (positive integer) with client-side validation and explicit user-facing error messages.
  - Controls for output format: one-per-line and JSON, mirroring CLI --format behaviour.
  - Optional inputs for label overrides fizz and buzz (two separate text fields) that call fizzBuzzWithWords and fizzBuzzSingleWithWords for display without altering canonical outputs.
  - Render button that displays results in a scrollable pre element for text mode and a formatted JSON block for JSON mode.
  - Copy-to-clipboard button for JSON output.
  - Accessible semantics: labelled inputs, buttons with aria-labels, and results placed in a pre element with role="status" for screen readers.
  - The demo must only call exported library functions; no duplicate FizzBuzz logic in the page.
  - The page must be purely static and dependency-free; use native ES modules and DOM APIs only.

# TypeScript declarations (preserved)

- Keep the earlier TypeScript declaration deliverables and acceptance criteria:
  - Add: src/lib/main.d.ts with named exports matching FIZZBUZZ_CORE signatures.
  - Patch: package.json to include "types": "src/lib/main.d.ts" and add a one-line note to README.md referencing the declarations path.
  - Do not introduce new devDependencies or a TypeScript build step.

# Testing guidance

- Behaviour tests (Playwright) should run npm run build:web then open docs/fizzbuzz-demo.html and assert interactive behaviour:
  - Enter 15, choose one-per-line, click Render, assert 15 lines are displayed and the last line equals FizzBuzz.
  - Enter 15, choose JSON, click Render, parse JSON and assert it matches the programmatic output of fizzBuzz(15) imported by the page.
  - Enter fizz=Foo and buzz=Bar in the label fields and assert Foo, Bar and FooBar appear at the canonical positions in output.
  - Assert the demo prevents rendering and shows validation message when n is invalid (empty, non-integer, negative).

- Unit tests may export a small DOM-binding helper from the demo (for example a function that renders given inputs into a string) and assert it uses library helpers; primary assertions remain end-to-end via Playwright.

# Acceptance criteria

- src/web/fizzbuzz-demo.html exists, is static, and dependency-free.
- build:web copies the demo into docs/ so npm run build:web and start produce the static demo in docs/fizzbuzz-demo.html.
- The demo uses only the library exports for computation; no FizzBuzz logic duplicated in the demo page.
- Playwright behaviour tests can interact with the demo on localhost and assert the exact JSON shapes and line outputs required by FIZZBUZZ_CORE and FIZZBUZZ_API specifications.
- TypeScript declaration guidance remains present: src/lib/main.d.ts is specified and package.json contains the types field pointing to it.
- No new runtime or dev dependencies are added to package.json.

# Implementation notes

- Implement the demo as a single-file ES module using type="module" and dynamic import of the library entry where necessary; fall back to using a lightweight browser-friendly build if the library entry cannot be imported directly but avoid adding build steps by preferring an ESM-compatible runtime import path.
- Keep UI logic minimal: parse inputs with Number APIs, validate using the same rules as the canonical functions, then call fizzBuzz, fizzBuzzWithWords, or fizzBuzzSingleWithWords to render results.
- Do not change library exports or behaviour; the demo must import and call them only.
- For testability, export a small pure rendering helper from the demo file as a named export (for unit tests run in Node via jsdom or a small harness) that accepts parsed inputs and returns serialisable output; unit tests can import this helper without spinning a browser.

# Backwards compatibility

- This feature is additive: it only adds a static demo and TypeScript declaration guidance and does not alter existing library behaviour or tests.
- No new dependencies or build steps are required; existing npm scripts (build:web) will copy the demo into docs/ as-is.

# Notes

Combining the web demo and TypeScript declaration guidance into one updated feature file preserves the repository feature limit while delivering a visible, interactive demonstration that exercises the canonical API and enables robust behaviour tests.
