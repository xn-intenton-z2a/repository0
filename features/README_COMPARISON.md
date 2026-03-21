# README_COMPARISON

Summary

Update README.md to include a concise comparison table showing encoded sizes for a canonical 16-byte UUID across the library's encodings. The table serves both as documentation and acceptance evidence for density goals.

Table columns

- Encoding name
- Charset size
- Bits per char (rounded to 4 decimals)
- UUID chars (encoded length for 16 bytes)
- Notes (URL-safe, variant name)

Suggested rows (example values)

- UUID hex | 16 | 4.0000 | 32 | canonical textual hex representation
- base64 (unpadded) | 64 | 6.0000 | 22 | base64url without padding is recommended for URL-safe usage
- base62 | 62 | 5.9542 | 22 | URL-safe
- Z85 | 85 | 6.4094 | 20 | Z85 base85 mapping
- PRINTABLE_ASCII | 94 | 6.5546 | 20 | densest printable alphabet (optionally omit ambiguous chars)

# ACCEPTANCE CRITERIA

- README.md contains a comparison table with the columns above and rows for the built-ins.
- The README table makes explicit which encoding is the densest and that the densest produces fewer than 22 characters for a UUID.
- A unit test or a small verification script (tests/unit/readme-comparison.test.js) asserts that the values in the table match computed metadata from listEncodings to protect documentation drift.
