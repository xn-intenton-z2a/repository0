# CRON_CLI

## Summary

A minimal, dependency-free command-line interface for the cron engine library implemented inside src/lib/main.js. The CLI exposes parse, next, next-n, matches, and tostring subcommands while reusing the same exported functions used by library consumers and tests.

## Goals

- Provide a discoverable CLI for core library capabilities with machine-friendly default output.
- Keep the CLI implementation small and free of external dependencies using only Node built-ins.
- Ensure the CLI behavior is deterministic and testable from unit or light integration tests.

## CLI Commands and Flags

Commands (positional):
- parse <expression>
  - Print the parsed representation as JSON.
- next <expression> [--after=<ISO>]
  - Print the next run Date in ISO format (local time).
- next-n <expression> <count> [--after=<ISO>]
  - Print an array of the next N run Dates in ISO format (local time) as JSON.
- matches <expression> <iso-date>
  - Print true or false depending on whether the date matches.
- tostring <expression>
  - Print the canonical cron string for the parsed expression.

Flags:
- --after=<ISO>  : anchor date in ISO 8601 format; defaults to now.
- --json         : force JSON output when applicable.
- --human        : force human-friendly text output.

Default Output Rules:
- parse and next-n print JSON arrays/objects by default.
- next prints a single ISO string by default.
- matches prints plain true or false.
- Errors print a short descriptive message to stderr and exit with a non-zero status code.

## Implementation Notes

- Implement argument parsing by reading process.argv and simple prefix matching for flags; do not add parsing libraries.
- The CLI dispatch lives in the same file as the library and runs only when module is executed directly.
- Keep output stable for tests: use Date.prototype.toISOString for serialized dates, and ensure JSON is deterministic (sorted keys where relevant).

## Acceptance Criteria (testable)

- parse command returns JSON matching parseCron output for a sample expression when invoked with node src/lib/main.js parse "*/15 * * * *".
- next command returns the expected ISO timestamp for a deterministic anchor date when invoked with --after.
- next-n returns exactly N ISO-formatted dates in ascending order in JSON when invoked with node src/lib/main.js next-n "@daily" 3 --after="2025-01-01T00:00:00".
- matches returns true for a matching date and false otherwise.
- Invalid cron expressions cause the CLI to print a descriptive error to stderr and exit with a non-zero code.
- README.md includes a concise CLI usage section demonstrating each command and a sample run.

## Testing

- Add light integration tests that spawn node src/lib/main.js with controlled argv or simulate process.argv and capture stdout/stderr and exit codes. Keep tests minimal and deterministic.
- Unit tests should continue to exercise exported functions directly; CLI tests validate argument parsing, output formatting, and error exit codes.

## Files to update

- src/lib/main.js (add CLI dispatch while preserving exports)
- README.md (add CLI usage examples)
- tests/unit/main.test.js (add or extend CLI integration tests)

## Constraints

- Do not add new dependencies to package.json.
- Keep the CLI surface small and stable.
- Ensure local timezone semantics match library functions.

## Acceptance checklist

- [ ] parse prints parsed JSON matching parseCron output
- [ ] next prints deterministic ISO for a fixed --after
- [ ] next-n prints N ascending ISO dates in JSON
- [ ] matches prints true/false and exits 0
- [ ] CLI exits non-zero and prints descriptive errors for invalid input
- [ ] README documents CLI usage examples
