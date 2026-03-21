# EDGE_CASE_TESTS

Summary

Define unit tests that exercise round-trip correctness and boundary conditions across all encodings.

Required test cases

- Empty buffer (Uint8Array length 0) encodes and decodes to the same empty buffer for all encodings.
- Single byte buffers (0x00, 0xFF, arbitrary) round-trip.
- All-zeros buffer of length 16 (nil UUID) round-trips and may compress if encoding supports shorthand (but must decode back to all zeros).
- All-0xFF buffer of various lengths round-trips.
- Random buffers of varied lengths (1..64 bytes) round-trip across all registered encodings.
- Partial-block handling for block-based encodings (Ascii85/Z85 where final partial blocks have special truncation rules) is explicitly tested.

Testing notes

- Place tests under tests/unit/edge-cases.test.js and import the exported named functions from src/lib/main.js.
- For each test case iterate over listEncodings() to validate encode->decode round-trip.

# ACCEPTANCE CRITERIA

- Unit tests exist and assert round-trip behaviour for the listed edge cases.
- Tests cover both built-in and at least one custom encoding created with createEncoding.
- Tests assert that encoded UUID lengths match the expected exampleLengthFor16Bytes from listEncodings for each encoding.
