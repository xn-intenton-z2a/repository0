UUID v7 — Timestamp-ordered UUID (draft specification)

Table of contents
- High-level description
- Canonical byte layout (implementation summary)
- Version and variant bits
- Shorthand encoding (mission-specific)
- Round-trip and validation rules
- Supplementary details and collision considerations
- Reference details (fields, bit widths)
- Digest and retrieval
- Attribution and data size

High-level description
- UUID version 7 is a time-ordered UUID format designed to place a millisecond-resolution UNIX epoch timestamp in the most-significant bits so that lexical ordering matches time order.
- v7 is intended to be sortable by creation time while remaining a 128-bit UUID with the usual version/variant fields.

Canonical byte layout (implementation summary)
- The draft places a 48-bit unsigned Unix timestamp in milliseconds in the high-order bits of the UUID (most-significant 48 bits).
- The 4-bit version field is set to 7 in the designated version nibble.
- The remaining bits are used for randomness/entropy to fill out 128 bits and to satisfy the RFC 4122 variant field (RFC variant bits must be set as usual).

Version and variant bits
- Version: set the 4-bit version to binary 0111 (decimal 7) in the appropriate high-nibble of the time/clock sequence field as defined by UUID layout.
- Variant: follow RFC 4122 variant bit pattern (two or three high bits of the variant octet set per RFC) so UUIDs remain recognizable as RFC-variant UUIDs.

Shorthand encoding (mission-specific)
- To shorthand-encode a UUID string for this library:
  1. Remove dashes from the canonical UUID text form (32 hex digits).
  2. Parse the 32 hex characters into a 16-byte array (Uint8Array of length 16).
  3. Reverse the byte order if the mission requires it (mission states: "strip dashes from a UUID string, encode the 16 bytes, and reverse"). Confirm intended reverse direction in callers; implement deterministic behaviour: reverse after converting hex to bytes.
  4. Pass the resulting 16-byte Uint8Array to the chosen encoding implementation (e.g., base62/base85/custom) to produce the compact printable form.

Round-trip and validation rules
- Round-trip correctness requires the decode operation to return the exact 16-byte sequence produced by step 3; when reversing is part of encoding, decode must reverse back before hexification.
- Validate inputs: accept standard hex-digit UUID strings with optional dashes, reject strings with invalid hex characters or incorrect length.

Supplementary details and collision considerations
- Using a timestamp in MS resolution means UUIDs generated during the same millisecond must rely on randomness to avoid collisions.
- For monotonicity in high-throughput systems, combine timestamp with a counter or use randomness with monotonic increment on collisions.

Reference details (fields, bit widths)
- Timestamp bits: 48 (unsigned millisecond epoch)
- Version bits: 4 (value = 7)
- Remaining bits: 76 (or the remainder after variant/version fields) used for randomness/sequence and variant bits as per RFC 4122.

Digest and retrieval
- Extracted description and implementation notes from the UUID v7 draft on 2026-03-19.

Attribution and data size
- Source: draft-peabody-dispatch-new-uuid-format (IETF datatracker). Retrieved: 2026-03-19