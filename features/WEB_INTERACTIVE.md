# WEB_INTERACTIVE

# Summary

Provide an interactive web demonstration and example page that exercises the library's toRoman and fromRoman functions in the browser. The demo will live under src/web/ (existing website) and expose a simple UI that lets visitors enter integers or Roman numeral strings and see conversions, error messages, and the canonical conversion table.

# Motivation

An interactive web demo makes the conversion library tangible for new users, aids manual verification of round-trip behaviour, and provides examples that can be copied into projects or used in behaviour tests. It also strengthens the README and docs by showing the library used both programmatically and in a browser context.

# Scope

- Add a small interactive demo page and JavaScript glue that calls the named exports toRoman and fromRoman from src/lib/main.js via the existing web build pipeline.
- The feature spec requires changes in three areas when implemented later: the library export usage, a minimal demo script under src/web/demo.js (or index.html inline script), and unit tests that validate the demo's conversion functions call the library correctly (mocking DOM where needed). Those implementation changes are described here for clarity but are not performed by this spec file.
- Keep the demo minimal, dependency-free, and accessible for inclusion in docs (docs/ site build used by npm run build:web).
- Respect existing STRICT_VALIDATION and CLI_CONVERTER behaviours: demo shows strict validation errors the same way the library does.

# Implementation notes

- The demo shall use the library's named exports (import { toRoman, fromRoman } from '../../lib/main.js' or the project-appropriate path after build) rather than duplicating conversion logic.
- UI elements: numeric input (1-3999) with convert-to-roman button; text input for Roman numerals with convert-to-integer button; an area that displays the conversion table (1,4,9,40,90,400,900,1994,3999 examples) and clear, distinct inline error messages on TypeError/RangeError.
- Behaviour: when an error is thrown by the library, the demo catches it and displays a user-friendly message containing the error name and short guidance (e.g., RangeError: use 1–3999).
- Accessibility: inputs labelled, buttons keyboard-focusable, results announced for screen readers via an ARIA-live region.
- Testability: expose small wrapper functions (window.demoToRoman(n), window.demoFromRoman(s)) that call the library and return results or throw; unit tests can import or call these wrapper functions in JSDOM.

# Deliverables (when implemented)

- src/web/demo.js (or updated src/web/index.html) implementing the interactive UI and wrapper functions.
- Unit tests in tests/unit/demo.test.js that assert wrapper functions call the library correctly and that error cases produce the expected thrown error types and messages.
- README update: add a short section describing the interactive demo and how to run local docs (npm run start) and the CLI alternative (npm run start:cli).
- Behaviour test plan: a short Playwright test that loads the demo, enters 1994 and asserts MCMXCIV appears, and enters MCMXCIV and asserts 1994 appears.

# Acceptance criteria

- The repository includes a visible interactive demo under src/web that lets a user: input an integer and get its Roman numeral, input a Roman numeral and get its integer, and see errors for out of range or invalid inputs.
- The demo uses the library's named exports (no duplicated conversion code in the demo) and preserves STRICT_VALIDATION behaviour (invalid Roman strings produce TypeError displayed to the user).
- Unit tests exist that exercise the demo wrapper functions and assert that errors thrown are RangeError or TypeError with explanatory messages.
- README contains a demo section that explains how to run the demo locally with npm run start and how the demo relates to the CLI and library API.
- A minimal Playwright behaviour test demonstrates the core interactive conversions: toRoman(1994) => MCMXCIV and fromRoman('MCMXCIV') => 1994 when run with npm run test:behaviour.

# Notes

- This feature is intentionally implementation-light: the spec focuses the work so it fits in a single repository and integrates smoothly with the existing build:web script that publishes src/web to docs/.
- Keep the demo code small and dependency-free to make maintenance and testing straightforward.
