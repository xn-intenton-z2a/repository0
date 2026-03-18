# BASE_ENCODINGS

Status: Partially implemented (see src/lib/main.js)

Overview

This feature specifies the baseline printable encodings and their testable properties. The repository currently registers built-in encodings in src/lib/main.js: base62 and base85 plus a high-density builtin named ascii-printable-no-ambiguous. A classic base91 implementation is not present; it remains an optional addition.

Requirements

- Provide encode(data: Uint8Array, encodingName: string): string and decode(text: string, encodingName: string): Uint8Array (these are exported from src/lib/main.js).
- Include built-in encodings with documented charsets and expected approximate bits/char:
  - base62: characters 0-9, a-z, A-Z. Approx bits/char: ~5.95. UUID length target: 22 chars.
  - base85: 85-character printable alphabet (Z85-like in this repo). Approx bits/char: ~6.41. UUID length target: 20 chars.
  - ascii-printable-no-ambiguous: high-density printable ASCII derived from U+0021..U+007E excluding ambiguous characters (repository builtin). bits/char ≈ Math.log2(charsetSize).

Acceptance criteria (testable)

- Round-trip correctness: for each built-in encoding, decode(encode(bytes)) must equal bytes for these test vectors: empty buffer, single-byte values (0x00, 0x7F, 0xFF), 16-byte all-zero, 16-byte all-0xFF, and deterministic random buffers. Tests exist in tests/unit/encoding.test.js.
- Charset correctness: unit tests validate charset length and that no control characters are present, and that defineEncoding rejects duplicate characters.
- Density validation: unit tests assert that the densest registered encoding produces encoded UUID lengths strictly less than base64 (22 chars) for representative UUIDs and that bitsPerChar ≈ Math.log2(charsetSize) within a small tolerance.
- API conformance: the library uses Uint8Array for input/output of encode/decode.

Implementation notes

- The repository uses a generic BigInt-based base conversion to implement arbitrary bases; this yields a compact, deterministic output suitable for round-trip testing.
- If a base91 implementation is desired, add a separate defineEncoding("base91", alphabet) or implement a specialized packing algorithm; ensure tests cover round-trip and density.
