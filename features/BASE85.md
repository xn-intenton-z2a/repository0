BASE85

# Summary

Implement a Z85-compatible base85 encoding and decoding for Uint8Array. Provide UUID shorthand helpers and document the chosen variant, bits per character, and expected UUID encoded length.

# Motivation

Base85 (Z85) provides higher density than base62 and is a practical built-in option for comparing printable encoding densities for UUIDs and arbitrary binary.

# Specification

- Named exports (from src/lib/main.js): encodeBase85(uint8Array) -> string, decodeBase85(string) -> Uint8Array.
- UUID shorthand named exports: encodeUUIDBase85(uuidString) and decodeUUIDBase85(encodedString). Shorthand: strip dashes from the canonical UUID, encode the resulting 16 bytes, then reverse the final encoded string to maintain consistent mission shorthand across all encodings. Tests must assert this reversal behaviour and round-trip correctness.
- Chosen variant: Z85 (printable, non-control ASCII). Document differences vs Ascii85 and why Z85 was chosen.
- Metadata: name: "base85", charsetSize: 85, bitsPerChar: ~6.41, expectedUuidLength: 20 characters (verify exact length in tests).

# Tests / Acceptance Criteria

- Round-trip: decodeBase85(encodeBase85(buf)) === buf for edge cases: empty, 1 byte, all-0x00, all-0xFF, and random buffers.
- UUID shorthand: encodeUUIDBase85 and decodeUUIDBase85 round-trip the 16 UUID bytes for sample UUIDs and produce the expected ~20-char output.
- Export checks: named exports exist and are functions exported from src/lib/main.js.
- Documentation: README or encoding listing includes the chosen variant and its bitsPerChar value.
- Edge behavior: decoder rejects input containing invalid characters for the selected variant and errors are deterministic and documented.
