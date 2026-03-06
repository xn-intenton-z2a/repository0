# HAMMING_CLI

# Overview

Provide a concise, testable command-line interface for the repository's Hamming utilities so users can compute Hamming distances directly from the shell or scripts. The CLI is implemented in the existing entrypoint file src/lib/main.js and must be a minimal, dependency-free shim that delegates to the library functions hammingDistance and hammingDistanceBits exported by src/lib/main.js.

# Specification

Purpose
- Expose two subcommands: string and bits.
- string computes Unicode-safe Hamming distance between two input strings.
- bits computes bitwise Hamming distance between two non-negative integers or between two hex-encoded byte sequences.

Invocation
- node src/lib/main.js string A B
  - Computes the hammingDistance between A and B and writes the numeric result to stdout followed by a newline.
- node src/lib/main.js bits X Y
  - If X and Y are decimal integer literals, parse them as integers (allow BigInt notation with trailing n) and compute hammingDistanceBits.
  - If X and Y are hex byte strings prefixed with 0x or of even length, interpret them as byte sequences and compute bitwise Hamming distance across the byte sequences.
- node src/lib/main.js --help
  - Writes a short usage summary and exits with code 0.

Output formats
- Default: single-line textual integer printed to stdout (e.g., 3).
- JSON mode: passing --json prints a JSON object {"command":"string","a":"...","b":"...","distance":N} and exits 0 for success.

Validation and exit codes
- On successful computation: exit code 0.
- On input type errors (e.g., non-string for string command, invalid integer syntax): write a clear error to stderr and exit 2.
- On domain errors (e.g., unequal string code point lengths, negative integers, byte-sequence length mismatch): write a clear error to stderr and exit 3.
- On unexpected errors: write an error to stderr and exit 1.

Behavior details
- The string subcommand must use the library's hammingDistance implementation which normalizes both inputs to NFC and compares by Unicode code points.
- The bits subcommand must reuse hammingDistanceBits from the library; it should accept Number, BigInt literal notation, or hex byte sequences and apply the same validation rules as the library.
- The CLI must not implement separate core logic; it only parses arguments, validates basic surface syntax, coerces inputs according to the library rules, invokes the library functions and formats the result.

Examples
- node src/lib/main.js string karolin kathrin
  - Outputs 3
- node src/lib/main.js string "e\u0301" "é"
  - Outputs 0
- node src/lib/main.js bits 1 4
  - Outputs 2
- node src/lib/main.js bits 0x01 0x04
  - Outputs 2
- node src/lib/main.js --help
  - Outputs usage summary and exits 0

Acceptance criteria
- Running node src/lib/main.js string karolin kathrin prints 3 and exits 0.
- Running node src/lib/main.js string "" "" prints 0 and exits 0.
- Running node src/lib/main.js string a bb prints a clear RangeError-style message on stderr and exits 3.
- Running node src/lib/main.js bits 1 4 prints 2 and exits 0.
- Running node src/lib/main.js bits 0 0 prints 0 and exits 0.
- Running node src/lib/main.js bits 1n 4n prints 2 and exits 0 if BigInt literals are provided.
- --json mode prints a valid JSON object with distance and original inputs.
- A unit test exercising main with process.argv simulation verifies stdout, stderr and exit codes for the above cases.

Tests and files to update
- Add tests/unit/cli.test.js (or update existing tests) to call main with simulated argv and assert stdout/stderr and exit codes; tests should be minimal and rely on the exported library functions for correctness.
- Update README.md examples to include the CLI usage lines above.

Implementation notes
- Keep the CLI code minimal in src/lib/main.js: parse args, perform light validation, call exported functions, write outputs, set process.exitCode instead of calling process.exit directly in tests.
- Avoid adding dependencies; use only built-in Node APIs.

Compatibility with mission
- Realizes the mission by providing an accessible CLI surface for the Hamming distance library and encourages discoverability and scripting use.


