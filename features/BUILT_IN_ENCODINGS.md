# BUILT_IN_ENCODINGS

Summary

Define and document the library's built-in encodings. At minimum implement three working encodings that progressively trade human-friendliness for density.

Required built-ins

- base62
  - Alphabet: digits then lowercase then uppercase (0-9 a-z A-Z).
  - Approx bits/char: ~5.95
  - Expected UUID length (16 bytes): 22 characters
  - Notes: URL-safe by construction.

- Z85 (base85 variant)
  - Alphabet: Z85 canonical 85-character alphabet
  - Bits/char: log2(85) ≈ 6.4094
  - Expected UUID length: 20 characters (16 byte blocks -> (16/4)*5)
  - Notes: strict 4->5 framing, no 'z' shorthand.

- PRINTABLE_ASCII (high-density printable alphabet)
  - Alphabet: printable ASCII range U+0021..U+007E (94 characters) with an option to omit ambiguous characters (0,O,1,l,I).
  - Bits/char: log2(94) ≈ 6.5546 (or log2(89) ≈ 6.4739 when ambiguous chars are removed)
  - Expected UUID length: 20 characters (ceil(128 / bitsPerChar) = 20)
  - Notes: densest built-in; must exclude control characters and optionally ambiguous characters

Optional

- base91 or other experimentally dense alphabets may be added behind feature flags but are not required for initial acceptance.

# ACCEPTANCE CRITERIA

- The repository provides at least three working encodings: base62, Z85 (or Ascii85 variant clearly named), and PRINTABLE_ASCII (or similar 94-char alphabet).
- Each built-in is registered and appears in listEncodings with correct charsetSize and bitsPerChar computed to at least 4 decimal places.
- Unit tests assert the encoded length of a canonical 16-byte UUID for each built-in and show that the densest built-in produces fewer than 22 characters for a UUID.
- Implementation avoids control characters and documents any choices (Z85 vs Adobe Ascii85 behaviour, whether Z85 frames require 4-byte alignment).
