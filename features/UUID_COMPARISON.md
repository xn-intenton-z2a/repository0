# UUID_COMPARISON

Status: Planned — generator script and README integration required.

Overview

Provide a reproducible markdown comparison of encoded UUID lengths across all registered encodings. This feature supplies a small generator script (examples/generate-uuid-comparison.js) that consumes the public API (listEncodings and encodeUUIDShorthand) and emits a stable markdown table suitable for inclusion in docs/ or README.md.

Generator behaviour

- Input: no args uses canonical sample UUIDs (sample, all-zero, all-0xFF, deterministic pseudo-random UUIDs defined in tests/unit/helpers).
- Output: markdown table where the header row lists encoding names (and bitsPerChar), each subsequent row corresponds to a sample UUID and each cell contains the encoded string followed by its length in parentheses (for example: abcDEF (20)).
- Flags: --out <path> writes to path, default docs/UUID_COMPARISON.md; --stdout prints to stdout; --encodings name1,name2 restricts the encodings included.
- The generator uses only public API functions — listEncodings and encodeUUIDShorthand — so output always reflects the live registry.

Acceptance criteria (testable)

- Script presence: examples/generate-uuid-comparison.js exists and when executed with --stdout prints a valid markdown table and exits 0.
- Column parity: tests in tests/unit/generate-uuid-comparison.test.js assert that the number of encoding columns equals the length of listEncodings() and that header names match listEncodings() names and bitsPerChar values.
- Cell parity: for each sample UUID and encoding, the table cell length equals the length of encodeUUIDShorthand(uuid, encoding) returned by the library; the test computes live values and compares against generator output (string lengths and encoded strings must match exactly).
- Densest encoding goal: the generator test asserts that the encoding reported as densest (highest bitsPerChar) yields encoded length < 22 for the canonical sample UUIDs.
- README integration: README.md must either embed the generated table or include a link to docs/UUID_COMPARISON.md; a test asserts the presence of the file or link.

Implementation notes

- Keep the generator dependency-free (use fs and path). The script should be idempotent and deterministic given the same registry and sample UUIDs.
- Provide an npm script examples:generate-uuid-comparison that runs the generator with sensible defaults (optional; the task implementing the generator can add the script).
- Tests should use --stdout to avoid filesystem writes during CI when possible and parse the output programmatically.
