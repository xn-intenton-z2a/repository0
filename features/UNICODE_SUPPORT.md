# CLI_BYTES

Specification

Provide a bytes-mode for the existing CLI wrapper around src/lib/main.js that exposes the library's hammingDistanceBytes API to end users from the command line. This feature adds a new CLI subcommand bytes that computes the Hamming distance between two binary sequences (expressed as hex strings or file paths) and preserves the library's TypeError/RangeError semantics when used programmatically.

Summary

- Feature name: CLI_BYTES
- Surface: extension of the existing CLI (node src/lib/main.js) and README examples
- Goal: let users compute byte-wise Hamming distance from the command line using simple inputs (hex strings or file paths) and add tests and examples demonstrating usage and error handling.

CLI behaviour

- Command forms:
  - node src/lib/main.js bytes hex <hexA> <hexB>
    - Interprets each argument as a hex-encoded byte sequence (even length, optional 0x prefix). Example: 0x010203 or 010203.
  - node src/lib/main.js bytes file <pathA> <pathB>
    - Reads both files as binary and compares their bytes.
- Output:
  - On success, print the byte Hamming distance as a single number to stdout and exit 0.
  - On validation or usage errors, print a friendly message to stderr and exit code 2.
  - If the library throws TypeError or RangeError, the CLI prints a short user-friendly message mapping to the error and exits 2.

Validation rules

- For hex mode:
  - Both hex strings must contain only hex digits and have even length when 0x is removed.
  - Convert to Uint8Array before calling hammingDistanceBytes.
- For file mode:
  - Both files must exist and be readable; file sizes must be equal or hammingDistanceBytes will yield RangeError semantics which the CLI maps to a friendly message.
- The CLI must not swallow stack traces; log the error name to stderr (e.g., RangeError: unequal byte lengths) and a short explanation.

Integration with library

- The CLI must import the named export hammingDistanceBytes from src/lib/main.js and call it synchronously with appropriate normalized inputs (Uint8Array views).
- Do not change the library's error types; the CLI maps them to user messages.

Tests and examples

- Add unit/integration tests under tests/unit/ that spawn the CLI (node) for both modes and assert stdout and exit codes.
  - hex mode success: node src/lib/main.js bytes hex 010203 010003 prints 1 and exits 0
  - file mode success: create two temporary files with identical length and differing bytes; CLI prints expected distance and exits 0
  - mismatched lengths: CLI prints a RangeError-like message and exits 2
  - invalid hex: CLI prints a validation message and exits 2
- Add examples/cli-output.md entries showing expected stdout lines for the canonical cases used by tests (hex and file examples).

README updates

- Add a CLI section describing the new bytes subcommand with short examples for hex and file usage and a note about how the CLI maps typed errors to user-friendly messages.
- Reference examples/cli-output.md for exact expected outputs.

Acceptance Criteria

- node src/lib/main.js bytes hex 010203 010003 prints 1 and exits 0
- node src/lib/main.js bytes file examples/a.bin examples/b.bin prints the expected integer and exits 0 when files are same length
- Invalid hex input prints a helpful usage message and exits 2
- Differing file sizes print a RangeError-like message and exit 2
- tests/unit includes CLI tests for hex and file modes and they pass
- README contains a Bytes CLI section with examples and a link to examples/cli-output.md

Notes

- Keep the CLI synchronous and side-effect minimal; file reads should use fs.readFileSync.
- Validate hex inputs strictly; do not silently pad or truncate.
- Reuse existing CLI error codes and messaging conventions (exit code 2 for user/validation errors).

