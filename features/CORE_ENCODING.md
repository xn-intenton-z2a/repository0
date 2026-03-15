# CORE_ENCODING

Status: implemented (closed issue #3033)

Overview

Define the core encoding engine and public API for encoding and decoding arbitrary binary data using named encodings. This feature specifies inputs, outputs, validation rules, and the round-trip guarantees required by the mission.

Public API

- encode(bytes, encodingName): Accepts a Uint8Array named bytes and a string encodingName. Returns an encoded printable string produced by the named encoding.
- decode(text, encodingName): Accepts an encoded string and a string encodingName. Returns a Uint8Array equal to the original bytes when the encoding is valid.
- defineEncoding(name, charset): Define or update a named encoding from a charset string. Charset must contain only printable non-control characters and no visually ambiguous characters.
- listEncodings(): Return an array of encoding metadata objects: name, bitsPerChar, charsetSize.
- encodeUUID(uuidString, encodingName): Shorthand: strip dashes from uuidString, parse as 16 raw bytes, encode bytes with encodingName, then reverse the resulting encoded string. Returns the shorthand string.
- decodeUUID(shorthand, encodingName): Reverse the encodeUUID steps to recover the canonical UUID string (with dashes inserted in canonical positions).

Behavioral rules

- Input types: encode and decode must accept and return the types specified above (Uint8Array and string). Implementations must validate types and throw descriptive errors on invalid input.
- Round-trip: For every defined encoding and for all test vectors, decode(encode(bytes, name), name) must equal bytes.
- No control characters in encoded output. All encodings must map to printable characters only.
- Ambiguity rules: defineEncoding must reject charsets that include control characters, space, or ambiguous characters 0 O 1 l I.

Acceptance criteria

- All public functions are exported as named exports from src/lib/main.js.
- Round-trip unit tests exist and pass for the following vectors: empty buffer, single-byte buffers (0x00 and 0xFF), 16-byte all-zero and all-0xFF buffers, and several random buffers.
- Invalid inputs produce thrown errors (bad types, empty charset, duplicate characters in charset).
- encodeUUID and decodeUUID operate as specified and round-trip for valid v7 UUID strings.
- Tests assert that encoded strings contain no control characters and only use permitted charset characters.

Testing notes

Add unit tests under tests/unit that import named exports from src/lib/main.js and exercise the API and edge cases above.