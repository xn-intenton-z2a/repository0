# ROUNDTRIP_TESTS

Status: Done (tests/unit/encoding.test.js)

Overview

Unit tests validate round-trip correctness, edge cases, and the UUID-length density goal across all registered encodings. Tests are deterministic and fast.

Test requirements (implemented)

- Round-trip property: for each encoding in listEncodings(), assert decode(encode(bytes)) equals original bytes for:
  - empty buffer
  - single byte examples (0x00, 0x7F, 0xFF)
  - 16-byte all-zero and all-0xFF
  - deterministic random buffers (seeded/simple vectors)
- UUID shorthand tests: encodeUUIDShorthand/decodeUUIDShorthand round-trip on sample UUIDs and input normalisation.
- Length assertions: for sample UUIDs, compute encoded lengths across encodings and assert the densest encoding produces length < 22.
- Charset safety: verify encoded outputs contain only characters from the encoding charset and no control characters.

Acceptance criteria (testable)

- Tests live in tests/unit and run with npm test; current test coverage includes these vectors and assertions (see tests/unit/encoding.test.js).
- Tests assert error conditions (invalid UUID input, invalid charset registration) and the library throws informative errors.

Implementation notes

- Keep the test vectors deterministic and the suite small to enable fast CI runs.
- Helpers are placed in tests/unit to reduce duplication.
