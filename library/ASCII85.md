ASCII85

Table of contents
- Encoding algorithm (32-bit blocks -> 5 chars)
- Character range and offset
- Special shorthand and markers (z, <~, ~>)
- Padding / partial-block handling
- Decoding rules and edge cases
- Pseudo-code and API

Normalised extract (implementation facts)
- Core encoding rule:
  - Process input bytes in 4-octet blocks (32 bits) in big-endian (network) order.
  - Treat each 4-octet block as an unsigned 32-bit integer value V.
  - Produce 5 base-85 digits by repeatedly dividing by 85: d4 = V % 85; V = floor(V / 85); repeat for 5 digits, then output digits in most-significant-first order after adding 33 to each digit.
  - Map digit -> ASCII char: char = 33 + digit (range 33..117 which are printable ASCII '!'..'u').
- Special shorthand (Adobe/PostScript variant):
  - If a 4-byte block is exactly zero, it may be encoded as the single character 'z' instead of five '!!!!!'. This shorthand is specific to some variants (not universal). Use only if interoperable with recipients.
- Delimiters used in some contexts: "<~" to start and "~>" to end in PostScript/PDF contexts; implementations that operate on raw strings do not need these delimiters unless required by the container format.
- Final partial block handling:
  - If the final block is less than 4 bytes, pad the block with zero bytes to make 4 bytes, encode to 5 chars, and then output only the first (n+1) encoded characters where n is the number of input bytes in the final partial block. Do not output extra characters corresponding to padded bits.

Decoding rules (explicit)
- Remove delimiters if present and ignore whitespace.
- Expand 'z' to four zero bytes when the variant supports it; validate that 'z' does not appear inside a partial block.
- For each group of up to 5 characters: convert characters to digits by subtracting 33; accumulate the value V by V = V * 85 + digit for each digit; when group reaches 5 digits, emit 4 bytes V in big-endian order. For final partial group, perform the inverse of padded-encoding: reconstruct padded V and then emit only the original number of bytes.

Pseudo-code (encode):
- function ascii85Encode(bytes):
    out = ''
    for i in range(0, len(bytes), 4):
      block = bytes[i:i+4]
      if len(block) < 4: pad block to 4 with zeros
      V = (block[0]<<24)|(block[1]<<16)|(block[2]<<8)|(block[3])
      if V == 0 and allowZ:
         out += 'z'
      else:
         digits = []
         for j in 0..4:
           digits.unshift(V % 85)
           V = floor(V/85)
         for d in digits: out += chr(d + 33)
      if final partial: trim output to (input_len % 4) + 1 characters
    return out

API signatures
- ascii85Encode(input: Uint8Array, options?: {allowZ:boolean, delimiters?:boolean}) -> string
- ascii85Decode(input: string, options?: {allowZ:boolean}) -> Uint8Array

Supplementary details
- Be explicit about whether 'z' shorthand is accepted/produced; if interoperable output is required, provide a configuration flag.
- Tests: exercise sequences of zero bytes, all-0xFF blocks, and partial-final-block lengths {1,2,3}.

Digest and provenance
- Source: https://en.wikipedia.org/wiki/Ascii85
- Retrieved: 2026-03-15
- Crawl snapshot: Wikipedia Ascii85 article (retrieved HTML ~110KB)
- Attribution: Wikipedia (article under compatible license)