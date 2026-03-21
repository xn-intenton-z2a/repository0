ASCII85

NORMALISED EXTRACT

Table of contents:
1. Overview
2. Canonical mapping and character set
3. Encoding algorithm (4 octets -> 5 chars)
4. Special-case shorthand and markers (Adobe variant)
5. Handling final partial blocks (padding rules)
6. Bits/char and UUID sizing

1. Overview
Ascii85 (also called Ascii-85) is a binary-to-text encoding that maps 4 bytes (32 bits) into 5 printable ASCII characters. It predates several other base85 variants and has multiple variants (Adobe, btoa/ascii85, Z85). Implementation must choose which variant rules to follow (notably: whether to treat the special-case 'z', which characters are used, and whether wrapper markers are present).

2. Canonical mapping and character set
- The Adobe/btoa Ascii85 mapping maps base-85 values 0..84 to ASCII characters by adding 33 (i.e., char = value + 33). That yields the 85 characters from '!' (33) through 'u' (117).
- Z85 is a different base-85 variant with a different alphabet and no 'z' shorthand; see Z85 doc for that alphabet.

3. Encoding algorithm (precise)
- For each 4-byte block b0,b1,b2,b3 (network byte order):
  - n = (b0 << 24) + (b1 << 16) + (b2 << 8) + b3  // unsigned 32-bit
  - produce five base-85 digits by repeated division by 85 (least-significant-first) then reverse to most-significant-first; equivalently: for i=4 down to 0: d[i] = n % 85; n = floor(n/85); then output characters mapped from d[0]..d[4]
- Most implementations output digits from most-significant to least-significant to form the printable 5-character group.

4. Special-case shorthand and markers (Adobe variant)
- Adobe Ascii85 uses a 'z' shorthand: the 5-character representation for a 4-byte all-zero group (0x00000000) may be replaced by a single character 'z'. This reduces size for long zero sequences but is an Adobe-specific convenience and must be handled explicitly by encoders/decoders.
- Adobe sometimes wraps encoded streams with markers '<~' at the start and '~>' at the end; these markers are NOT part of the raw encoded data and are optional.

5. Handling final partial blocks (padding rules)
- When encoding a final partial block of N bytes (N=1,2,3): pad the block on the right with zero bytes to make a 4-byte block, encode to 5 characters, then output only the first (N + 1) characters of that 5-character sequence. Example: 1 byte -> output 2 characters; 2 bytes -> output 3; 3 bytes -> output 4.
- Decoding of a final short group: pad the character sequence with 'u' (value 84) or the equivalent high-value character to reach five characters, decode into 4 bytes, then truncate the extra padding bytes (reverse of the encoding rule).

6. Bits per character and UUID sizing
- bits/char = log2(85) ≈ 6.409391
- A 128-bit UUID encodes to 20 characters (16 bytes -> (16/4)*5 = 20) in full-block encodings. With Adobe 'z' shorthand, all-zero UUIDs may compress further.

SUPPLEMENTARY DETAILS
- Choosing variant: If interoperability with ZeroMQ code is required, use Z85. If compatibility with legacy Adobe or btoa tools is required, use Adobe Ascii85 and support 'z' shorthand and optional markers.
- Implementation notes: be careful with final-block truncation rules and the special-case 'z'. When decoding, reject invalid characters and validate that output length is consistent with expected padding rules.

REFERENCE DETAILS (APIs)
- Suggested JS API:
  function ascii85Encode(input: Uint8Array, variant: 'Adobe'|'RFC' = 'Adobe'): string
  function ascii85Decode(input: string, variant: 'Adobe'|'RFC' = 'Adobe'): Uint8Array
- Behavior:
  - encode: pads final partial block and truncates output as specified above; optionally emit wrapper markers only when requested.
  - decode: expands 'z' to 4 zero bytes if Adobe variant, accepts final short groups and truncates decoded padding bytes.

DETAILED DIGEST
Source: Ascii85 - Wikipedia (en.wikipedia.org/wiki/Ascii85) — retrieved 2026-03-21
Crawled size (first 400 lines captured): 105787 bytes
Extracted details: mapping rule value+33, 4->5 block algorithm, Adobe 'z' shorthand, final-block truncation rule.

ATTRIBUTION
Source URL: https://en.wikipedia.org/wiki/Ascii85
Crawl size: 105787 bytes
Retrieved: 2026-03-21
