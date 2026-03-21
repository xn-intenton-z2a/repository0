ASCII_PRINTABLE

NORMALISED EXTRACT

Table of contents:
1. Printable ASCII range
2. Recommended charset construction for dense encodings
3. Ambiguity avoidance rules (characters to omit)
4. Bits-per-character calculation and sizing
5. Implementation & validation notes

1. Printable ASCII range
- Unicode code points U+0021 through U+007E inclusive correspond to ASCII printable characters (decimal 33..126). This excludes space (U+0020). There are 94 characters in that range: 126 - 33 + 1 = 94.
- Full set (U+0021..U+007E): ! " # $ % & ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 : ; < = > ? @ A ... Z [ \\ ] ^ _ ` a ... z { | } ~

2. Recommended charset construction for dense encodings
- To construct a high-density, printable encoding alphabet, start with the printable range U+0021..U+007E and remove any characters you explicitly do not want (quotes, backslash, control-like characters, or characters reserved by target formats).
- Example highest-density candidate (omit only space): size = 94 -> bits/char = log2(94) ≈ 6.5546 bits.
- If ambiguous characters are removed as recommended, you get charset_size = 94 - 5 = 89 (removing 0, O, 1, l, I) -> bits/char = log2(89) ≈ 6.4739 bits.

3. Ambiguity avoidance rules (characters to omit)
- Common ambiguous characters: '0' (zero) vs 'O' (capital o); '1' vs 'l' (lowercase L) vs 'I' (capital i). Omit these to reduce transcription errors in human usage.
- The mission recommends omitting: 0, O, 1, l, I (five characters). Adjust ordering to keep a stable deterministic alphabet.

4. Bits-per-character calculation and sizing
- bits_per_char = log2(charset_size)
- encoded_length_for_bits = ceil(total_bits / bits_per_char)
- Examples for 128-bit UUID:
  - charset_size=94 -> bits/char≈6.5546 -> 128/6.5546≈19.52 -> encoded length = 20 chars
  - charset_size=89 -> bits/char≈6.4739 -> 128/6.4739≈19.78 -> encoded length = 20 chars
- Any printable ASCII-based alphabet with size > 62 will yield denser-than-base62 encodings; many will produce 20 chars for a 16-byte UUID.

5. Implementation & validation notes
- Always represent the alphabet as a string of unique characters and validate uniqueness before using it to create an encoder.
- For robustness, when decoding: check for disallowed characters, and normalize visually-similar characters only if you intentionally accept ambiguous inputs (not recommended for canonical encodings).

SUPPLEMENTARY DETAILS
- When producing an alphabet for a library API, expose the alphabet string and its computed bits/char as metadata so callers can select encodings programmatically.

DETAILED DIGEST
Source: ASCII printable characters section - Wikipedia (en.wikipedia.org/wiki/ASCII#Printable_characters) — retrieved 2026-03-21
Crawled size: 416163 bytes (first 400 lines captured here)

ATTRIBUTION
Source URL: https://en.wikipedia.org/wiki/ASCII#Printable_characters
Crawl size: 416163 bytes
Retrieved: 2026-03-21
