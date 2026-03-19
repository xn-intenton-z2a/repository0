HIGH_DENSITY_CUSTOM

# Summary

Provide the ability to define a custom, high-density encoding from a user-supplied charset string and expose createEncoding(charsetString) -> { encode, decode, name, bitsPerChar, charsetSize }.

# Motivation

The mission requires exploring the frontier of binary-to-text encoding density. Allowing custom charsets over the printable ASCII range (U+0021..U+007E excluding space) and removing visually ambiguous characters enables creation of encodings denser than base64 and base62 while still being printable.

# Specification

- Export a factory: createEncoding(charsetString).
- The factory returns an object with named functions: encode(uint8Array) and decode(string), plus metadata: name (derived or provided), bitsPerChar (calculated precisely), charsetSize (number of codepoints), and estimatedUuidLength(bytes=16).
- Enforce input validation: charset must contain only printable characters, no control characters, and must exclude ambiguous characters 0 O 1 l I (the list may be configurable).
- Provide a built-in high-density charset example using printable ASCII excluding ambiguous characters; document the chosen charset.

# Tests / Acceptance Criteria

- Round-trip: for any encoding returned by createEncoding, decode(encode(buf)) === buf for edge cases (empty, 1 byte, all-0x00, all-0xFF) and random buffers.
- Custom charset validation rejects invalid charsets and provides clear error messages.
- Bits-per-character is calculated and used to estimate UUID encoded length; unit tests assert that the provided built-in high-density encoding produces fewer than 22 characters for a 16-byte UUID (i.e., denser than base64).
- Exports are named and available from src/lib/main.js; tests verify the example charset and its UUID output length.
