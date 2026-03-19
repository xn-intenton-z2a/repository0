BASE62

# Summary

Provide a clear, testable base62 encoding and decoding implementation for Uint8Array using the character set 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ. Include a UUID shorthand that strips dashes, encodes the 16 bytes, and reverses the final string as the mission requires.

# Motivation

Base62 is the baseline printable encoding used for comparison across denser encodings. It must be stable, URL-safe, and have explicit, testable behavior for library consumers and unit tests.

# Specification

- Named exports (from src/lib/main.js): encodeBase62(uint8Array) -> string, decodeBase62(string) -> Uint8Array.
- UUID shorthand named exports: encodeUUIDBase62(uuidString) -> string, decodeUUIDBase62(encodedString) -> Uint8Array. Shorthand behavior: strip dashes from canonical UUID, treat resulting 16 bytes as input, encode, then reverse the encoded string.
- Charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" (62 characters).
- Documented metadata: name: "base62", charsetSize: 62, bitsPerChar: ~5.9542, expectedUuidLength: 22 characters.
- API must accept and return Uint8Array for binary data operations.

# Tests / Acceptance Criteria

- Round-trip: For all test buffers buf (including empty buffer, single byte, all-0x00, all-0xFF, and random samples) assert decodeBase62(encodeBase62(buf)) equals buf byte-for-byte.
- UUID shorthand round-trip: For sample UUIDs assert decodeUUIDBase62(encodeUUIDBase62(uuid)) yields the original 16 UUID bytes.
- Export checks: Tests assert the named exports exist on src/lib/main.js and are functions.
- Length metadata: Unit tests assert encodeUUIDBase62 produces an output of 22 characters for canonical 16-byte UUID inputs.
- Edge behavior: Encoders/decoders throw a clear, documented error for invalid inputs (wrong types, invalid characters) and do not produce control characters.
