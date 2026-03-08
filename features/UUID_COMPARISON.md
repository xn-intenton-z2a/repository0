# WEB_SHOWCASE

# Overview

A web-based interactive showcase that demonstrates encoding density across built-in encodings and provides an examples script and README comparison table. This feature extends the existing UUID comparison documentation by adding a small client-side demo in src/web, an examples script that produces JSON output, and unit tests that verify the comparison and the web demo build artifact.

# Motivation

The mission benchmarks the shortest printable representation of a v7 UUID. A live web demo makes density trade-offs tangible and helps users explore custom encodings. The web showcase also serves the repository website and documentation by rendering the canonical comparison table and interactive encode/decode controls.

# Specification

Scope

- Implement a small static web demo under src/web/encode-showcase that imports the library API and renders:
  - A table of built-in encodings showing name, charset length, bitsPerChar, and uuidLength for a canonical v7 UUID.
  - An input area to paste hex or upload bytes, select an encoding, and see the encoded string and resulting length.
  - A spotlight section that highlights the densest registered encoding for the canonical UUID.

Documentation and Examples

- Update README.md with a "UUID encoding comparison" section containing a table with columns: encoding, charset, bitsPerChar, uuidLength (chars), notes. Include rows for base62, base85, base91, base92, and base64 as the reference.
- Add examples/encode-uuid.js that imports the library, encodes a fixed canonical v7 UUID with every registered encoding, prints each encoded string and length to stdout, and writes a summary JSON file to examples/output.json for reviewers.

API Behaviour

- The web demo must rely only on the library public API: encode, decode, listEncodings, encodeUUID, decodeUUID. encodeUUID should use the repository's densest built-in encoding by default when demonstrating the canonical UUID.
- The library exports must be usable in a browser-bundled environment; the demo may use a minimal browser bundle approach already present in the project build script (copying src/web to docs during build).

Tests

- Add tests/unit/uuid-comparison.test.js that programmatically calls listEncodings and verifies: presence of base62, base85, base91, base92; computed bitsPerChar values; uuidLength entries for the canonical UUID; and that the minimal uuidLength is strictly less than base64's 24 characters.
- Add tests/unit/web-showcase.test.js that validates the examples/encode-uuid.js output JSON exists after running the build:web script in a simulated environment and that the JSON contains entries for all built-ins and the densest encoding marked as minimal. Keep the test fast by not invoking a full browser; rely on the build:web step which copies src/web into docs and the examples script for data generation.

Edge cases and constraints

- The web demo must not rely on non-printable or ambiguous characters; it must render safely in common browsers.
- The examples script must be runnable via node examples/encode-uuid.js and must not require global CLI tools beyond node.
- No new dependencies are added unless strictly necessary; prefer existing project scripts and the current build:web flow.

# Acceptance criteria

- src/web/encode-showcase exists and uses the library API to render the comparison table and interactive controls.
- README.md includes a "UUID encoding comparison" section with rows for base62, base85, base91, base92 and base64.
- examples/encode-uuid.js prints encoded strings and lengths and writes examples/output.json containing the table data.
- tests/unit/uuid-comparison.test.js and tests/unit/web-showcase.test.js exist and assert the expected rows and that the densest encoding yields a uuidLength less than 24.
- The demo is built into docs by running npm run build:web and the resulting docs/ contains the copied demo files.
- All acceptance criteria are achievable by modifying source, tests, README, examples and the web demo files within this repository.
