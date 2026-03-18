# WEB_E2E_TESTS

Status: Planned

Overview

Add Playwright-based end-to-end tests that exercise the web demo (src/web/) to ensure the interactive encode/decode UI reproduces library results and remains stable across changes.

Scope

- tests/behaviour/demo.test.js: load the demo page, set the sample UUID or hex input, trigger encoding, read the rendered table of encodings and encoded outputs, and assert parity with programmatic calls to the library.
- Validate the "Reverse encoded output" checkbox behaviour (if present) and that decode actions round-trip to the canonical UUID.

Acceptance criteria (testable)

1. A Playwright test file tests/behaviour/demo.test.js exists and can be invoked with npx playwright test (ensure Playwright is installed in devDependencies) and exits 0 on the demo in CI/local.
2. The test asserts that for a given sample UUID the encoded strings shown in the page equal the values returned by encodeUUIDShorthand(uuid, encodingName) and that the displayed length equals the encoded string length.
3. The test asserts that the densest encoding reported in the UI produces encoded lengths < 22 for canonical sample UUIDs.
4. Tests are deterministic: use fixed sample UUIDs from tests/unit helpers.

Implementation notes

- Keep e2e tests minimal and focused on parity with the library rather than UI styling.
- Use Playwright selectors that are robust to markup changes (data-testids) and avoid brittle text-matching where possible.
