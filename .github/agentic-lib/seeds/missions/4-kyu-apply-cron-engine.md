# Mission

A JavaScript library that parses cron expressions, computes next run times, and checks schedule matches.

## Required Capabilities

- Parse a cron expression (standard 5-field, or 6-field with seconds) into a structured object. Support ranges (`1-5`), lists (`1,3,5`), steps (`*/15`), and wildcards (`*`).
- Compute the next run time after a given date (default: now).
- Compute the next N run times after a given date.
- Check whether a specific date matches a cron expression.
- Convert a parsed cron object back to a cron string.
- Support shortcuts: `@yearly` (`0 0 1 1 *`), `@monthly` (`0 0 1 * *`), `@weekly` (`0 0 * * 0`), `@daily` (`0 0 * * *`), `@hourly` (`0 * * * *`).

## Requirements

- Handle edge cases: month-end boundaries (e.g. `0 0 31 * *` fires only in months with 31 days — skip months with fewer days, do not fire on the last day as a fallback), leap years (Feb 29 fires only in leap years).
- All times are UTC. Timezone support is out of scope.
- Validate expressions: throw on invalid syntax with a descriptive error message.
- No external runtime dependencies.
- Export all public API as named exports from `src/lib/main.js`.
- Comprehensive unit tests covering field combinations, special strings, edge cases, and invalid input.
- README with usage examples.

## Acceptance Criteria

- [ ] Parsing `"*/15 * * * *"` returns a valid structured object
- [ ] Next run for `"0 9 * * 1"` returns the next Monday at 09:00 UTC
- [ ] Matching `"0 0 25 12 *"` against `2025-12-25T00:00:00Z` returns `true`
- [ ] Next 7 runs for `"@daily"` returns 7 consecutive daily dates
- [ ] Next 3 runs for `"0 0 31 * *"` starting from `2025-01-01` returns dates in Jan, Mar, May (skips months without 31 days)
- [ ] Invalid expressions throw descriptive errors
- [ ] All unit tests pass
- [ ] README documents usage with examples
