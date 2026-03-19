TITLE: BASE62

Table of Contents
- Normalised extract: base62 alphabet and density
- Technical details: two encoding approaches (big-integer division vs bit-packing)
- Supplementary details: URL-safety and canonical charset selection
- Reference details: algorithm signatures and UUID length estimate
- Digest and attribution

Normalised extract
Base62 encodes binary into 62 symbols. Two common alphabets exist; this project uses the mission-specified charset: [0-9a-zA-Z] (digits then lowercase then uppercase). Base62 density is ~log2(62) = 5.954196310386876 bits/char. For a 16-byte input (128 bits) base62 yields ceil(128 / 5.9541) ≈ 22 characters (mission expects ~22).

Technical details
- Bits per char: log2(62) ≈ 5.95
- Canonical alphabet (chosen here): "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

Encoding approaches
1) Big-integer division (recommended for exact minimal-length output):
   - Interpret byte array as a big-endian unsigned integer N
   - Repeatedly divide N by 62: remainder r = N % 62; push alphabet[r]; N = floor(N / 62)
   - Continue until N == 0; reverse pushed characters for output
   - Produces minimal-length representation with no leading zeros
   - Complexity: requires big-integer arithmetic for arbitrarily long inputs (implementable with array division)

2) Bit-packing (approximate):
   - Pack bits into accumulator and emit 5 or 6-bit chunks mapped to alphabet with remainders; more complex to get exact minimal length and needs handling of variable-length mapping

Decoding (big-integer approach)
- For each character: value = alphabetIndex(char); N = N * 62 + value; after processing all chars, emit big-endian bytes representing N, trimming leading zero bytes as required or padding to desired length

UUID considerations
- For 16-byte UUIDs, big-integer division yields ~22 chars (same order as base64 without padding)

Reference details (method signatures)
- createBase62(charset?: string) => { encode(bytes: Uint8Array): string, decode(text: string): Uint8Array }
- encodeBase62(bytes: Uint8Array) => string
- decodeBase62(text: string) => Uint8Array

Digest
- Sources fetched: https://en.wikipedia.org/wiki/Base62 (retrieved 2026-03-19) — ~102 KB HTML

Attribution
- Source: Wikipedia "Base62" retrieved 2026-03-19. Data size fetched: ~102 KB.