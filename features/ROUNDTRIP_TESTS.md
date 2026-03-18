# ROUNDTRIP_TESTS

Status: Done

Overview

Unit tests verify round-trip correctness for all built-in and custom encodings and include edge cases: empty buffer, single byte, all-zero and all-0xFF.

Acceptance criteria

1. tests/unit contains tests asserting encode->decode round-trip for every registered encoding and the specified edge cases.
2. Tests also verify encodeUUIDShorthand and decodeUUIDShorthand produce expected strings and lengths for canonical and edge-case UUIDs.
3. Running npm test exits 0 in CI and locally.
