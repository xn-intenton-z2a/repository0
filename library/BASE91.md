NORMALISED EXTRACT

Table of contents:
1) Overview and density
2) Algorithmic approach
3) API patterns
4) UUID length estimate

Overview and density
- Base91 is a dense binary-to-text encoding using 91 printable characters. Its entropy per character is log2(91) ≈ 6.5076 bits/char. For 16 bytes (128 bits) this yields an encoded length of about ceil(128 / 6.5076) ≈ 20 characters.

Algorithmic approach
- Implementations of base91 typically use a variable-bit buffer method: read input bytes into an integer accumulator, emit characters while accumulating enough bits, and adjust a running bit count.
- Encoding produces very high density by emitting characters when enough bits are present rather than fixed-size groups; decoding restores bytes by reversing the accumulator process.

API patterns (practical signatures)
- createBase91() -> Encoder
- Encoder.encode(input: Uint8Array) -> string
- Encoder.decode(input: string) -> Uint8Array
- Implementations must ensure round-trip identity: decode(encode(u8)) equals original Uint8Array for all inputs.

UUID length estimate
- Expected encoded length for a v7 UUID (16 bytes) with base91 is approximately 20 characters, meeting the mission baseline (shorter than base64 no-padding = 22 chars) in typical implementations.

Detailed digest
- Source: https://en.wikipedia.org/wiki/Base91
- Retrieved: 2026-03-21
- Bytes fetched: 48301

Attribution
- Wikipedia: Base91 page (algorithm description and background).