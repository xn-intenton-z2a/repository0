# CRON_ENGINE

## Summary

Add a compact, well-specified cron parsing and scheduling engine implemented in a single source file, suitable for immediate use as a library and as a CLI entrypoint. The engine exposes the core functions described in the mission: parseCron, nextRun, nextRuns, matches, and toString, exported as named exports from src/lib/main.js.

## Goals

- Provide reliable parsing for standard cron expressions (5 fields) and optional seconds field (6 fields).
- Compute next run times and sequences of run times relative to an anchor date.
- Correctly match arbitrary Date objects against cron schedules.
- Handle real-world edge cases: DST transitions, leap years, month-end boundaries, and invalid dates in month fields.
- Validate syntax and provide descriptive errors.
- Require no external dependencies, keeping implementation self-contained in src/lib/main.js.

## Scope

This feature must be implementable entirely inside src/lib/main.js. Tests will live in tests/unit/main.test.js and the README will include short usage examples for the exported API. The implementation should cover typical cron semantics (ranges, lists, steps, and wildcards) and the special strings @yearly, @monthly, @weekly, @daily, and @hourly.

Out of scope: extended crons with named months/days, non-standard macros beyond the listed special strings, or integration with system cron daemons.

## API

- parseCron(expression)
  - Parse a cron string into a structured object with fields for seconds (optional), minutes, hours, dayOfMonth, month, dayOfWeek and normalized internal sets of allowed values.
  - Throw a descriptive Error for invalid syntax or out-of-range values.

- nextRun(expression, after?)
  - Return the Date of the next scheduled run strictly after the optional after date or now if omitted.
  - If expression is a special string, resolve it to the equivalent cron first.
  - Handle DST so runs are not silently skipped or duplicated.

- nextRuns(expression, count, after?)
  - Return an array of the next count Date objects in ascending order.
  - Validate count is a positive integer and reject otherwise.

- matches(expression, date)
  - Return true if the given date matches the cron expression when considering local timezone semantics.

- toString(parsed)
  - Convert the parsed representation back into a canonical cron string; preserve whether seconds were present.

All functions to be exported as named exports from src/lib/main.js.

## Validation and Errors

- Invalid syntax must throw an Error with a short title and explain which field failed and why (e.g., "Invalid minute field: expected 0-59, got 99").
- Unsupported features should produce an explicit message listing what is unsupported.

## Edge Cases

- DST transitions: use a strategy that compares Date components in local time and iterates by candidate fields rather than adding fixed UTC offsets so that runs on DST boundary days are computed deterministically without duplication or omission.
- Month-end and invalid dates: when a cron specifies an impossible date (for example day 30 in February), that date is skipped; nextRun must find the next valid future candidate.
- Leap years: Feb 29 must be matched only on leap years when explicitly specified.

## Acceptance Criteria

- parseCron("*/15 * * * *") returns a parsed object where minute field contains the sequence 0,15,30,45 and other fields are wildcards or equivalent sets.
- nextRun("0 9 * * 1") returns the next Monday at 09:00 local time relative to the after argument or now.
- matches("0 0 25 12 *", new Date("2025-12-25")) returns true.
- nextRuns("@daily", 7) returns 7 consecutive daily dates starting the day after the anchor date when using nextRuns with default after.
- DST transitions do not cause duplicated or missing run times across the transition when comparing adjacent runs returned by nextRuns.
- Invalid expressions throw descriptive errors indicating the failing field and reason.
- All unit tests in tests/unit/main.test.js pass.

## Testing

- Provide unit tests that exercise parsing, matching, nextRun and nextRuns:
  - field combinations (lists, ranges, steps, wildcards), special strings, invalid inputs, month-end and leap year cases, and DST boundary days.
  - deterministic tests using fixed UTC-annotated dates and local timezone expectations where necessary.

## Implementation notes

- Keep the implementation self-contained and synchronous; avoid adding heavy dependencies.
- Ensure exports are named and match the API section exactly.
- Keep code readable with clear helper functions for field parsing and candidate iteration.
- Update README with short usage examples for the five exported functions.

## Files to update

- src/lib/main.js implement the engine and named exports.
- tests/unit/main.test.js add tests that assert the acceptance criteria.
- README.md add a short usage example section demonstrating parseCron, nextRun, nextRuns, matches, and toString.

