# UUID_COMPARISON

# Overview

Add a documented UUID encoding comparison feature that produces a human-friendly table comparing encoded lengths of a canonical v7 UUID across all built-in encodings and the default base64 reference.
This is primarily a README/documentation feature and an examples/ snippet to demonstrate usage from the library and the website.

# Motivation

The mission's benchmark requires a visible comparison of encoded UUID lengths. Providing a canonical table in README.md and an examples script makes it easy for users to see density gains.

# Specification

Documentation:

- Update README.md with a section "UUID encoding comparison" containing a table with columns: encoding, charset, bitsPerChar, uuidLength (chars), notes.
- Include one example row for base62, base85, base91, base92 and base64.

Examples:

- Provide an examples/encode-uuid.js script that imports the library, encodes a single canonical v7 UUID with each built-in encoding, prints lengths and encoded strings, and writes a small JSON summary to examples/output.json for manual inspection.
- The examples script must be runnable via node examples/encode-uuid.js once the source API is implemented.

Tests:

- Add tests/unit/uuid-comparison.test.js that programmatically generates the comparison table and asserts the presence of entries for all built-ins and that the densest encoding produces the minimal uuidLength among registered encodings.

# Acceptance criteria

- README.md updated to include a UUID encoding comparison table (the test checks for a table-like section or the expected rows).
- examples/encode-uuid.js exists under examples/ (this is a documentation artifact; implementation may be added in subsequent iteration).
- Unit test asserting the comparison data includes base62, base85, base91, base92 and that the reported minimal length is less than base64's 24.
