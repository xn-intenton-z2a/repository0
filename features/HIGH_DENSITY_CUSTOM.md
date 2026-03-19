HIGH_DENSITY_CUSTOM

# Summary

Expose a factory to create custom high-density encodings from a printable-character charset string and include a built-in high-density example that is denser than base64 for UUIDs.

# Motivation

To explore the frontier of binary-to-text density the library must allow user-defined encodings over printable ASCII while excluding ambiguous and control characters. A built-in example demonstrates achieving fewer than 22 characters for a 16-byte UUID.

# Specification

- Named export (from src/lib/main.js): createEncoding(charsetString[, options]) -> encodingObject.
- encodingObject contains: encode(uint8Array) -> string, decode(string) -> Uint8Array, name (string), bitsPerChar (number), charsetSize (integer), estimatedUuidLength(bytes=16) -> integer.
- Validation rules: charsetString must be a sequence of unique printable characters in the ASCII range U+0021..U+007E excluding the space character; by default disallow visually ambiguous characters: 0, O, 1, l, I. createEncoding must throw a descriptive error on invalid charsets.
- Built-in example: include a documented high-density charset (derived from printable ASCII minus ambiguous characters) named "high-density-ascii" whose bitsPerChar is calculated precisely and which produces an encoded UUID length strictly less than 22 characters.

# Tests / Acceptance Criteria

- Round-trip: For the built-in example and for at least one randomly generated valid charset, assert decode(encode(buf)) === buf for edge cases (empty, 1 byte, all-0x00, all-0xFF) and random buffers.
- Validation: createEncoding rejects invalid charsets (control chars, duplicates, disallowed ambiguous characters) and unit tests assert the error messages.
- Density target: The built-in high-density example must produce an encoded 16-byte UUID length < 22 characters; a unit test must assert this numerically.
- Export checks: createEncoding is exported from src/lib/main.js and the built-in example is discoverable through listEncodings().
