# CLI_TOOL

# Summary
Add a minimal, well-documented command-line interface that exposes the library's toRoman and fromRoman functions for interactive use, deterministic behaviour tests, and README examples. The CLI must be implemented inside src/lib/main.js behind a main guard so no new files are required and named exports are preserved.

# Motivation
A tiny CLI makes the library easy to demo on the website, enables deterministic behaviour tests that assert exact stdout/stderr/exit codes, and provides reproducible examples for README without adding dependencies.

# Specification
- Location: Implement CLI harness inside src/lib/main.js guarded by an ESM main check (compare process.argv[1] to import.meta.url or use process.argv length and process.stdin when appropriate).
- Exports: Preserve named exports toRoman and fromRoman exactly; the CLI must not change their signatures.

Commands and behaviour
- to-roman <number>
  - Converts the provided integer string to a Roman numeral using toRoman and writes the exact Roman string to stdout with a single trailing newline, then exits with code 0.
  - For non-integer input or numbers outside 1..3999, write a single-line error to stderr beginning with RangeError: and exit with code 2.
- from-roman <roman>
  - Converts the provided Roman string to an integer using fromRoman and writes the integer as digits followed by a single newline to stdout, then exits with code 0.
  - For invalid Roman strings, write a single-line error to stderr beginning with TypeError: and exit with code 2.
- No-arg mode
  - If invoked with no command arguments, read one trimmed line from stdin synchronously, auto-detect whether it is digits-only (treat as to-roman) or not (treat as from-roman), then behave as above.

I/O stability
- Successful output must be exactly the conversion result with a single newline and no extra logging.
- Error lines must be single-line, deterministic, and start with either RangeError: or TypeError: to enable exact assertions in tests.

Compatibility and constraints
- Do not add dependencies. Keep implementation inside src/lib/main.js and preserve programmatic API for consumers.
- Use synchronous stdin read only for the no-arg mode to keep behaviour deterministic in tests.

Tests and README
- Tests in tests/unit/ should spawn node src/lib/main.js with arguments and assert stdout, stderr, and exit code for examples including:
  - node src/lib/main.js to-roman 1994 => stdout exactly MCMXCIV\n, exit 0
  - node src/lib/main.js from-roman MCMXCIV => stdout exactly 1994\n, exit 0
  - node src/lib/main.js to-roman 0 => stderr starts with RangeError:, exit 2
  - node src/lib/main.js from-roman IIII => stderr starts with TypeError:, exit 2 (documented choice: fromRoman rejects non-canonical forms)
- README.md must include short CLI usage examples demonstrating programmatic and CLI round-trips for a few sample values.

# Acceptance Criteria
- CLI implemented inside src/lib/main.js behind a main guard and preserves named exports.
- to-roman 1994 returns MCMXCIV via CLI with exit code 0.
- from-roman MCMXCIV returns 1994 via CLI with exit code 0.
- to-roman 4 returns IV via CLI.
- to-roman 0 and 4000 produce stderr starting with RangeError: and exit 2.
- from-roman IIII produces stderr starting with TypeError: and exit 2; README documents that non-canonical forms are rejected by fromRoman.
- Unit tests assert exact stdout/stderr lines and exit codes and pass under npm test.

# Files to update
- src/lib/main.js: add CLI harness behind main guard and preserve exports
- tests/unit/: add CLI invocation tests asserting stdout/stderr and exit codes
- README.md: add concise CLI usage examples and document the choice to reject non-canonical forms


