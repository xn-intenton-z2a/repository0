# Mission

A JavaScript library that explores the frontier of binary-to-text encoding density using printable characters. The benchmark: produce the shortest possible printable representation of a v7 UUID.

## Core Functions

- `encode(buffer, encoding)` / `decode(str, encoding)` — encode/decode arbitrary binary data using a named encoding.
- `encodeUUID(uuid)` / `decodeUUID(str)` — shorthand for UUID encoding (strip dashes, encode the 16 bytes).
- `createEncoding(name, charset)` — define a custom encoding from a character set string.
- `listEncodings()` — return available encodings with their bit density and charset info.

## Built-in Encodings

The library should implement progressively denser encodings:

- `base62` — `[0-9a-zA-Z]`, ~5.95 bits/char, URL-safe, 22 chars for a UUID
- `base85` (Ascii85/Z85) — ~6.41 bits/char, 20 chars for a UUID
- `base91` — ~6.50 bits/char, ~20 chars for a UUID
- Optionally: custom higher bases cherry-picking from safe printable Unicode

## Requirements

- Round-trip property: `decode(encode(x, enc), enc)` must equal `x` for all inputs and all encodings.
- No control characters, no ambiguous characters (0/O, 1/l/I in contexts where they matter).
- Test across edge cases: all-zero bytes, all-0xFF bytes, single byte, empty buffer.
- Compare encoded UUID lengths across all encodings.
- Export all functions as named exports from `src/lib/main.js`.
- README with UUID encoding comparison table.

## Acceptance Criteria

- [ ] At least 3 working encodings (base62, base85, one higher)
- [ ] Round-trip correct for arbitrary binary data including edge cases
- [ ] UUID encoding shorter than base64 (< 24 chars) for the densest encoding
- [ ] `listEncodings()` returns encoding metadata
- [ ] All unit tests pass
- [ ] README shows UUID encoding comparison table
