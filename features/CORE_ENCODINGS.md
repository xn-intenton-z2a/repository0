# CORE_ENCODINGS

Summary

Implement the core encode and decode primitives and three built-in encodings that progressively increase printable density: base62, base85 (Ascii85/Z85 safe subset), and base91. Expose listEncodings() with metadata used by the demo and benchmarks.

Motivation

These encodings form the foundation for achieving the mission: producing the shortest printable UUID representations while guaranteeing round-trip correctness for arbitrary binary.

Scope

- Implement encode(buffer, encoding) and decode(str, encoding) exported from src/lib/main.js.
- Implement built-in encodings: base62, base85, base91 with carefully curated charsets avoiding control and problematic characters.
- Implement listEncodings() returning name, charsetSize, bitsPerChar (theoretical), exampleEncodedUUIDLength, and charset string.
- Ensure error handling for unknown encodings and invalid input.

Built-in encoding expectations

- base62: 62 characters, ~5.95 bits/char, expected UUID length 22.
- base85: 85 safe printable characters, ~6.41 bits/char, expected UUID length 20.
- base91: 91 carefully selected printable characters, ~6.50 bits/char, expected UUID length ~20.

Acceptance criteria

- encode and decode perform round-trip equality for arbitrary buffers, including edge cases: empty buffer, single byte, all-zero, all-0xFF.
- All three built-in encodings are present in listEncodings() and report correct charset sizes and theoretical bitsPerChar.
- Encoding a 16-byte UUID with base85 or base91 yields fewer than 24 printable characters.
- Unit tests assert correctness and expected UUID lengths for each built-in encoding.
- Exports are named exports from src/lib/main.js and used by the web demo and CLI.

Notes

Keep charset definitions explicit and documented; avoid characters that break JSON, shell, or common terminals by default.