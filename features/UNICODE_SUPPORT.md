# CLI_BYTES

Feature name: CLI_BYTES

Summary

Add a bytes subcommand to the existing CLI to compute byte-wise Hamming distance from hex literals or files. The subcommand reuses the library's hammingDistanceBytes export and preserves TypeError/RangeError semantics while providing user-friendly CLI messages.

Behavior

- Command forms
  - node src/lib/main.js bytes hex <hexA> <hexB>
    - Accept hex strings (optional 0x prefix); require only hex digits and even length after removing 0x.
    - Convert to Uint8Array and call hammingDistanceBytes.
  - node src/lib/main.js bytes file <pathA> <pathB>
    - Read files synchronously as binary buffers and call hammingDistanceBytes with normalized Uint8Array views.

- Output and errors
  - Print the integer distance to stdout and exit 0 on success.
  - For validation errors or library-thrown TypeError/RangeError print a concise message with the error name on stderr and exit 2.
  - For unexpected failures, print an error summary and non-zero exit code.

Tests and examples

- Integration tests that spawn node src/lib/main.js bytes hex 010203 010003 and assert stdout '1' and exit 0.
- Tests that create temporary files for file mode and assert correct output and exit codes.
- Tests for invalid hex and mismatched file sizes asserting exit 2 and helpful stderr content.
- Add examples/cli-output.md entries for the canonical hex and file cases used by tests.

Acceptance Criteria

- node src/lib/main.js bytes hex 010203 010003 prints 1 and exits 0
- node src/lib/main.js bytes file examples/a.bin examples/b.bin prints the expected integer and exits 0 when files are same length
- Invalid hex input prints a helpful usage message and exit 2
- Differing file sizes print a RangeError-like message and exit 2
- tests/unit includes hex and file CLI tests and they pass

