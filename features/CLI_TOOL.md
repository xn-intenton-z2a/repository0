# CLI_TOOL

## Summary
Add a minimal, well-documented command-line interface that exposes the library's toRoman and fromRoman functions for interactive use, examples, and behaviour tests. The CLI will live inside src/lib/main.js behind a main guard so no new files are required.

## Motivation
A tiny CLI makes the library easy to demo on the website, enables deterministic behaviour tests, and provides reproducible examples in the README without adding extra packages or scripts.

## Specification
- Location: Implement CLI harness inside src/lib/main.js guarded by require.main equivalent for ESM (process.argv[1] check).
- Exports: Keep named exports toRoman and fromRoman intact.

Commands and behavior
- to-roman <number>
  - Reads an integer string, converts 1..3999 to Roman using toRoman, writes exact Roman string to stdout, exits 0.
  - For non-integer input or out-of-range values, write a concise error message to stderr and exit 2. Messages should start with "RangeError:" for out-of-range and "TypeError:" for type/parse problems to match mission semantics.
- from-roman <roman>
  - Reads a Roman string, converts to integer using fromRoman, writes the integer to stdout, exits 0.
  - For invalid Roman strings, write a concise error message to stderr and exit 2. Messages should start with "TypeError:".
- No-arg mode
  - If invoked with no args, read a single trimmed line from stdin and auto-detect integer vs Roman (digits only => integer conversion), then behave as above.

I/O stability
- All successful output must be exactly the conversion result and terminated with a single newline.
- Error lines must be deterministic and begin with the error kind (RangeError: or TypeError:) to allow exact assertions in tests.

Compatibility and constraints
- Do not add dependencies. Keep implementation in a single source file.
- Preserve library API and tests that import named exports.

Tests and examples
- Add or update unit tests under tests/unit/ to spawn node src/lib/main.js with arguments and assert stdout, stderr, and exit code for cases including:
  - node src/lib/main.js to-roman 1994 => stdout: MCMXCIV, exit 0
  - node src/lib/main.js from-roman MCMXCIV => stdout: 1994, exit 0
  - node src/lib/main.js to-roman 0 => stderr starts with "RangeError:", exit 2
  - node src/lib/main.js from-roman IIII => stderr starts with "TypeError:", exit 2 (documented choice: invalid subtractive form is rejected)
- Update README.md to show both programmatic usage and CLI examples demonstrating round-trip for a few sample values.

Acceptance Criteria
- CLI lives inside src/lib/main.js and does not alter named exports.
- to-roman 1994 returns MCMXCIV via CLI and exit code 0.
- from-roman MCMXCIV returns 1994 via CLI and exit code 0.
- to-roman 4 returns IV.
- to-roman 0 and 4000 produce RangeError: messages and exit 2.
- from-roman IIII produces TypeError: message and exit 2 (behaviour documented in README).
- Tests assert exact stdout/stderr lines and exit codes and pass under npm test.

Implementation notes
- Use process.argv parsing and synchronous process.stdin read when necessary.
- Keep messages short and stable to make tests robust.
- Do not change package.json or add files; tests and README changes are limited to examples and assertions.

Files to update
- src/lib/main.js: implement CLI harness behind main guard and preserve exports
- tests/unit/: add CLI invocation tests asserting stdout/stderr and exit codes
- README.md: add concise CLI usage examples and document error choices


