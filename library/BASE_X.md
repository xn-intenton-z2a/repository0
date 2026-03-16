BASE_X (cryptocoinjs/base-x)

Table of contents
- Purpose and behavior
- Constructor and API signatures
- Encoding semantics (long-division algorithm and leading-zero compression)
- Alphabets and examples
- Implementation and interoperability notes
- Pseudo-code and usage examples

Normalised extract (implementation facts)
- Purpose: base-x implements fast arbitrary-base encoding/decoding for a provided alphabet and applies bitcoin-style leading-zero compression (leader char encodes leading zero bytes).
- Constructor and primary API (JavaScript):
  - import basex from 'base-x'
  - const bs = basex(alphabet: string)
  - Methods on bs:
    - bs.encode(source: Uint8Array | Buffer | Array<number>) -> string
    - bs.decode(source: string) -> Uint8Array
- Key behavior details:
  - Encoding algorithm uses repeated long division on the byte array interpreted as a large integer to produce digits in the target base; this produces variable-length output with no padding.
  - Leading zero bytes in the input are preserved as repeated occurrences of the alphabet[0] (leader character) at the start of the encoded output (Bitcoin-style compression). This is a deliberate design choice and differs from fixed-bit encodings like RFC4648 forms.
  - The module is explicitly NOT RFC3548-compliant for standard base16/base32/base64; it is intended for arbitrary bases such as base58/base62 etc.

Alphabets (from README examples)
- Examples of canonical alphabets listed in the README:
  - base2: "01"
  - base8: "01234567"
  - base16: "0123456789abcdef"
  - base32: "0123456789ABCDEFGHJKMNPQRSTVWXYZ" or z-base-32 variant
  - base36: "0123456789abcdefghijklmnopqrstuvwxyz"
  - base58 (Bitcoin): "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  - base62: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  - base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

Pseudo-code (encode using long-division approach):
- function encode(bytes, alphabet):
    if bytes.length == 0: return ''
    // count leading zeros
    zeros = 0
    while zeros < bytes.length and bytes[zeros] == 0: zeros++
    // convert rest of bytes to big integer-like array and perform repeated division by base
    digits = []
    input = bytes.slice(zeros)
    while input not empty and not all zero:
      carry = 0
      for i from 0..input.length-1:
        carry = (carry << 8) + input[i]
        input[i] = floor(carry / base)
        carry = carry % base
      digits.push(carry)
      // trim leading zeros from input array
    // output leader char for each leading zero byte
    result = alphabet[0] repeated zeros + reverse(map(d => alphabet[d], digits))
    return result

Pseudo-code (decode):
- function decode(str, alphabet):
    base = alphabet.length
    // count leading leader characters -> leading zero bytes
    zeros = countLeadingChars(str, alphabet[0])
    inputChars = str.slice(zeros)
    bytes = [] // byte array builder
    for c in inputChars:
      value = alphabet.indexOf(c) // O(1) lookup from table recommended
      carry = value
      for j in 0..bytes.length-1:
        carry += bytes[j] * base
        bytes[j] = carry & 0xFF
        carry >>= 8
      while carry > 0:
        bytes.push(carry & 0xFF)
        carry >>= 8
    // prepend zeros zero-bytes
    return Uint8Array( zeros zero-bytes concatenated with reversed(bytes) )

Implementation notes
- Use precomputed decode lookup table (Uint8Array of 256 initialized to 255 for invalid bytes, then fill indices) for O(1) lookup in decode.
- Tests in README show decode returns Uint8Array and encode accepts Uint8Array/Buffer.
- The library warns that it is not compliant with RFC3548 and is designed for arbitrary alphabets (useful for base58, base62, etc.).

Digest and provenance
- Source: https://raw.githubusercontent.com/cryptocoinjs/base-x/master/README.md
- Retrieved: 2026-03-16
- Crawl snapshot: README.md (raw text, retrieved ~3KB)
- Attribution: cryptocoinsjs/base-x (MIT)
