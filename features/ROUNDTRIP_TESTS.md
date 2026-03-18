# CUSTOM_ENCODINGS_UI

Status: Planned

Overview

Add an interactive UI control to the web demo that allows users to provide a charset string and register a custom encoding at runtime. This feature makes experimentation with higher-density alphabets accessible and provides an easy path to test custom encodings in the browser demo.

Behavior

- The demo exposes an input for charset string and a "Register" button.
- When a charset is registered, the UI validates the charset (no control characters, no whitespace, excludes ambiguous characters 0 O 1 l I) and adds the new encoding to the encodings table and list used by the encode/decode widget.
- Registration failure displays a clear validation error.

Acceptance criteria (testable)

1. The demo contains a charset input and Register button (selectors with data-testid attributes for Playwright tests).
2. Playwright e2e tests can register a valid charset, verify the new encoding appears in the encodings table, encode a sample UUID and assert that the UI-encoded value exactly matches encode(definedName, data) from the library.
3. Attempting to register an invalid charset (control characters, ambiguous characters, or duplicates) yields a visible validation error and does not add the encoding to the registry.

Implementation notes

- Reuse client-side helpers to normalise charsets and validate characters consistent with defineEncoding on the server/library so parity is preserved.
- Keep UI changes isolated and add data-testid attributes to new elements to make tests robust.
