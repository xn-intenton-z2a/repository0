ENCODING_LISTING

# Summary

Add an encodings registry and listing API that returns metadata for every available encoding. The API will allow clients to enumerate built-in encodings and any custom encodings created at runtime.

# Motivation

Comparing density and charset properties across encodings is core to the mission. A standardized listing enables README comparison tables, tests that compare UUID lengths, and user selection of encodings by density.

# Specification

- Export a function listEncodings() -> Array of encoding metadata objects. Each object includes: name, charsetSize, bitsPerChar (floating point), estimatedUuidLength (for 16 bytes), urlSafe (boolean), and description.
- The registry must include the built-in encodings base62 and base85 and the example high-density encoding from HIGH_DENSITY_CUSTOM.
- Provide a helper sortByDensity(descending=true) that returns encodings ordered by bitsPerChar.

# Tests / Acceptance Criteria

- listEncodings() returns an array containing entries for base62, base85, and the high-density example, each with accurate bitsPerChar values and charset sizes.
- Tests assert that sorting by density places the densest encoding first and that the listed estimatedUuidLength values match the actual encoded lengths produced by the respective encode functions.
- README generation: the data from listEncodings is sufficient to generate the UUID encoding comparison table required by the mission; a unit test should exercise this by asserting the comparison table data contains expected entries and numeric values.
