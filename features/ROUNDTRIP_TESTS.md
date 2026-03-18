# ROUNDTRIP_TESTS

Overview

Specify the unit-test surface necessary to validate round-trip correctness, edge cases, and the UUID length density goals across all encodings. Tests are intended to be fast, deterministic, and to exercise both built-in and custom encodings.

Test requirements

- Round-trip property: for each encoding in listEncodings(), assert decode(encode(bytes)) equals original bytes for test vectors:
  - empty buffer (Uint8Array(0))
  - single byte values (0x00, 0x01, 0x7F, 0xFF)
  - 16-byte all-zero and all-0xFF
  - random byte buffers (use a fixed seed to generate a small set of random cases)
- UUID shorthand tests: encodeUUIDShorthand/decodeUUIDShorthand round-trip on sample UUIDs and normalization of input formats (uppercase, no-dash).
- Length assertions: for each sample UUID, compute encoded length across encodings and assert the repository's densest encoding produces length < 22.
- Charset safety: verify encoded outputs contain no control characters and only characters from the encoding's listed charset.

Acceptance criteria

- Tests live under tests/unit and run with `npm test`.
- All tests pass in CI and locally.
- Tests explicitly cover error conditions (invalid UUID input, invalid charset registration) and assert the library throws informative errors.

Implementation notes

- Use deterministic random test vectors and keep the suite small to avoid long CI runs.
- Place helper test vectors in a shared test helper file to keep tests DRY.
