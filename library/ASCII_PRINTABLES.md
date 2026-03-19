ASCII Printable Characters — U+0021..U+007E and charset selection for high-density encodings

Table of contents
- Printable ASCII range and counts
- Recommended charset for custom high-density encodings
- Excluding visually ambiguous characters
- Charset generation and indexing rules
- Bits per character calculation
- Supplementary details
- Reference details (exact codepoints)
- Digest and retrieval
- Attribution and data size

Printable ASCII range and counts
- Standard printable ASCII covers code points U+0021 (!) through U+007E (~) inclusive.
- Count: 0x7E - 0x21 + 1 = 94 characters.

Recommended charset for custom high-density encodings
- Use the printable ASCII range U+0021..U+007E (94 chars) as the superset for densest possible printable encodings.
- For practical use, omit space (U+0020) and control characters; the above range already excludes space.

Excluding visually ambiguous characters (mission constraint)
- Remove characters that are visually ambiguous in common fonts: '0' (U+0030), 'O' (U+004F), '1' (U+0031), 'l' (U+006C), 'I' (U+0049).
- After removing these five characters, charset size = 94 - 5 = 89 characters.

Charset generation and indexing rules
- Produce a deterministic ordered charset string; example ordering: ASCII from 0x21 to 0x7E skipping excluded chars.
- Mapping index -> character: index 0 maps to first allowed char; index increases by 1 for each next allowed char.
- To compute bits-per-char (density): bits_per_char = log2(charset_size). For charset_size = 89 -> bits_per_char ≈ 6.475.
- When implementing encode/decode, treat the charset as a radix R alphabet where each output digit encodes floor(log2(R)) bits; use big-integer base conversion or bitstream packing algorithms to maximize density.

Bits per character calculation
- Full printable set (94 chars): log2(94) ≈ 6.5546 bits/char.
- Without ambiguous chars (89 chars): log2(89) ≈ 6.4757 bits/char.

Supplementary details
- Using non-power-of-two radices requires careful base conversion for maximal packing. Two common approaches:
  1. Bit-packing: accumulate bits into an integer buffer and emit output digits by dividing the buffer by the radix, or by extracting fixed-bit slices when possible.
  2. Arbitrary-radix conversion: treat input as a large integer (base-256) and convert to base-R using repeated division; this yields minimal-length output but is slower.
- For short inputs (UUIDs: 16 bytes) arbitrary-radix division is practical and yields minimal-length encodings.

Reference details (exact codepoints)
- Printable ASCII code point interval: 0x21..0x7E inclusive (94 chars).
- Ambiguous characters (exclude): U+0030, U+004F, U+0031, U+006C, U+0049.

Digest and retrieval
- Extracted printable ASCII range and character counts from Wikipedia ASCII printable characters section.
- Retrieved: 2026-03-19

Attribution and data size
- Source: Wikipedia (ASCII printable characters). Retrieved HTML snapshot on 2026-03-19.