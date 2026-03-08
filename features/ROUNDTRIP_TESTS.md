# ROUNDTRIP_TESTS

# Overview

Define a focused feature that adds comprehensive round-trip tests to validate encode/decode correctness across edge cases, input types, and all registered encodings.

# Motivation

Round-trip correctness is the most important invariant for any encoding library. Exhaustive tests give confidence in adding denser encodings and guarantee regressions are caught.

# Specification

Tests to add:

- tests/unit/roundtrip.test.js must iterate over all encodings returned by listEncodings() and run the following cases for each:
  - empty buffer
  - single-byte buffers for values 0x00, 0x01, 0x7F, 0x80, 0xFF
  - 16-byte buffers: all zeros, all 0xFF, incremental sequence 0x00..0x0F
  - random buffers: several random lengths including small and large (e.g., 1, 2, 3, 15, 16, 17, 31, 32)
  - ArrayBuffer and Uint8Array input variants

- For each case, assert that decode(encode(input, enc), enc) deep-equals the original bytes.

Performance considerations:

- Keep random sample sizes small in unit tests to ensure fast CI (e.g., 5 random samples per length).

# Acceptance criteria

- tests/unit/roundtrip.test.js is present and, once the implementation exists, should pass against all registered encodings.
- Tests cover the specified edge cases and input types.
- Any failure must provide useful diagnostics including encoding name and test case description.
