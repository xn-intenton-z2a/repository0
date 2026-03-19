# UUID_SHORTHAND

Summary

Provide a concise UUID shorthand API that leverages the encodings feature to encode and decode UUID v7 values. The shorthand converts a UUID string to the 16-byte representation required by the mission (strip dashes, hex -> bytes, reverse byte order), encodes it with a named encoding, and decodes back to a canonical dashed lowercase UUID string.

Goals

- Provide uuidEncode(encodingName: string, uuidString: string) -> string
- Provide uuidDecode(encodingName: string, encodedString: string) -> string (canonical dashed lowercase)
- Reuse encode/decode primitives from ENCODINGS; do not duplicate encoding logic.
- Validate input strictly and return clear errors for invalid UUID inputs.

API & Behaviour

- Named exports from src/lib/main.js: uuidEncode, uuidDecode.
- uuidEncode behaviour:
  - Accept UUID with or without dashes, uppercase or lowercase.
  - Validate hex length equals 32 after stripping dashes; reject otherwise with a thrown Error.
  - Convert hex to a 16-byte Uint8Array, reverse the byte order, call encode(encodingName, bytes), and return the encoded string.
- uuidDecode behaviour:
  - Call decode(encodingName, encodedString) to obtain bytes, verify length is 16, reverse byte order, format as canonical dashed lowercase UUID (8-4-4-4-12) and return.
- Round-trip property: uuidDecode(encoding, uuidEncode(encoding, uuid)) equals normalized canonical uuid (lowercase with dashes).

Acceptance Criteria

- uuidEncode and uuidDecode are exported from src/lib/main.js and documented in README.
- Round-trip correctness for valid UUID v7 values across all built-in encodings and any custom encodings created via createEncoding.
- Input validation rejects invalid UUID strings with descriptive errors (invalid characters, wrong length).
- Unit tests cover: dashed and undashed inputs, uppercase inputs, invalid length, invalid characters, and round-trip verification for each built-in encoding.

Notes

Keep the shorthand as a thin, well-tested convenience layer dependent on the encodings API. Do not change the canonical UUID formatting rules.