# BASE_ENCODINGS

Overview

Implement the library's baseline printable encodings: base62, base85 (Ascii85/Z85 variant), and base91. These encodings provide progressively higher bits-per-character density while using only printable, non-control characters so they can be embedded in URLs and text safely.

Requirements

- Provide encode(data: Uint8Array, encodingName: string): string and decode(text: string, encodingName: string): Uint8Array.
- Include built-in encodings with documented charsets:
  - base62: characters 0-9, a-z, A-Z. Approx bits/char: ~5.95. UUID length target: 22 chars.
  - base85: Ascii85 or Z85 variant. Approx bits/char: ~6.41. UUID length target: 20 chars.
  - base91: established base91 alphabet. Approx bits/char: ~6.50. UUID length target: ~20 chars.
- All encodings must only emit printable characters (no control characters).

Acceptance criteria

- Round-trip correctness: for each built-in encoding, decode(encode(bytes)) === bytes for all test inputs including empty buffer, all-zero bytes, all-0xFF bytes, single-byte buffers, and random buffers.
- Charset correctness: the implementation uses the documented character sets; unit tests validate the set length and that no control characters are present.
- Density validation: automated tests verify bits-per-character approximations within 0.1 bits and assert expected UUID encoded lengths (base62=22, base85=20, base91≈20) for representative UUIDs.
- The code uses Uint8Array as the input/output type for encode/decode APIs.

Implementation notes

- Prefer a deterministic, well-documented algorithm (no non-deterministic padding variants) so tests are stable.
- Document which base85 variant is implemented (Ascii85 or Z85) and include portability notes.
- Keep implementations isolated so additional encodings can be added without touching core logic.
