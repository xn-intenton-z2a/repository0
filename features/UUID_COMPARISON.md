# UUID_COMPARISON

Status: Planned — add examples script and README table

Overview

Provide a reproducible, human-readable comparison table of encoded UUID lengths across all registered encodings. While unit tests assert that the densest encoding is shorter than base64, a generator script will produce a stable markdown table suitable for README inclusion and documentation.

Goals

- Add examples/generate-uuid-comparison.js: a small Node script that imports the library API (listEncodings, encodeUUIDShorthand), uses canonical sample UUIDs (sample, all-zero, all-0xFF, deterministic random) and writes docs/UUID_COMPARISON.md or emits the table to stdout when requested.
- Table format: markdown table where rows are sample UUIDs and columns are encodings; each cell contains the encoded string and its length (e.g., "abc... (20)").
- Add a package.json script entry examples:generate-uuid-comparison to run the generator.
- Provide a unit test tests/unit/generate-uuid-comparison.test.js that validates generator output and that lengths reported match live encoding results.

Requirements

- The generator must use only the public API: listEncodings() and encodeUUIDShorthand/encode() so the table always reflects the current registry and charsets.
- Default output path: docs/UUID_COMPARISON.md; support --out and --stdout flags.
- Deterministic sample UUIDs are defined in tests/unit/helpers so generator output is stable across runs and CI.

Acceptance criteria (testable)

- examples/generate-uuid-comparison.js exists and runs; when executed with --stdout it prints a valid markdown table to stdout and exits 0.
- tests/unit/generate-uuid-comparison.test.js passes in CI: the test invokes the generator (in-memory or via --stdout) and asserts:
  - The output contains one column per encoding returned by listEncodings().
  - For each sample UUID and encoding, the encoded string length reported in the table equals the length of the string produced by the library's encode/encodeUUIDShorthand functions.
  - The densest encoding reported in the table produces length < 22 for the canonical sample UUIDs.
- README.md includes a link to docs/UUID_COMPARISON.md or embeds the generated table; the generator test verifies the presence of the link or the table snippet in README.md (configurable via the test).

Implementation notes

- Keep the generator dependency-free and small; use Node built-in fs and path modules.
- The generator should be idempotent: running it multiple times produces the same output for the same registered encodings and sample UUIDs.
- Offer optional filtering via --encodings=comma,separated to generate a subset for quicker local checks.
