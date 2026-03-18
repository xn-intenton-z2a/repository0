# BASE_ENCODINGS

Status: Done

Overview

Implement and register the baseline encodings used by the library: base62, base85 and base91. These encodings are available via listEncodings() and are used by the CLI, examples and tests.

Acceptance criteria

1. listEncodings() returns entries for base62, base85 and base91 with charset sizes 62, 85 and 91 and bitsPerChar approximately 5.954, 6.409 and 6.508 respectively.
2. encode(name, Uint8Array) and decode(name, string) round-trip for all inputs including edge cases: empty buffer, single byte, all-zero and all-0xFF.
3. encodeUUIDShorthand(uuid, name) produces the expected encoded strings and lengths; the densest of these encodings yields length < 22 for the canonical sample UUID.
4. Unit tests under tests/unit covering the above exist and pass (npm test returns exit 0).

Notes

Keep registry names stable: base62, base85, base91.
