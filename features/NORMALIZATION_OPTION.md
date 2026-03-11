# BROWSER_BUILD

## Summary

Provide a small, well-defined browser-friendly build and distribution path for the hamming-distance library so the functions are usable in browser environments, demos, and the docs site. This feature formalises the existing docs/lib-browser.js generation and ensures browser compatibility, minimal API surface, and documentation for running the demo.

## Motivation

Consumers expect a small, dependency-free browser module for interactive demos and quick in-browser usage. The repository already includes a docs generation step that writes docs/lib-browser.js; this feature formalises tests, docs, and examples that rely on a stable browser build.

## Specification

1. Browser module
   - Provide a browser-compatible ES module at docs/lib-browser.js that exports hammingDistance and hammingDistanceBits with the same validation and behaviour as the Node library.
   - The browser module must not depend on Node-only APIs and must operate purely in the browser runtime.

2. Build and package script
   - Ensure npm run build:web writes docs/lib-browser.js (existing package.json script already generates this file). Document the command in README so contributors can reproduce the build locally.

3. Demo integration
   - The examples/hamming-demo.html (existing feature) should import docs/lib-browser.js for the demo UI when served from docs/ or when the user runs npm run start.

4. Tests
   - Add a unit test that imports docs/lib-browser.js using Node's ESM loader (or jsdom) to assert the exported functions exist and behave for a small set of acceptance examples (karolin vs kathrin, and 1 vs 4 bits). This ensures the generated browser file is usable programmatically.

5. Documentation
   - Update README.md Web demo section to instruct users to run npm run build:web and then open docs/index.html or examples/hamming-demo.html.

## Acceptance Criteria

- Running npm run build:web creates docs/lib-browser.js in the docs/ directory
- docs/lib-browser.js exports functions hammingDistance and hammingDistanceBits usable in a browser environment
- A unit test exists that imports docs/lib-browser.js (via jsdom or Node ESM) and verifies at least two acceptance examples (string and bits) succeed
- README contains instructions referencing npm run build:web and where to find docs/lib-browser.js and the examples/hamming-demo.html demo

## Files to change

- README.md: add build and browser usage instructions
- tests/unit/: add a small test that imports docs/lib-browser.js (using jsdom or Node ESM) and verifies exported functions
- package.json: no behaviour changes required (build:web already exists), but document the command in README

## Implementation notes

- Reuse the existing docs/lib-browser.js generation present in package.json's build:web script.
- Keep the browser module small and dependency-free; it should mirror the Node behaviour and error types as closely as possible while remaining browser-safe.
- Tests should be lightweight and focus on API parity rather than exhaustive coverage.
