NORMALISED EXTRACT

Table of contents:
1) Overview
2) Alphabets and density (bits/char)
3) API: constructor and methods
4) Encoding algorithm
5) Usage notes and constraints

Overview
base-x is a minimal encoder/decoder factory which accepts a single string alphabet and returns an encoder object. The encoder encodes a binary input (Uint8Array) to a printable string and decodes a printable string back to a Uint8Array. Leading-zero compression follows the bitcoin/base58 convention: each leading zero byte in the input encodes as the alphabet's first character.

Alphabets and density
- The alphabet is a contiguous string of unique printable characters; its length N determines density bits_per_char = log2(N).
- Examples (alphabet length -> approximate bits/char): 58 -> 5.858, 62 -> 5.954, 64 -> 6.000.
- For a 16-byte (128-bit) UUID, encoded length = ceil(128 / bits_per_char). For base62 (~5.954) this yields 22 chars; for base85 (~6.41) yields 20 chars; for base91 (~6.5076) yields 20 chars or less.

API (exact, normalized signatures)
- basex(alphabet: string) -> Encoder
- Encoder: object with methods:
  - encode(input: Uint8Array) -> string
  - decode(input: string) -> Uint8Array
Notes: encode returns a printable string; decode returns a new Uint8Array. Implementations validate characters on decode and throw on invalid input.

Encoding algorithm (implementation detail)
- Interpret the input Uint8Array as a big-endian unsigned integer represented by octets.
- Perform repeated division by the target base (alphabet length) to produce the encoded digits (this is the long-division algorithm on byte arrays).
- For every leading zero byte in the input, prepend the first alphabet character to the encoded string (leader preservation). Decoding counts leading leader characters and restores leading zero bytes after numeric reconstruction.
- No padding is used; encoded length may vary with leading zeros.

Usage notes and constraints
- Not RFC-compliant for base16/base32/base64; do not use base-x for standards encodings requiring canonical padding or bit-group packing.
- Custom alphabets may include only printable characters; ensure characters are unique and stable ordering is chosen.
- To create higher-density encodings, use a larger alphabet drawn from printable ASCII U+0021..U+007E excluding ambiguous characters.

Supplementary details
- Leading-zero compression causes encoded output to be shorter when inputs contain leading zeros; treat this as intentional behavior for compactness.
- When using base-x to implement base62/base58, prefer alphabets that avoid URL-significant characters if URL-safety is required.

Reference details (precise patterns and implementation)
- Factory pattern: basex(alphabet) produces { encode, decode } where:
  - encode(u8: Uint8Array): string
  - decode(s: string): Uint8Array
- Implementation patterns: allocate temporary arrays for division, perform in-place long-division by base, push digits into an output buffer, reverse buffer, then prefix leader characters for each leading zero.
- Error handling: decode should raise/throw on encountering characters not present in the alphabet.

Detailed digest
- Source: https://raw.githubusercontent.com/cryptocoinjs/base-x/master/README.md
- Retrieved: 2026-03-21
- Bytes fetched: 2826

Attribution
- Source: cryptoccinjs/base-x README (raw) - credited as the source of algorithm description and alphabets table.