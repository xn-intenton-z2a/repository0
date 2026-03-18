# BASE_ENCODINGS

Status: Done (built-ins: base62, base85, base91, ascii-printable-no-ambiguous)

Overview

This feature specifies the baseline printable encodings and their testable properties. The repository registers built-in encodings in src/lib/main.js: base62, base85, base91 and a high-density builtin named ascii-printable-no-ambiguous.

Requirements

- Provide encode(data: Uint8Array, encodingName: string): string and decode(text: string, encodingName: string): Uint8Array (these are exported from src/lib/main.js).
- Include built-in encodings with documented charsets and expected approximate bits/char:
  - base62: characters 0-9, a-z, A-Z. Approx bits/char: ~5.95. UUID length target: 22 chars.
  - base85: 85-character printable alphabet (Z85-like in this repo). Approx bits/char: ~6.41. UUID length target: 20 chars.
  - base91: standard base91 alphabet registered as "base91". Approx bits/char: ~6.50. UUID length typically 20 chars or fewer depending on packing.
  - ascii-printable-no-ambiguous: high-density printable ASCII derived from U+0021..U+007E excluding visually ambiguous characters (repository builtin). bits/char ≈ Math.log2(charsetSize).

Acceptance criteria (testable)

- Round-trip correctness: for each built-in encoding, decode(encode(bytes)) must equal bytes for these test vectors: empty buffer, single-byte values (0x00, 0x7F, 0xFF), 16-byte all-zero, 16-byte all-0xFF, and deterministic random buffers. Tests exist in tests/unit/encoding.test.js.
- Charset correctness: unit tests validate charset length and that no control characters are present, and that defineEncoding rejects duplicate characters and disallowed chars.
- Density validation: unit tests assert that the densest registered encoding produces encoded UUID lengths strictly less than base64 (22 chars) for representative UUIDs and that bitsPerChar ≈ Math.log2(charsetSize) within a small tolerance.
- Registry presence: listEncodings() must include entries for base62, base85, base91 and ascii-printable-no-ambiguous and report accurate charsetSize and bitsPerChar.
- API conformance: the library uses Uint8Array for input/output of encode/decode.

Implementation notes

- The repository uses a generic BigInt-based base conversion to implement arbitrary bases; this yields a compact, deterministic output suitable for round-trip testing.
- base91 is implemented using a standard base91 alphabet and registered via defineEncoding("base91", alphabet). Ensure tests cover round-trip and density for base91 as for other built-ins.
- If additional high-density alphabets are added, register them via defineEncoding so they appear in listEncodings and are visible to README/table generators.
