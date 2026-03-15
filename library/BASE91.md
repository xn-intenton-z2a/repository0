BASE91 (basE91)

Table of contents
- Purpose and efficiency
- Alphabet (implementation note) and character coverage
- Encoding algorithm (bit-accumulator approach)
- Decoding algorithm (inverse)
- Pseudo-code (detailed)
- Implementation notes and edge cases

Normalised extract (implementation facts)
- Purpose: basE91 packs binary data into a stream of characters from a 91-character alphabet with overhead typically between ~14% and ~23% depending on data patterns, more efficient than base64 in average cases.
- Core algorithm (Henke's basE91 approach): bit-accumulator method using variable output width:
  - Maintain an integer buffer 'b' and bit count 'n' (initially 0).
  - For each input byte 'v': b |= (v & 0xFF) << n; n += 8.
  - While n > 13:
      - Let v13 = b & 8191 (13 bits). If v13 > 88 then:
          - b >>= 13; n -= 13; value = v13
        else:
          - Let v14 = b & 16383 (14 bits); b >>= 14; n -= 14; value = v14
      - Output two characters: alphabet[value % 91] followed by alphabet[Math.floor(value / 91)].
  - After processing all input bytes, if n > 0:
      - Output alphabet[b % 91]
      - If n > 7: output alphabet[Math.floor(b / 91)]
- Decoding is the inverse: reconstruct 'value' from pairs of chars, combine into buffer b with appropriate bit-length (13 or 14 bits) and extract bytes when n >= 8.

Pseudo-code (encode):
- function base91Encode(bytes, alphabet):
    b = 0; n = 0; out = ''
    for each byte in bytes:
      b |= (byte & 0xFF) << n
      n += 8
      while n > 13:
        v = b & 8191
        if v > 88:
          b >>= 13; n -= 13
        else:
          v = b & 16383; b >>= 14; n -= 14
        out += alphabet[v % 91] + alphabet[Math.floor(v / 91)]
    if n:
      out += alphabet[b % 91]
      if n > 7:
        out += alphabet[Math.floor(b / 91)]
    return out

API (recommended)
- base91Encode(input: Uint8Array) -> string
- base91Decode(input: string) -> Uint8Array

Alphabet note and attribution
- The canonical basE91 alphabet is the 91 printable characters chosen by the original author; implementations should read the authoritative basE91 source (basE91 original page) to obtain the exact ASCII-ordered alphabet. Typical implementations use the full printable ASCII subset excluding whitespace. If implementing from scratch, copy the alphabet from the original reference to ensure interoperability.

Supplementary details
- Unit tests should include known interop vectors from the basE91 reference implementation, varying input lengths and sequences of zeros to verify behavior where other encodings use compression shortcuts.

Digest and provenance
- Source: https://base91.sourceforge.net/ (project page)
- Retrieved: 2026-03-15
- Crawl snapshot: SourceForge project page and basE91 references (retrieved HTML ~100KB)
- Attribution: basE91 project (original author)