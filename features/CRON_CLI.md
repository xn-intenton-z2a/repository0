# CRON_CLI

## Summary

Add a small, well-specified command-line interface (CLI) for the cron engine library that exposes parsing, next-run computation, matching, and string conversion as simple commands. The CLI is lightweight, implemented in the single source file src/lib/main.js (exported functions remain the library API), and documented in README.md with usage examples and sample output.

## Goals

- Provide a discoverable command-line surface for key library features: parse, next, next-n, matches, and toString.
- Keep the CLI minimal and dependency-free; use only Node built-ins.
- Reuse the same core code in src/lib/main.js so tests exercise both library functions and CLI behavior where appropriate.
- Produce clear, machine-friendly output by default (JSON) and a human-friendly text mode for examples.

## CLI UX

Commands (positional):
- parse <expression>    : parse a cron expression and print the structured JSON representation
- next <expression> [--after=<ISO>] : print the next run Date in ISO format (local time) after optional anchor
- next-n <expression> <count> [--after=<ISO>] : print an array of next N run Dates in ISO format
- matches <expression> <iso-date> : print true or false depending on whether the date matches
- tostring <expression> : print the canonical cron string for the parsed expression

Flags:
- --after=<ISO> : optional anchor date in ISO 8601 format; defaults to now
- --json : force JSON output regardless of command
- --human : force human-friendly text output

Behavior:
- By default the CLI prints JSON for parse and next-n, ISO strings for single-date outputs, and plain true/false for matches.
- Errors print a short descriptive message to stderr and exit with non-zero status.

## Implementation Notes

- Implement CLI argument parsing with minimal code using process.argv; avoid adding external dependencies.
- Implement a small dispatch in src/lib/main.js that checks if the module was run directly (node src/lib/main.js) and routes to CLI handling while keeping exports intact for library use.
- Preserve the library's named exports: parseCron, nextRun, nextRuns, matches, toString.
- Unit tests should call the exported functions directly; end-to-end CLI tests may spawn node processes or simulate argv to assert output formatting.

## Acceptance Criteria

- parse command returns JSON matching parseCron output for a sample expression
- next command returns the expected next run in ISO format for a deterministic anchor date
- next-n returns exactly N ISO-formatted dates in ascending order
- matches returns true for a matching date and false otherwise
- CLI exits non-zero and prints a descriptive error for invalid cron expressions
- README includes a concise CLI usage section demonstrating each command

## Files to update

- src/lib/main.js : add CLI dispatch while keeping named exports
- README.md : add a CLI usage examples section
- tests/unit/main.test.js : add or extend tests to cover CLI-related behavior or simulate arguments

## Testing

- Unit tests remain the primary validation for correctness (parse, matches, nextRun, nextRuns, toString).
- Add one or two light integration tests that simulate running the CLI with known arguments and verify stdout and exit code.

## Constraints and Notes

- The CLI must be implemented without adding new dependencies to package.json.
- Keep the CLI surface stable and small; do not add advanced shell completion or subcommand frameworks.
- Ensure all outputs handle local timezone semantics consistently with the library functions.
