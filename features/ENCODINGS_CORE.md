# ENCODINGS_CORE

# Overview

Provide the library core API for defining, encoding and decoding binary data using named printable encodings.
This feature specifies the module-level functions, their behaviours, export contract, and required tests.

# Motivation

The mission requires a small JS library that can encode arbitrary binary to printable strings and decode them back. A clear, testable core API makes it possible to add and compare dense encodings and to expose UUID-specific helpers.

# Specification

Public API (named exports from src/lib/main.js):

- encode(buffer, encoding): Encode an ArrayBuffer, Buffer, or Uint8Array to a string using the named encoding.
- decode(str, encoding): Decode a string produced by encode back to a Uint8Array.
- encodeUUID(uuid): Accepts a v7 UUID string or 16-byte buffer and returns the encoded string using the default densest encoding.
- decodeUUID(str): Decode a previously encoded UUID string back to a canonical 16-byte buffer or hex string.
- createEncoding(name, charset): Register a custom encoding by providing a name and a sequence of printable characters used as symbols (first char = value 0). The implementation must compute bits-per-character and store metadata.
- listEncodings(): Return an array of available encodings; each entry must include: name, charset length, bitsPerChar (float), uuidLength (chars when encoding 16 bytes)

Behavioural rules:

- Round-trip: For any binary input and any registered encoding, decode(encode(x, enc), enc) must equal x exactly (byte-equal).
- Input types: encode accepts Uint8Array, Buffer, ArrayBuffer or Node.js Buffer-like objects. decode returns Uint8Array.
- No control characters: Charsets must not include control characters. Implementations should validate charset and reject invalid characters.
- Non-ambiguous: Where possible, exclude visually ambiguous characters (0/O, 1/l/I) by default for built-in encodings.
- Deterministic UUID default: encodeUUID uses the repository's densest built-in encoding by default; decodeUUID accepts input encoded with any registered encoding and should detect encoding or accept an optional encoding parameter.

Compatibility and exports:

- All functions must be named exports from src/lib/main.js and documented in README.

# Tests

Unit tests must be added to tests/unit/core.test.js and include:

- Round-trip property tests for a variety of buffers (empty, single byte, all-zero 16 bytes, all-0xFF 16 bytes, random buffers of multiple lengths).
- Input type coverage (ArrayBuffer, Uint8Array, Buffer).
- listEncodings returns metadata and correct uuidLength for registered encodings.

# Acceptance criteria

- encode, decode, createEncoding, listEncodings, encodeUUID, decodeUUID are exported as named exports from src/lib/main.js.
- Round-trip holds for all tests in tests/unit/core.test.js (empty, single-byte, all-zero, all-0xFF, random samples).
- createEncoding rejects invalid charsets (control chars, duplicate characters) with a clear error.
- listEncodings returns correct bitsPerChar and uuidLength values for every built-in encoding.
- Tests added and passing in the repository's test suite when implemented.
