BASE62

Table of contents
- Alphabet variants and conventions
- Encoding algorithm (big-integer / repeated-division)
- Decoding algorithm
- Implementation notes and best practices
- Pseudo-code and API

Normalised extract (implementation facts)
- Base62 represents numeric values using a 62-character alphabet. There is no single Internet standard; common de-facto alphabets include:
  - "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" (digits, then uppercase, then lowercase)
  - "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" (digits, then lowercase, then uppercase)
  - Several libraries use custom alphabets suited for URL friendliness; always confirm alphabet with consumers.
- Canonical algorithm (recommended): treat input as a big-endian unsigned integer and perform repeated division by 62 producing least-significant digits first, then reverse digits for output. For binary input (byte arrays) convert to a large integer representation or use a division-on-array routine.

Encoding algorithm (byte-array variant):
- Convert input bytes to a big integer value N (or operate on the byte array with repeated division):
  - while N > 0:
      digit = N % 62
      push alphabet[digit]
      N = floor(N / 62)
  - Reverse the pushed digits to get final string; handle leading zero bytes explicitly by prefixing the leader character for each leading zero when using bitcoin-style compression (if chosen by the alphabet implementation).

Decoding algorithm:
- For each character c in input:
    value = indexOf(alphabet, c)
    if value < 0: error
    N = N * 62 + value
- Convert big integer N back to bytes (big-endian) or push bytes while dividing by 256.

API signatures
- encodeBase62(input: Uint8Array, alphabetVariant?: string) -> string
- decodeBase62(input: string, alphabetVariant?: string) -> Uint8Array

Best practices
- Pick and document an alphabet early and do not change it.
- For short IDs consider lexicographic ordering and padding policies; numeric conversion yields variable-length strings — add fixed-width or prefix when necessary.
- When cross-language interop is required, use test vectors (e.g., encoding of byte arrays {0x00}, {0x01}, {0x00,0x01}) to validate decoding.

Digest and provenance
- Source: https://en.wikipedia.org/wiki/Base62
- Retrieved: 2026-03-15
- Crawl snapshot: Wikipedia Base62 article (retrieved HTML ~70KB)
- Attribution: Wikipedia content (check license if republishing)