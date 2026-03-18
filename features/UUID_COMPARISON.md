# UUID_COMPARISON

Overview

Add a reproducible README section and lightweight script that produces a comparison table of encoded UUID lengths across encodings. The goal is to clearly demonstrate density gains over hex (32 chars) and base64 (22 chars) and to verify the repository's densest encoding meets the mission (<22 chars for a UUID).

Requirements

- Provide a canonical set of sample UUIDs: canonical example, all-zero UUID, all-0xFF UUID, and one random UUID used in tests.
- Produce a table with rows=sample UUIDs and columns=encodings (hex, base64, base62, base85, base91, any custom encodings) showing encoded string and length.
- Include a small script or example code snippet (examples/) that computes the table from the library API so it is reproducible by tests.

Acceptance criteria

- README contains a UUID comparison table or a link to the generated table in docs/ produced by examples/ script.
- A unit test or example asserts that the densest encoding length for each sample UUID is strictly less than 22 characters.

Implementation notes

- Prefer generating the table from the library to avoid drift; include the script under examples/ and reference it from README.md.
