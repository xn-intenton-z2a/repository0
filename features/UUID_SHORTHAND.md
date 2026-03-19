# UUID_SHORTHAND

Summary

Add a convenience feature to encode and decode UUIDs using the existing encodings with a shorthand API. The shorthand strips dashes from UUID v7 string input, converts hex to 16 bytes, reverses the byte order (as required by the mission), and encodes using a named encoding. Decoding performs the reverse steps and returns a canonical dashed UUID string.

Goals

- Provide uuidEncode(encodingName, uuidString) -> string
- Provide uuidDecode(encodingName, encodedString) -> uuidString (canonical dashed lower-case hex groups)
- Use the library encode/decode primitives to perform binary-to-text transformation.
- Ensure round-trip: uuidDecode(encoding, uuidEncode(encoding, uuid)) == normalized uuid (lowercase, dashes in canonical positions).

API & Behaviour

- Named exports: uuidEncode, uuidDecode.
- uuidEncode should accept a UUID string (with or without dashes) validate length and characters, strip dashes, convert to 16-byte Uint8Array, reverse the byte order, then call encode and return the encoded string.
- uuidDecode should call decode, reverse the byte order of the resulting 16 bytes, and return a canonical UUID string formatted as 8-4-4-4-12 lowercase hex.

Acceptance Criteria

- uuidEncode and uuidDecode are exported from src/lib/main.js and documented in README.
- Round-trip for valid UUID v7 strings across all built-in encodings.
- Input validation rejects non-UUID input with a clear error.
- Unit tests covering variants: dashed uuid, undashed uuid, uppercase input, invalid length, and round-trip verification for every built-in encoding.

Notes

Keep the shorthand strictly as a thin convenience layer with clear validation and deterministic formatting. This feature depends on the encodings feature and must be implemented after or together with ENCODINGS.