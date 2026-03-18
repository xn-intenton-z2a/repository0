# UUID_COMPARISON

Status: Partial — length comparison tests present, README generation script not yet present

Overview

Provide a reproducible comparison table of encoded UUID lengths across encodings. Unit tests already assert that the densest registered encoding produces lengths < 22, but a human-readable README table generation script (examples/) is not committed.

Requirements

- Canonical sample UUIDs: sample, all-zero, all-0xFF, deterministic random UUID used in tests.
- Produce a table where rows are sample UUIDs and columns are encodings showing encoded string and length.

Acceptance criteria (testable)

- Unit tests assert densest encoding length < 22 for sample UUIDs (implemented in tests/unit/encoding.test.js).
- For documentation completeness, add an examples script that generates a README-friendly table from listEncodings() (left as future work). Once the script exists, the README should link to or include the generated table.

Implementation notes

- Generate the table from the library API to avoid drift; place the generator script under examples/ and reference it in README.md when added.
