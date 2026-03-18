# ENCODING_LIST

Status: Done (listEncodings in src/lib/main.js)

Overview

Provide a library-level and CLI/web-level facility to enumerate available encodings and their metadata. Metadata includes name, charsetSize, bitsPerChar (number, two decimals), and a short charset sample.

Requirements

- listEncodings(): returns an array of objects {name, charset, charsetSize, bitsPerChar}.
- CLI and web demos should consume this function to render metadata in tables.

Acceptance criteria (testable)

- listEncodings returns at least the built-in encodings and any user-registered encodings; unit tests in tests/unit/encoding.test.js assert the returned structure and ordering by bitsPerChar.
- bitsPerChar calculation is consistent with Math.log2(charsetSize) within a small tolerance.
- The returned array is sorted by bitsPerChar descending.

Implementation notes

- Keep the returned metadata small and stable so external tools can rely on the fields.
- For README generation or web UI examples, consume listEncodings() directly rather than duplicating character set logic.
