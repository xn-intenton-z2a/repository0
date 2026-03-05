# Mission

A JavaScript library that parses cron expressions, computes next run times, and checks schedule matches.

## Core Functions

- `parseCron(expression)` — parse a cron expression (standard 5-field, or 6-field with seconds) into a structured object. Supports ranges (`1-5`), lists (`1,3,5`), steps (`*/15`), and wildcards (`*`).
- `nextRun(expression, after?)` — compute the next run time after the given date (default: now). Returns a `Date`.
- `nextRuns(expression, count, after?)` — compute the next N run times. Returns an array of `Date`.
- `matches(expression, date)` — check if a date matches a cron expression. Returns boolean.
- `toString(parsed)` — convert a parsed cron object back to a cron string.

## Special Strings

Support these shortcuts: `@yearly` (`0 0 1 1 *`), `@monthly` (`0 0 1 * *`), `@weekly` (`0 0 * * 0`), `@daily` (`0 0 * * *`), `@hourly` (`0 * * * *`).

## Requirements

- Handle edge cases: DST transitions, month-end boundaries (e.g. "30th of February"), leap years.
- Validate expressions: throw on invalid syntax with a descriptive error message.
- No external dependencies required (but allowed if beneficial).
- Export all functions as named exports from `src/lib/main.js`.
- Comprehensive unit tests covering field combinations, special strings, edge cases, and invalid input.
- README with usage examples.

## Acceptance Criteria

- [ ] `parseCron("*/15 * * * *")` returns a valid parsed object
- [ ] `nextRun("0 9 * * 1")` returns the next Monday at 09:00
- [ ] `matches("0 0 25 12 *", new Date("2025-12-25"))` returns `true`
- [ ] `nextRuns("@daily", 7)` returns 7 consecutive daily dates
- [ ] DST transitions handled correctly (no skipped or duplicated runs)
- [ ] Invalid expressions throw descriptive errors
- [ ] All unit tests pass
- [ ] README documents usage with examples
