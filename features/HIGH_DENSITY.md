# HIGH_DENSITY

Overview

Allow creating higher-density encodings from a provided charset string. The repository ships a built-in high-density printable-ASCII encoding that excludes visually ambiguous characters; users may also register custom charsets with defineEncoding. This feature documents expected behavior, metadata, and testable properties for high-density encodings.

Requirements

- defineEncoding(name: string, charset: string) registers a new encoding and returns metadata {name, charsetSize, bitsPerChar}.
- defineEncoding must validate that the charset contains unique characters and at least two characters; it should not silently accept duplicate characters.
- The library provides a built-in encoding named ascii-printable-no-ambiguous which is derived from the printable ASCII range U+0021..U+007E with commonly ambiguous characters removed (0/O, 1/l/I).
- bitsPerChar is reported as a number computed from log2(charsetSize) (tests may round to two decimals for assertions).
- A registered encoding must be usable by encode and decode and must appear in listEncodings().

Acceptance criteria

- defineEncoding registers an encoding that passes round-trip encode/decode tests for representative inputs including empty buffer, all-zero 16-byte UUID, all-0xFF 16-byte UUID, and a few deterministic random buffers.
- defineEncoding throws a descriptive error when charset contains duplicate characters or fewer than two characters.
- listEncodings includes the ascii-printable-no-ambiguous built-in encoding with accurate charsetSize and bitsPerChar values (tests may assert bitsPerChar = Math.log2(charsetSize) within 0.01).
- Using the repository's provided maximal printable charset (ascii-printable-no-ambiguous) as the densest encoding produces encoded UUID lengths strictly less than base64 (22 characters) for the sample UUIDs used in tests.

Implementation notes

- normalize and de-duplicate charsets at registration is recommended but implementations may instead reject duplicates; tests will assert that duplicate input is rejected.
- The library intentionally separates registration concerns from validation of ambiguous characters: the built-in high-density charset excludes ambiguous characters, but defineEncoding only enforces uniqueness and minimum size so custom charsets remain flexible.
- Store encoding metadata with: name, charset, charsetSize, bitsPerChar (number), and ensure listEncodings returns these fields sorted by bitsPerChar descending.
