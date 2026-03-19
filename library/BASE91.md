TITLE: BASE91

Table of Contents
- Normalised extract: base91 density and variable-bit buffer algorithm
- Technical details: alphabet, encoder buffer mechanics, bits emission rules
- Supplementary details: expected density and UUID length estimate
- Reference details: encode/decode signatures and steps
- Digest and attribution

Normalised extract
Base91 is a high-density printable encoding using an alphabet of 91 printable ASCII characters. Unlike fixed-chunk encodings (base62/base85), base91 uses a variable-bit accumulator: bits are appended to a buffer and when the buffer holds enough bits to emit one or two characters depending on the value, characters are produced. This tends to achieve ~6.5 bits/char density.

Technical details
- Bits per char: ≈ 6.5 (empirical), higher than base85
- Alphabet: 91 printable ASCII characters; canonical alphabet from base91 reference site is used (characters spanning many ASCII punctuation and alphanumerics). The exact alphabet must be copied from the authoritative spec when implementing.

Encode algorithm (high-level)
- Maintain integer "b" accumulator and integer "n" bit count
- For each input byte: b |= (byte << n); n += 8
- While n > 13: take value = b & 8191 (13 bits); if value > 88: b >>= 13; n -= 13; else: value = b & 16383 (14 bits); b >>= 14; n -= 14; output two characters: alphabet[value % 91] and alphabet[Math.floor(value / 91)]
- After processing all bytes: if n > 0: output remaining using same rules with padding as needed

Decode algorithm (high-level)
- Reverse process: read two characters at a time, reconstruct value = index0 + index1*91; append bits to accumulator and emit bytes when at least 8 bits available

UUID length estimate
- For 16 bytes input, base91 produces approx ceil(128 / 6.5) ≈ 20 characters (empirically ~20)

Reference details (method signatures)
- encodeBase91(bytes: Uint8Array) => string
- decodeBase91(text: string) => Uint8Array

Digest
- Source fetched: https://base91.sourceforge.net/ (retrieved 2026-03-19) — ~70 KB HTML

Attribution
- Source: base91 project site (SourceForge). Retrieved 2026-03-19. Data size fetched: ~70 KB.