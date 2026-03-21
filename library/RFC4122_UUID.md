RFC4122_UUID

NORMALISED EXTRACT

Table of contents:
1. String format (ABNF)
2. Byte layout and network byte order
3. Parsing steps (strip dashes -> bytes)
4. Shorthand for UUID encoding (mission-specific)
5. Edge cases (nil UUID, validation)

1. String format (ABNF and canonical text)
- RFC 4122 defines the canonical textual representation of a UUID as five hex fields separated by hyphens: 8-4-4-4-12 hex digits. Example: f81d4fae-7dec-11d0-a765-00a0c91e6bf6
- ABNF excerpt (from RFC):
  UUID = time-low "-" time-mid "-" time-high-and-version "-" clock-seq-and-reserved clock-seq-low "-" node
  time-low = 4hexOctet
  time-mid = 2hexOctet
  time-high-and-version = 2hexOctet
  clock-seq-and-reserved = hexOctet
  clock-seq-low = hexOctet
  node = 6hexOctet
  hexOctet = hexDigit hexDigit
  hexDigit = 0-9 / a-f / A-F

2. Byte layout and network byte order
- The canonical string encodes the UUID fields as hexadecimal digits with the most significant octet first (network byte order) inside each field.
- The binary representation of a UUID is 16 bytes (128 bits). The string representation corresponds to those bytes in order: hex pair 0/1 -> byte 0, hex pair 2/3 -> byte 1, ... up to byte 15.

3. Parsing steps (precise, implementable)
- Given uuidString (string):
  - step A: canonicalHex = uuidString.replace(/-/g, "")
  - step B: validate length == 32 and all characters are [0-9a-fA-F]
  - step C: let bytes = new Uint8Array(16)
  - for i from 0..15: bytes[i] = parseInt(canonicalHex.substr(i*2, 2), 16)
  - return bytes
- The parse preserves byte order exactly as represented by the hex string (byte 0 is first hex pair).

4. Shorthand for UUID encoding (mission recommended pattern)
- Purpose: shorthand to encode a typical UUID using a chosen binary-to-text encoder.
- Steps (explicit):
  1) Remove hyphens: canonicalHex = uuid.replace(/-/g, "")
  2) Convert pairs of hex to 16-byte Uint8Array (see parsing steps above)
  3) Optionally: reverse the byte order if the target encoding or existing convention requires it (the mission states: "strip dashes from a UUID string, encode the 16 bytes, and reverse"); implementers must confirm whether the reversal is required by their external consumers. If reversal is required, call bytes.reverse() after step 2.
  4) Call encoder.encode(bytes) where encoder implements encode(Uint8Array) -> string
- Example API helper signature:
  function encodeUuidShorthand(uuidString: string, encoder: { encode(input: Uint8Array): string }, reverseBytes: boolean = true): string
    - returns encoded string

5. Edge cases and validation
- Nil UUID (all-zero bytes) is allowed; parsing and encoding should round-trip.
- Validate hex length and characters; throw or return error on malformed input.
- Tests: empty string (invalid), single byte, all-zero bytes, all-0xFF bytes — ensure correct behavior.

SUPPLEMENTARY DETAILS
- Note on versions/variants: RFC 4122 encodes version and variant bits inside specific fields; those bits are part of the 16 bytes and must be preserved during binary encode/decode operations.

DETAILED DIGEST
Source: RFC 4122 (A UUID URN Namespace) — retrieved 2026-03-21
Crawled size (first 400 lines captured): 78494 bytes
Extracted details: ABNF for the canonical textual representation, explicit byte layout and parsing algorithm, sample algorithms for constructing and interpreting UUID fields.

ATTRIBUTION
Source URL: https://www.rfc-editor.org/rfc/rfc4122.html
Crawl size: 78494 bytes
Retrieved: 2026-03-21
