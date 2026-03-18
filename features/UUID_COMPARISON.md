# UUID_COMPARISON

Status: Planned — generator script and README integration required (use public API in src/lib/main.js).

Overview

Provide a reproducible generator that produces a markdown comparison table of encoded UUID lengths and example encodings across all registered encodings. The generator consumes the library's public API (listEncodings and encodeUUIDShorthand) and emits a stable markdown table suitable for inclusion in docs/ or README.md.

Goals

- Make UUID-length and representation comparisons reproducible and machine-checkable.
- Ensure the docs always reflect the live registry and the chosen densest encoding.
- Keep the generator dependency-free (Node builtin modules only).

Behavior

- Script path: examples/generate-uuid-comparison.js (create under examples/ if not present).
- Default sample UUIDs: canonical sample, all-zero (00000000-0000-0000-0000-000000000000), all-0xFF (ffffffff-ffff-ffff-ffff-ffffffffffff), and two deterministic test UUIDs used by unit tests.
- Command-line flags:
  - --out <path>  : write the generated markdown to <path> (default docs/UUID_COMPARISON.md)
  - --stdout      : print the markdown to stdout instead of writing a file
  - --encodings   : comma-separated list of encoding names to include (default: all encodings returned by listEncodings())
  - --samples     : comma-separated list of UUIDs to use instead of the defaults

Output format

- First row: header with encoding names and bitsPerChar (two decimals) in parentheses, ordered by bitsPerChar descending.
- Each subsequent row: a sample UUID and, for each encoding column, the encoded value followed by its length in parentheses (example: abcDEF (20)).
- The output must be valid markdown table syntax and deterministic when run with the same registry and sample UUIDs.

Acceptance criteria (testable)

1. Script presence: examples/generate-uuid-comparison.js exists and is executable by Node, and when invoked with --stdout prints a valid markdown table and exits with code 0.
2. Column parity: when run without --encodings the number of encoding columns equals listEncodings().length and the header names exactly match listEncodings() names and reported bitsPerChar rounded to two decimals.
3. Cell parity: for every sample UUID and encoding, the cell's encoded string length equals the length of encodeUUIDShorthand(sampleUuid, encodingName) as returned by the library; tests compute live values and compare lengths and strings exactly.
4. Densest encoding goal: the encoding reported in the header as the densest (highest bitsPerChar) produces encoded lengths strictly less than 22 characters for each canonical sample UUID (this verifies the mission's UUID-length benchmark).
5. README/docs integration: the repository README.md contains either an embedded table or a link to docs/UUID_COMPARISON.md; a unit test asserts the presence of docs/UUID_COMPARISON.md or a README link.
6. Deterministic output: running the script twice with identical inputs (registry and samples) yields byte-for-byte identical outputs.

Implementation notes

- The script must only use public API functions exported from src/lib/main.js (listEncodings, encodeUUIDShorthand) so it reflects the live registry.
- Avoid third-party dependencies; use fs, path, and process for I/O and argument parsing.
- Prefer --stdout for CI tests to avoid filesystem writes.
- Add a minimal unit test tests/unit/generate-uuid-comparison.test.js that spawns the script with --stdout, parses the table, and asserts acceptance criteria 2-4 using live API calls.

Rationale

Having a generator that relies on the library's public API ensures the README/docs remain accurate as encodings are added or changed and provides a machine-testable artifact for the mission benchmark.
