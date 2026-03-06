# ROMAN_CLI

Overview

Add a small, zero-dependency command-line interface to the existing Roman numeral library that exposes conversions both ways and can be used in shell pipelines and scripts.

Motivation

A CLI increases the library's reach by making conversions available directly to developers and automation without requiring a Node.js wrapper. This feature is implementable entirely in src/lib/main.js and tested with unit tests and examples.

Specification

- Add a CLI entry path in src/lib/main.js that detects when the file is executed as a script (node src/lib/main.js) and dispatches commands.
- Supported commands: to-roman <number>, from-roman <string>, and --help.
- Support reading a single argument or reading a value from stdin when no argument is given.
- Exit codes: 0 for success, 2 for usage errors (invalid args), and 3 for conversion errors (RangeError/TypeError thrown by library functions).
- CLI should print only the conversion result to stdout on success (no extra logging), and print an error message to stderr on failure.

CLI Behaviour and Examples

- Example: node src/lib/main.js to-roman 1994
  Output: MCMXCIV

- Example: echo 1994 | node src/lib/main.js to-roman
  Output: MCMXCIV

- Example: node src/lib/main.js from-roman MCMXCIV
  Output: 1994

- Example: echo MCMXCIV | node src/lib/main.js from-roman
  Output: 1994

Implementation Notes

- Keep the CLI logic minimal: parse argv, choose function, handle synchronous errors from toRoman/fromRoman and translate them to exit codes and stderr messages.
- Do not change exported API; module should continue to export named functions toRoman and fromRoman when required as a library.
- Add unit tests for CLI wrappers in tests/unit/ confirming stdout/stderr and exit codes where appropriate.

Acceptance Criteria

- Running node src/lib/main.js to-roman 1994 prints MCMXCIV and exits 0.
- Running node src/lib/main.js from-roman MCMXCIV prints 1994 and exits 0.
- Passing invalid input (node src/lib/main.js to-roman 0) writes an error to stderr and exits with code 3.
- When no args are given, the CLI reads from stdin and behaves the same as with an explicit arg.
- The existing named exports toRoman and fromRoman remain unchanged and pass existing unit tests.

Tests and Examples

- Add unit tests that spawn the CLI via child_process.execSync or spawn to assert output and exit codes for valid and invalid inputs.
- Update README examples to include a short section showing the CLI usage.

Compatibility

- Implementation should be compatible with Node.js 24+ as declared in package.json.
