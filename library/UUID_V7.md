UUID_V7

Table of contents
- Purpose and motivation
- Exact bit layout and canonical assembly
- Construction algorithm (pseudo-code)
- Formatting to canonical UUID string
- Monotonicity and collision considerations
- Reference implementations and interop notes

Normalised extract (implementation facts)
- Purpose: UUID version 7 is a time-ordered UUID intended to provide creation-time locality while avoiding MAC address exposure. It embeds a Unix-epoch timestamp and supplementary bits for uniqueness.
- Exact bit composition (128 bits total), as described in the reference material:
  - 48-bit unsigned big-endian Unix Epoch timestamp in milliseconds (T)  -- bits 0..47 (most significant)
  - 4-bit version field set to binary 0111 (value 7)                  -- next 4 bits
  - 12-bit field (P) for increased precision, monotonic counter, or pseudorandom bits
  - 2-bit variant field set to binary 10 (RFC-4122 variant)         -- next 2 bits
  - 62-bit field (R) reserved for randomness or monotonic construct -- remaining bits
- Canonical assembly (recommended bit operations)
  - Represent the 128-bit UUID as a big-endian unsigned integer U and assemble with shifts:
    U = ((T & 0xFFFFFFFFFFFF) << 80)           // place 48-bit timestamp in the top 48 bits
      | ((0x7 & 0xF) << 76)                     // version = 7 in the next 4 bits
      | ((P & 0xFFF) << 64)                     // 12-bit precision/sequence field
      | ((0x2 & 0x3) << 62)                     // variant bits (binary 10)
      | (R & 0x3FFFFFFFFFFFFFFF)               // lower 62 bits random/sequence
  - After building U, serialize to 16 bytes (big-endian) and format into the canonical 8-4-4-4-12 hex groups with hyphens.

Construction pseudo-code (reference):
- function uuidv7(now_ms = Date.now(), getP12 = random12OrCounter, getR62 = random62):
    T = now_ms & 0xFFFFFFFFFFFFn  // 48 bits
    P = getP12() & 0xFFF          // 12 bits
    R = getR62() & 0x3FFFFFFFFFFFFFFFn // 62 bits
    U = (T << 80) | (0x7 << 76) | (P << 64) | (0x2 << 62) | R
    bytes = bigEndianBytes(U, 16)
    return formatHexWithHyphens(bytes) // 8-4-4-4-12

Formatting detail (hex groups):
- Given 16 bytes b[0..15], canonical textual UUID is:
  hex(b[0..3]) + '-' + hex(b[4..5]) + '-' + hex(b[6..7]) + '-' + hex(b[8..9]) + '-' + hex(b[10..15])
- Ensure the version nibble (in byte b[6] high nibble) is 0x7 and the variant bits (top bits of byte b[8]) are binary 10.

Monotonicity and collision avoidance
- To obtain monotonic ordering within the same millisecond, supply P (12-bit) as a sub-millisecond counter or incrementing sequence; for cross-process uniqueness, seed P with process-local counter and R with random bits.
- The 62-bit R field provides a large namespace; use CSPRNG for R if predictability must be avoided.

API signatures (recommended)
- generateUUIDv7(options?: {nowMs?: number, sequenceProvider?: () => number, randomProvider?: (nBits)=>BigInt}) -> string
- parseUUIDv7(uuidString: string) -> {timestampMs: number, version: number, sequenceBits: number, randomBits: BigInt}

Digest and provenance
- Source: https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_7_(Unix_epoch_time-based)
- Retrieved: 2026-03-15
- Crawl snapshot: Wikipedia section on UUIDv7 (retrieved HTML ~184KB)
- Attribution: Wikipedia (summarised), implementers should consult the latest UUID draft and interop references for exact canonical bit ordering if strict compliance is required.
