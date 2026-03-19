# ENCODINGS

Summary

Provide a set of named, testable binary-to-text encodings focused on printable-character density and round-trip correctness. This feature defines the library API surface and required encodings (base62, base85, and a denser custom encoding), metadata listing, and tests for edge cases and density benchmarks.

Goals

- Implement encode and decode functions that accept and return Uint8Array for binary input/output.
- Provide createEncoding(charsetString) to define custom encodings from a charset string while filtering out control and ambiguous characters (0/O, 1/l/I).
- Expose listEncodings() returning metadata objects: { name, bitsPerChar, charsetSize, urlSafe boolean }.
- Include built-in encodings: base62, base85 (Ascii85/Z85), and a higher-density custom encoding using printable ASCII U+0021–U+007E (omit space and ambiguous characters).

API & Behaviour

- Named exports: encode, decode, createEncoding, listEncodings.
- encode(name, input: Uint8Array) -> string
- decode(name, input: string) -> Uint8Array
- createEncoding(name, charsetString) -> adds encoding accessible by name
- listEncodings() -> Array of metadata
- All encodings must satisfy round-trip: decode(encode(bytes)) equals original bytes for arbitrary inputs.

Acceptance Criteria

- encode/decode functions operate on Uint8Array and strings respectively and are exported from src/lib/main.js.
- At least three working encodings exist: base62, base85, and one denser custom encoding.
- listEncodings returns metadata including bits/char and charset size for every encoding.
- createEncoding accepts a charset string, removes invalid/ambiguous characters, and registers a new encoding available via encode/decode.
- Unit tests cover edge cases: empty buffer, single byte, all-zero buffer, all-0xFF buffer and verify round-trip.
- Tests compare UUID encoding lengths across encodings and verify the densest encoding produces UUID representations shorter than base64 (22 chars).

Notes

Keep algorithmically simple, well-tested implementations; prefer correctness and deterministic round-trip over micro-optimisations. Implementations should avoid control characters and adhere to printable ASCII restrictions.