# ENCODINGS

Summary

Provide a set of named, testable binary-to-text encodings focused on printable-character density and deterministic round-trip correctness. This feature defines the library API surface and required built-in encodings (base62, base85, and a denser custom encoding), metadata listing, and unit tests for edge cases and density benchmarks.

Goals

- Implement encode and decode functions that accept and return Uint8Array for binary input/output.
- Provide createEncoding(name, charsetString) to define custom encodings from a charset string while filtering out control and ambiguous characters (0/O, 1/l/I).
- Expose listEncodings() returning metadata objects: { name, bitsPerChar, charsetSize, urlSafe }.
- Include built-in encodings: base62, base85 (Ascii85/Z85), and a higher-density custom encoding using printable ASCII U+0021–U+007E excluding space and ambiguous characters.

API & Behaviour

- Named exports from src/lib/main.js: encode, decode, createEncoding, listEncodings.
- Function signatures:
  - encode(name: string, input: Uint8Array) -> string
  - decode(name: string, input: string) -> Uint8Array
  - createEncoding(name: string, charsetString: string) -> void
  - listEncodings() -> Array<{ name, bitsPerChar, charsetSize, urlSafe }>
- All encodings must satisfy round-trip: decode(name, encode(name, bytes)) equals original bytes for arbitrary inputs.
- No control characters allowed in any output; charsets must be printable only.
- createEncoding must remove prohibited characters (control, space, and ambiguous characters 0,O,1,l,I) and error if resulting charset length < 2.

Acceptance Criteria

- encode/decode operate on Uint8Array and string and are exported from src/lib/main.js.
- At least three working encodings exist: base62, base85, and one denser custom encoding accessible by name.
- listEncodings returns metadata including bitsPerChar and charsetSize for every encoding.
- createEncoding accepts a charset string, sanitises it (removes control and ambiguous characters), registers the encoding, and makes it available via encode/decode.
- Unit tests cover edge cases: empty buffer, single byte, all-zero buffer, all-0xFF buffer, and verify round-trip.
- A unit test compares encoded UUID lengths across all encodings and asserts the densest encoding produces UUID representations shorter than base64 (22 characters) for a 16-byte UUID.
- Tests confirm no encoded output contains control characters or disallowed ambiguous characters.

Notes

Prioritise correctness and deterministic behaviour. Keep implementations straightforward and well-tested rather than micro-optimised.