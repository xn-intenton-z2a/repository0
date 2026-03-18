# Mission

A JavaScript library that explores the frontier of binary-to-text encoding density using printable characters. The benchmark: produce the shortest possible printable representation of a v7 UUID.

## Required Capabilities

- Encode and decode arbitrary binary data (`Uint8Array`) using a named encoding.
- Shorthand for UUID encoding: strip dashes from a UUID string, encode the 16 bytes, and reverse.
- Define custom encodings from a character set string.
- List available encodings with their bit density and charset info.

## Built-in Encodings

The library should implement progressively denser encodings:

- `base62` — `[0-9a-zA-Z]`, ~5.95 bits/char, URL-safe, 22 chars for a UUID
- `base85` (Ascii85/Z85) — ~6.41 bits/char, 20 chars for a UUID
- `base91` — ~6.50 bits/char, ~20 chars for a UUID
- Optionally: custom higher bases using printable ASCII characters U+0021–U+007E (excluding space), omitting ambiguous characters (`0`/`O`, `1`/`l`/`I`)

## Requirements

- Round-trip property: decoding an encoded value must equal the original for all inputs and all encodings.
- No control characters. Exclude visually ambiguous characters (`0`/`O`, `1`/`l`/`I`) from custom charsets.
- Input type for encode/decode is `Uint8Array`.
- Baseline comparison: UUID hex = 32 chars, base64 (no padding) = 22 chars. The densest encoding should produce fewer than 22 characters for a UUID.
- Test across edge cases: all-zero bytes, all-0xFF bytes, single byte, empty buffer.
- Compare encoded UUID lengths across all encodings.
- Export all public API as named exports from `src/lib/main.js`.
- README with UUID encoding comparison table.

## Acceptance Criteria

- [ ] At least 3 working encodings (base62, base85, one higher)
- [ ] Round-trip correct for arbitrary binary data including edge cases
- [ ] UUID encoding shorter than base64 (< 22 chars) for the densest encoding
- [ ] Listing encodings returns encoding metadata (name, bits/char, charset size)
- [ ] Custom encoding can be created from a charset string
- [ ] All unit tests pass
- [ ] README shows UUID encoding comparison table
