# CLI_TOOL

Overview

Provide a small command-line interface that wires together expression parsing, range evaluation, CSV loading, rendering, and file output. The CLI must be user-friendly and support a --help flag with usage examples.

Description

The CLI accepts the following flags: --expression, --range, --csv, --file, and --help. If --expression and --range are given, the tool evaluates the expression across the range and renders the resulting series. If --csv is provided, the CSV loader is used. The --file argument determines the output filename and format.

Acceptance Criteria

- A named export cliMain (or main) is provided in src/lib/main.js so tests can invoke the CLI logic programmatically.
- Running node src/lib/main.js --help prints usage information and example commands to stdout and exits with success.
- Running node src/lib/main.js --expression "y=Math.sin(x)" --range "-3.14:0.01:3.14" --file output.svg produces output.svg on disk (tests should run against a temporary path).
- Unit tests cover parsing a simulated argv and verify the CLI delegates to the library functions and writes the expected file.

Implementation Notes

- Prefer to implement CLI argument parsing with a compact helper to avoid pulling large CLI libraries; the parsing code should be testable by calling cliMain with an argv array.
- Document example invocations in README (plain text examples, not code fences) so users know how to call the tool.