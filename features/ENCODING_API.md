# EXAMPLES

Status: Planned

Overview

Provide a small collection of dependency-free example scripts under examples/ that demonstrate library usage for common tasks: generating the README comparison table, encoding/decoding files or hex input, and a minimal CLI usage example suitable for inclusion in documentation and CI tests.

Primary example scripts

- examples/generate-uuid-comparison.js
  - Consumes listEncodings() and encodeUUIDShorthand() and emits a deterministic markdown table comparing encodings for a configurable set of sample UUIDs.
  - Flags: --out <path> (write file), --stdout (print), --encodings (comma-list), --samples (comma-list of UUIDs)
- examples/encode-sample.js
  - Usage: node examples/encode-sample.js <encoding> <hex-or-file> prints encoded string to stdout; mirrors CLI behaviour but is focused as an example for library consumers.
- examples/cli-usage.js
  - Short script showing programmatic usage of encode/decode/defineEncoding and printing human-readable results; aimed at library adopters.

Acceptance criteria (testable)

1. Each example script exists in examples/ and is executable with Node; running with --stdout prints the documented output and exits 0.
2. generate-uuid-comparison.js --stdout prints a valid markdown table whose header encodings (name and bits/char) exactly match listEncodings() when ordered by bitsPerChar descending.
3. encode-sample.js behaviour is byte-for-byte identical to calling encode(encodingName, data) from src/lib/main.js for provided inputs; tests spawn the script and compare outputs against direct library calls.
4. Examples are dependency-free (Node built-ins only) and small enough to be read in a few minutes by maintainers.

Implementation notes

- Keep examples minimal and conservative about error handling — they are illustrative, not full CLI tools.
- Use relative imports from examples/ into src/lib/main.js so examples reflect live API semantics.
