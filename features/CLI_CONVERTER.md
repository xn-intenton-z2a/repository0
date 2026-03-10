# CLI_CONVERTER

Summary

Add a small CLI wrapper that exposes the library conversions to the command line. The CLI will support converting integers to Roman numerals and converting Roman strings to integers, suitable for usage in shell scripts and demonstrations on the repository website.

Motivation

A CLI provides an interactive and automatable surface for the library and helps demonstrate functionality on the website and in examples. It also enables behaviour tests and quick manual verification without writing JavaScript.

Scope

- Implement a lightweight CLI script under src/lib/main.js (existing entrypoint) that, when run with flags, performs conversions and prints results to stdout.
- CLI options:
  - --to-roman <number> : prints the Roman numeral for the integer argument and exits 0, or prints an error and exits non-zero for invalid input.
  - --from-roman <string> : prints the integer value for a canonical Roman string and exits 0; for invalid strings prints an error and exits non-zero.
  - --help : prints usage and examples.
- The CLI must use the library's named exports to perform conversion logic without duplicating conversion code.
- Update README examples to include CLI usage snippets.

Implementation notes (developer guidance)

- Use process.exitCode instead of process.exit where possible to ease testability.
- Parse arguments minimalistically; no new dependency required. Keep behaviour deterministic for tests: write outputs to stdout and errors to stderr.
- Exit codes: 0 for success, 2 for invalid arguments/usage, 1 for conversion errors.

Acceptance criteria

- Running node src/lib/main.js --to-roman 1994 prints MCMXCIV and exits 0.
- Running node src/lib/main.js --from-roman MCMXCIV prints 1994 and exits 0.
- Running node src/lib/main.js --to-roman 0 prints an error to stderr and sets non-zero exit code.
- Running node src/lib/main.js --from-roman IIII prints an error to stderr and sets non-zero exit code (consistent with STRICT_VALIDATION).
- README contains CLI usage examples and a note that the CLI uses the same validation rules as the library.
