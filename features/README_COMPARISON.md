# README_COMPARISON

Overview

Document a reproducible comparison of encoded UUID lengths across available encodings so users can see which encoding yields the shortest printable representation for a v7 UUID.

Canonical sample v7 UUID

- Use the canonical sample UUID: 0186a7ad-1b9e-7e00-8a2d-000000000001 for the comparison table and tests.

Specification

- The project README must include a table with columns: Encoding name, charsetSize, bitsPerChar, Encoded length for the canonical v7 UUID.
- Reproducible procedure: for each encoding returned by listEncodings, call encodeUUID with the canonical sample UUID and record the resulting string length; use listEncodings metadata when documenting charsetSize and bitsPerChar.
- The comparison must be reproducible by running the unit test or verification script included in tests/unit that uses the library public API.

Acceptance criteria

- The README contains the comparison table and the canonical sample UUID stated above.
- A unit test or verification script reproduces the procedure and asserts that the shortest encoded length (the densest encoding) is strictly less than 22 characters for the canonical v7 UUID.
- The README references listEncodings and encodeUUID as the mechanisms to reproduce the table and links to the test that verifies the claim.
