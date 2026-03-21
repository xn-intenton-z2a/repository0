RFC4648_BASE64

NORMALISED EXTRACT

Table of contents:
1. Base64 alphabet and mapping
2. Base64url variation (URL-safe)
3. Encoding and padding rules (precise)
4. Decoding rules and padding recovery
5. Bits per char and UUID sizing
6. Recommended API signatures

1. Base64 alphabet and mapping
- Standard Base64 alphabet (index => char, values 0..63):
  0..25: 'A'..'Z'
  26..51: 'a'..'z'
  52..61: '0'..'9'
  62: '+'
  63: '/'
- Each Base64 character represents 6 bits.

2. Base64url variation
- Base64url replaces '+' with '-' and '/' with '_' producing the URL-safe alphabet; padding '=' is optional and often omitted for compact representations.
- Base64url without padding is widely used for compact encoding of binary identifiers (e.g., URLs, JWTs). When padding is omitted, the decoder must recover the missing padding (add '=' characters to reach a length that is a multiple of 4) before standard decoding.

3. Encoding and padding rules (precise)
- Process input bytes in 3-byte (24-bit) groups. For each 3-byte group b0,b1,b2:
  - n = (b0 << 16) + (b1 << 8) + b2
  - produce four 6-bit values: (n >> 18) & 0x3F, (n >> 12) & 0x3F, (n >> 6) & 0x3F, n & 0x3F
  - map each 6-bit value to alphabet character
- Final partial group handling:
  - If remaining bytes = 1: produce two Base64 characters (from top 12 bits), then either output '==' padding (standard) or omit padding (unpadded variant)
  - If remaining bytes = 2: produce three Base64 characters (from top 18 bits), then either output '=' padding or omit it
- Without padding (common compact form), encoded length for N bytes = ceil((N * 8) / 6) = ceil(N * 4 / 3)
- Example: 16 bytes (UUID) -> ceil(128 / 6) = 22 characters when padding omitted. With standard padded base64 the output would be 24 characters (padded to multiple of 4 with '==').

4. Decoding rules and padding recovery
- For unpadded base64url, to decode:
  - compute missing = (4 - (input.length % 4)) % 4
  - append '=' repeated missing times to restore a length multiple of 4
  - then decode using standard base64 inverse mapping; ignore whitespace and line breaks if present (per RFC when line-feeds are allowed)

5. Bits per char and UUID sizing
- bits_per_char = 6.0 exactly
- For 128-bit input: 128 / 6 = 21.333... => ceil -> 22 chars (unpadded)
- Standard padded base64 output length = 4 * ceil(N/3) -> for 16 bytes -> 4 * ceil(16/3) = 4 * 6 = 24 (then '=' padding present)

6. Recommended API signatures
- function base64Encode(input: Uint8Array, urlSafe: boolean = false, padding: boolean = true): string
  - urlSafe: if true, use '-' and '_' instead of '+' and '/'
  - padding: if false, omit '=' padding
- function base64Decode(input: string, urlSafe: boolean = false): Uint8Array
  - should accept padded or unpadded input; for urlSafe, map '-'->'+' and '_'->'/' before decoding or use URL-safe inverse mapping

DETAILED DIGEST
Source: RFC 4648 (The Base16, Base32, and Base64 Data Encodings) — retrieved 2026-03-21
Crawled size: 85746 bytes (first 400 lines captured)
Extracted details: exact alphabet mappings, precise 3-byte -> 4-character algorithm, padding rules, base64url variant and decoding/padding recovery algorithm.

ATTRIBUTION
Source URL: https://datatracker.ietf.org/doc/html/rfc4648
Crawl size: 85746 bytes
Retrieved: 2026-03-21
