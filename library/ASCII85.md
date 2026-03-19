TITLE: ASCII85

Table of Contents
- Normalised extract: Ascii85 basics and variants (Adobe, RFC1924 mentions)
- Technical details: 4-byte->5-char mapping, special zero shorthand, big-endian uint32 handling
- Supplementary details: line-safe characters, quoting considerations
- Reference details: encode/decode algorithms for Uint8Array
- Digest and attribution

Normalised extract
Ascii85 encodes 4 bytes (32 bits) into 5 ASCII characters using base-85 encoding. The 32-bit big-endian integer is repeatedly divided by 85 to produce five digits (most-to-least significant). Adobe variant allows a special "z" shorthand representing four zero bytes (0x00000000) as a single 'z' character. Ascii85 output uses characters in range '!' (33) through 'u' (117) for the classic Adobe set, but variants and safe alphabets differ; choose variant based on interoperability requirements.

Technical details
- Bits per char: log2(85) ≈ 6.409 bits/char
- Input chunk: 4 bytes (uint32 BE) -> output: 5 characters
- Zero shorthand: if uint32 == 0x00000000, encode as 'z' (Adobe variant). Some variants forbid 'z'.
- Map step: value = uint32; for i from 4 downto 0: digit = value % 85; value = Math.floor(value / 85); outputChar = (digit + 33) as ASCII

Exact encode algorithm (Uint8Array -> string)
- Pad input to 4-byte boundary (application chooses padding scheme)
- For each 4-byte block: word = (b0<<24)|(b1<<16)|(b2<<8)|b3
- If Adobe and word==0 -> append 'z' and continue
- Else for i = 0..4: divisor = 85^(4-i); digit = Math.floor(word / divisor); word -= digit*divisor; append character(33 + digit)

Exact decode algorithm (string -> Uint8Array)
- Expand 'z' to five '!' equivalents mapping to zero block if Adobe variant allowed
- For each 5-char block: value = 0; for each char: value = value*85 + (charCode - 33); output 4 bytes big-endian
- Handle final short block by padding with '!' (value 0) and then trimming bytes according to original length

Supplementary details
- ASCII range: classic Ascii85 outputs printable characters and avoids control characters
- Use big-endian ordering for portability with network byte order
- Choose whether to permit 'z' shorthand in library config

Reference details (method signatures)
- encodeAscii85(bytes: Uint8Array, allowShorthandZ?: boolean) => string
- decodeAscii85(text: string, allowShorthandZ?: boolean) => Uint8Array

Digest
- Sources fetched: https://en.wikipedia.org/wiki/Ascii85 (retrieved 2026-03-19) — ~110 KB HTML

Attribution
- Source: Wikipedia "Ascii85" retrieved 2026-03-19. Data size fetched: ~110 KB.