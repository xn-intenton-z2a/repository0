# README_COMPARISON

Status: Planned

Overview

Ensure the repository README includes a concise, deterministic Encoding comparison section summarising the built-in encodings, their bits/char, charset sizes and an example encoded UUID for each. The README should either embed a small table or link to docs/UUID_COMPARISON.md produced by examples/generate-uuid-comparison.js.

Requirements

- README.md must contain a header containing the phrase "Encoding comparison" and either a markdown table or a link to docs/UUID_COMPARISON.md.
- The table or linked document must reflect the current registry (listEncodings()).

Acceptance criteria (testable)

1. README.md contains the string "Encoding comparison" and either contains a markdown table with a header column named "Encoding" or contains a link to docs/UUID_COMPARISON.md.
2. A unit test (tests/unit/readme.test.js) can parse the README and assert header presence and that at least one built-in encoding name (e.g., base62) appears in the table or linked file.
3. The README highlights the shortest/ densest encoding and shows its encoded length for a representative UUID (e.g., sample canonical UUID) or links to the generated docs that do so.

Implementation notes

- Prefer linking to a generated docs/UUID_COMPARISON.md to keep README stable; generation can be part of release scripts.
- Keep the README table minimal so maintainers can update it easily when registries change.
