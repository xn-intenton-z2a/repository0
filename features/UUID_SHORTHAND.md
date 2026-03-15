# UUID_SHORTHAND

Status: implemented (closed issue #3033)

Overview

Specify the library shorthand for encoding v7 UUIDs so consumers can obtain the densest printable representation quickly and decode back to the canonical UUID.

Specification

- Input: a canonical UUID string in the standard 8-4-4-4-12 hexadecimal format (lower or upper case allowed).
- Procedure: remove all dash characters from the UUID string, parse the remaining 32 hex characters into 16 bytes (big-endian per-byte order), encode the 16-byte buffer using the selected named encoding, then reverse the encoded string to produce the final shorthand.
- Output: a printable string produced by the encoding and reversed.
- decodeUUID must reverse the steps: reverse the shorthand, decode into 16 bytes, render as 32 hex chars, insert dashes at canonical positions and return lower-case canonical UUID string.

Acceptance criteria

- encodeUUID accepts only valid UUID strings and throws on invalid format.
- decodeUUID returns a canonical UUID string equal to the original input after a round-trip through encodeUUID for all valid v7 UUID test vectors.
- Unit tests include canonical v7 UUID examples and verify encoded lengths for each built-in encoding.
- The shorthand is documented in README with an example table of encoded lengths for a sample v7 UUID.

Notes

- The reversal step is part of the shorthand to improve density and should be inverted by decodeUUID. Implementation details (endianness, hex parsing) must be documented in code comments and unit tests.