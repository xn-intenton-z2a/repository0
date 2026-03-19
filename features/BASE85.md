BASE85

# Summary

Add an ASCII85/Z85-compatible encoding with encodeBase85(uint8Array) and decodeBase85(string) exports. This provides a denser printable representation (~6.41 bits/char) and will be used to compare UUID encodings against base62 and custom higher bases.

# Motivation

Base85/Z85 is a compact binary-to-printable encoding used in several projects; including it ensures the library offers progressively denser built-in encodings and a realistic benchmark for densest encodings.

# Specification

- Export named functions: encodeBase85(uint8Array) and decodeBase85(string).
- Support both Ascii85 and Z85 variants internally or expose Z85 as the default for printable-only charset; document which variant is used.
- Document bits per char and expected encoded length for 16 bytes (20 characters for the selected variant).

# Tests / Acceptance Criteria

- Round-trip property: decodeBase85(encodeBase85(buf)) === buf for arbitrary Uint8Array inputs including empty, single-byte, all-zero, and all-0xFF buffers.
- UUID shorthand: encodeUUIDBase85(uuidString) and decodeUUIDBase85(encodedString) round-trip the 16-byte UUID correctly and produce the expected ~20-char output.
- Unit tests cover edge cases and assert the UUID encoded length and bits per character metadata are recorded in the encoding listing.
