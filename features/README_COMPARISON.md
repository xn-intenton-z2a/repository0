# README_COMPARISON

Overview

Document a reproducible comparison of encoded UUID lengths across available encodings so users can see which encoding yields the shortest printable representation for a v7 UUID.

Specification

- The project README must include a table with columns: Encoding name, charsetSize, bitsPerChar, Encoded length for sample v7 UUID.
- Include a canonical sample v7 UUID used for the table so results are reproducible in tests.
- Document how to reproduce the table using the library API: listEncodings, encodeUUID.

Acceptance criteria

- README contains the comparison table and the canonical sample UUID.
- Unit tests or a small verification script confirm that the densest encoding listed produces a representation shorter than 22 characters for the canonical v7 UUID.
- The README entry references listEncodings for the metadata used in the table.