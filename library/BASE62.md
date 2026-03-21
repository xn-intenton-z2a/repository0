NORMALISED EXTRACT

Table of contents:
1) Alphabet and density
2) Encoding/decoding API patterns
3) UUID length computation
4) Charset recommendations (ambiguous characters)

Alphabet and density
- Canonical base62 alphabet (commonly used): "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" (62 characters).
- Density: bits_per_char = log2(62) ≈ 5.954196310386876 bits/char.
- 16-byte (128-bit) UUID encoded length with base62 = ceil(128 / 5.954196) = 22 characters (baseline comparison: base64 without padding = 22 chars).

Encoding/decoding API patterns
- A typical API uses the base-x factory or a dedicated base62 encoder exposing:
  - createBase62(alphabet?: string) -> Encoder
  - Encoder.encode(input: Uint8Array) -> string
  - Encoder.decode(input: string) -> Uint8Array
- Implementations may use big-integer division (long-division on octets) or direct bit-packing approaches; both must preserve round-trip equality.

UUID length computation (practical note)
- Expect 22 chars for generic base62 implementations for a 16-byte UUID; due to leading-zero compression behaviour some implementations may produce shorter strings for inputs with leading zeros.

Charset recommendations
- Use only printable ASCII characters.
- Omit visually ambiguous characters when producing custom charsets for human-safe codes: remove 0/O, 1/l/I, and optionally remove punctuation that confuses punctuation with digits or letters.

Detailed digest
- Source: https://www.npmjs.com/package/base62 (npm package entry attempted)
- Retrieval attempt returned a 404 or minimal response when raw README was requested.
- Retrieved: 2026-03-21
- Bytes fetched: 14 (response content indicated "404: Not Found")

Attribution
- Primary reference: base62 NPM and common community conventions for base62 alphabets.