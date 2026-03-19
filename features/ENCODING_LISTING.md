ENCODING_LISTING

# Summary

Provide a registry and listing API that exposes metadata for all built-in and runtime-created encodings so clients and tests can compare density and expected UUID lengths.

# Motivation

Comparing encodings by bits per character and expected UUID length is central to the mission; a single authoritative listing prevents duplicated calculations in tests and README generation.

# Specification

- Named export (from src/lib/main.js): listEncodings() -> Array of encoding metadata objects.
- Encoding metadata object fields: name (string), charsetSize (integer), bitsPerChar (number, precise to at least 4 decimal places), estimatedUuidLength (integer for 16 bytes), urlSafe (boolean), description (string).
- Built-ins: listEncodings must include entries for base62 and base85 and the built-in high-density example encoding.
- Helpers: export sortEncodingsByDensity(descending=true) -> Array to return encodings ordered by bitsPerChar.
- The listing must be derived from encoding implementations (not hard-coded estimates) to ensure tests and README use accurate values.

# Tests / Acceptance Criteria

- listEncodings returns an array containing objects for base62, base85, and the high-density example, each with accurate charsetSize and bitsPerChar values.
- sortEncodingsByDensity(true) places the densest encoding first; tests compute bitsPerChar from the encoding implementation to assert correctness.
- Integration test: using listEncodings data to build a UUID comparison table yields the same lengths as actual encodeUUID* outputs for each encoding.
- Export checks: listEncodings and sortEncodingsByDensity are named exports from src/lib/main.js and covered by unit tests.
