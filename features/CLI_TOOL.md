# CLI_TOOL

## Summary
Add a small command-line interface to the library that exposes the core conversion functions to end users and demonstrates expected behaviour for the website and tests. The CLI provides two commands: to-roman and from-roman, accepts arguments and stdin, validates input according to the mission rules, and returns exit codes and machine-friendly output for use in examples and behaviour tests.

## Motivation
The repository provides a JavaScript library to convert between integers and Roman numerals. A minimal CLI makes the library easier to demo, exercise in behaviour tests and examples, and helps users interactively verify conversions without writing JavaScript. The CLI will also serve as a canonical example used in README and docs.

## Specification
- Name: cli (node entry point at src/lib/main.js will also export functions; a lightweight CLI harness will be added inside that file behind a detect-if-main guard).

- Commands:
  - to-roman <number>
    - Converts an integer 1..3999 to a Roman numeral string and prints it to stdout.
    - On invalid numeric input or out-of-range values, print a descriptive error to stderr and exit 2.
    - On success exit 0.
  - from-roman <roman>
    - Converts a Roman numeral string to an integer and prints the integer to stdout.
    - On invalid roman input, print a descriptive error to stderr and exit 2.
    - On success exit 0.
  - If no arguments provided, read a single line from stdin and auto-detect whether it is an integer or Roman string, then perform conversion.

- Behavior and validation rules:
  - Use existing toRoman and fromRoman exports for implementation.
  - Follow mission error semantics: throw RangeError for out-of-range numbers, TypeError for invalid Roman strings; for CLI translate these to exit code 2 and human-friendly messages.
  - Output must be plain text, no extra decoration, to make it easy for tests to assert exact output.
  - Keep CLI code minimal and self-contained inside src/lib/main.js so no additional files are necessary.

- Tests and examples:
  - Add unit tests or update existing tests to exercise CLI behaviour (invoke node src/lib/main.js with arguments) verifying stdout, stderr and exit codes for:
    - to-roman 1994 outputs MCMXCIV and exit 0
    - from-roman MCMXCIV outputs 1994 and exit 0
    - to-roman 0 exits 2 with RangeError-equivalent message
    - from-roman IIII exits 2 with TypeError-equivalent message (documented choice)
  - Add README usage examples showing both library API usage and CLI examples.
  - Ensure round-trip property demonstrated in examples: fromRoman(toRoman(n)) === n for sample numbers.

## Implementation notes
- Implement CLI using simple process.argv parsing and process.stdin.read when no args.
- Do not add new dependencies; keep implementation in src/lib/main.js using exported functions.
- Keep messages stable and exact so unit tests can assert them (provide sample expected strings in tests).

## Acceptance Criteria
- to-roman 1994 returns MCMXCIV when invoked via node src/lib/main.js to-roman 1994
- from-roman MCMXCIV returns 1994 when invoked via node src/lib/main.js from-roman MCMXCIV
- to-roman 4 returns IV via CLI
- from-roman(toRoman(n)) === n demonstrated for sample values in README and tests
- to-roman 0 exits with non-zero exit code and prints a RangeError-style message
- to-roman 4000 exits with non-zero exit code and prints a RangeError-style message
- from-roman IIII exits with non-zero exit code and prints a TypeError-style message (behaviour documented in README)
- All added or updated tests pass under npm test

## Files to change
- src/lib/main.js: add minimal CLI harness guarded by require.main / process.argv check
- tests/unit/*: add or update tests to run CLI commands and assert outputs
- README.md: add CLI usage examples
- package.json scripts: existing start:cli already runs node src/lib/main.js so no change necessary

## Notes
- Keep the CLI minimal and focused on demonstrating and testing the library rather than being a full-featured tool.
- Ensure messages and exit codes are stable and documented so CI tests and examples remain reliable.
