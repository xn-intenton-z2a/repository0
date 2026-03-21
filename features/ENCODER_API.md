# ENCODER_API

Summary

Provide a small, well-specified public API that exposes named binary-to-text encodings and utilities. The API is implemented and exported from src/lib/main.js as named exports so callers can import individual functions.

Scope

- Registry of named encodings (built-in + user-created).
- Top-level functions: listEncodings, createEncoding, encode, decode, encodeUuidShorthand, decodeUuidShorthand.
- All encode/decode operations accept and return binary as Uint8Array for the binary form and string for the textual form.

Public surface (behavioural description)

- listEncodings: returns an array of metadata objects for each registered encoding. Each metadata object includes name, charsetSize, bitsPerChar, urlSafe (boolean) and a helper exampleLengthFor(bytes).
- createEncoding: takes a charset string and optional options (name, omitAmbiguous). Validates uniqueness and allowed characters. Returns an encoding object with encode(input: Uint8Array): string and decode(input: string): Uint8Array plus metadata.
- encode: convenience that accepts (encodingName, input: Uint8Array) and returns encoded string. Throws on unknown encoding.
- decode: convenience that accepts (encodingName, input: string) and returns Uint8Array. Throws on invalid characters or unknown encoding.
- encodeUuidShorthand: accepts a UUID string, removes hyphens, validates hex length (32 hex chars), converts pairs to 16 bytes, optionally reverses bytes per options, then encodes with the selected encoding. Returns encoded string.
- decodeUuidShorthand: decodes an encoded UUID string using the named encoding and returns the canonical hyphenated UUID string.

Design constraints

- Input binary type is strictly Uint8Array. Implementations must not accept Node Buffer or other opaque types without an explicit conversion helper.
- Round-trip property: decode(encode(x)) must equal x for all inputs and for all encodings registered by createEncoding and built-ins.
- No control characters in charsets. Default factory should filter or reject control characters.

# ACCEPTANCE CRITERIA

- All functions listed above are exported as named exports from src/lib/main.js.
- listEncodings returns metadata objects for all built-in encodings and any created custom encodings.
- encode/decode accept/return Uint8Array and string respectively, and unit tests verify round-trip property for multiple encodings and edge cases.
- createEncoding validates charset uniqueness and rejects or normalises ambiguous characters when requested; tests cover invalid charset cases.
- encodeUuidShorthand and decodeUuidShorthand round-trip for valid UUIDs, including nil UUID and random v7-like UUIDs. Tests live in tests/unit/ and assert expected outputs.
