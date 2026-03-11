# WEB_DEMO

# Summary

Provide a small interactive web demonstration page and accompanying deterministic example script that exercise the library's exports (hammingDistance, hammingDistanceBits, popcount). The demo should be lightweight, dependency-free in the browser, and use the same library API surface exported from src/lib/main.js so it serves both as documentation and as a behaviour test target.

# Motivation

A visible, interactive demo helps users understand Unicode behaviour and bitwise semantics, demonstrates the normalize option, and supplies deterministic browser-driven examples for behaviour tests. The demo page also serves as a simple manual test harness when developing the library.

# Specification

1. Demo page
   - Add a single-page demo at src/web/demo.html (or ensure an existing demo page is enhanced) that imports the library's browser-compatible build (docs/lib-browser.js or the built artifact) and exposes a minimal UI:
     - Two text input fields for string mode and a Compare Strings button.
     - Two number or bigint input fields for bits mode and a Compare Bits button.
     - A Normalize choice selector with options: false, NFC, NFD.
     - An output area that shows a single integer result on success or a one-line error message containing a canonical keyword on failure (string, length, non-negative, options, normalize).
   - The page must use Array.from-based comparison via the exported hammingDistance, and BigInt-based hammingDistanceBits and popcount, and must not add external runtime dependencies.

2. Example scripts
   - Add or ensure examples/compare-strings.js, examples/compare-normalize.js, and examples/compare-bits.js exist and import from src/lib/main.js. Each script must print exactly one integer followed by a newline for successful runs or a single-line error message containing one canonical keyword for failures.
   - The demo must link to or reference these example scripts in its description so they remain the canonical deterministic examples for tests.

3. Behaviour and determinism
   - The demo's Compare Strings action must show results consistent with the library: hammingDistance("karolin","kathrin") -> 3; empty strings show 0; unequal code-point lengths produce a RangeError message containing length or equal.
   - The demo's Normalize selector when set to NFC must demonstrate the normalization acceptance case: comparing "a\u0301" and "á" shows 0 under NFC and 1 when normalize is false.
   - The Compare Bits action must accept decimal integers or BigInt literal suffixes, and display hammingDistanceBits(1,4) -> 2 and hammingDistanceBits(0,0) -> 0. Errors for negative integers must contain the substring non-negative.

4. Tests and CI integration
   - Add or update behaviour tests to load src/web/demo.html (via the existing build:web step that copies src/web to docs) and assert the demo page UI produces the expected outputs for the canonical examples. Tests may operate by querying DOM elements or by running the deterministic example scripts via node and asserting stdout/stderr and exit codes.

5. Accessibility and small surface
   - Keep the UI minimal and accessible: labeled inputs, buttons, and an output area. Styling is optional but must not interfere with deterministic text output in the output area.

# Acceptance Criteria

- Visiting the built demo page (npm run build:web and open docs/demo.html) and using the Compare Strings controls with karolin and kathrin displays 3 in the output area.
- Using the demo Normalize selector to compare a\u0301 and á shows 1 with normalize=false and 0 with normalize=NFC.
- The demo Compare Bits controls show 2 for inputs 1 and 4, and 0 for 0 and 0.
- examples/compare-strings.js prints 3 for karolin and kathrin and exits 0.
- examples/compare-normalize.js prints 1 or 0 depending on normalization as documented and exits 0 for success cases.
- examples/compare-bits.js prints 2 for 1 and 4 and exits 0.
- The demo output area and example scripts print exactly one integer followed by a newline on success, or a single-line error message containing one of the canonical keywords (string, length, non-negative, options, normalize) on failure.

# Files to change (minimal set)

- src/web/demo.html (create or enhance existing) — interactive demo UI and wiring to docs/lib-browser.js or the library's browser build
- examples/compare-*.js — deterministic example scripts that import from src/lib/main.js and print a single integer or a single-line error message
- README.md — brief pointer to the demo with exact commands to build and open docs/demo.html
- tests/behaviour/ or tests/unit/ — add or update tests that exercise the demo or example scripts to assert deterministic outputs

# Notes

- The feature must avoid adding new runtime dependencies; reuse the existing build:web step that already copies src/web to docs. The demo should depend only on the library's exported functions and standard browser APIs. Keep the implementation in a single-page file and simple example scripts for maintainability and ease of automated testing.