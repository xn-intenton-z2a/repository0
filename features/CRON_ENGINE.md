# CRON_ENGINE

## Summary

A compact, well-specified cron parsing and scheduling engine implemented entirely in src/lib/main.js and exported as named functions parseCron, nextRun, nextRuns, matches, and toString. The engine supports standard 5-field cron expressions and optional 6-field expressions with seconds, plus the special strings @yearly, @monthly, @weekly, @daily, and @hourly.

## Goals

- Provide robust parsing for ranges, lists, steps, and wildcards with clear normalized internal representations.
- Compute the next run time and an ordered sequence of upcoming run times relative to an anchor date using local-time semantics.
- Correctly evaluate whether arbitrary Date objects match a schedule.
- Handle real-world edge cases: DST transitions, leap years, month-end boundaries, and invalid dates.
- Emit descriptive validation errors for invalid cron syntax or unsupported features.
- Keep implementation self-contained and synchronous with no new runtime dependencies.

## Scope

All implementation stays inside src/lib/main.js and tests in tests/unit/main.test.js. The library focuses on core cron semantics and does not implement named months/days or non-standard macros beyond the listed special strings.

## API (exported named functions)

- parseCron(expression)
  - Input: cron string (5-field or 6-field) or special string.
  - Output: parsed object with explicit properties: secondsPresent (boolean), seconds, minutes, hours, dayOfMonth, month, dayOfWeek, and helper methods or normalized sets for matching.
  - Errors: throws Error with a descriptive message on invalid syntax or out-of-range values.

- nextRun(expression, after?)
  - Input: cron string or parsed object, optional Date anchor (defaults to now).
  - Output: Date representing the next run strictly after the anchor in local time.
  - Behavior: resolves special strings, skips impossible month/day combinations (e.g., Feb 30), and correctly accounts for DST so runs are not silently duplicated or omitted.

- nextRuns(expression, count, after?)
  - Input: cron string or parsed object, positive integer count, optional Date anchor.
  - Output: array of count Date objects in ascending order.
  - Validation: throws for non-positive or non-integer count.

- matches(expression, date)
  - Input: cron string or parsed object and a Date.
  - Output: boolean indicating whether the date matches the schedule using local time component comparisons.

- toString(parsed)
  - Input: parsed object returned by parseCron.
  - Output: canonical cron string that preserves whether seconds were present.

## Validation and Errors

- Errors must be actionable and field-specific, e.g., "Invalid minute field: expected 0-59, got 99" or "Invalid step in hour field: step must be >=1".
- Unsupported syntax or features must clearly list what is unsupported.

## Edge cases and deterministic rules

- DST handling: compute candidates by iterating calendar fields (year, month, day, hour, minute, second) and comparing local date components rather than adding or subtracting fixed millisecond offsets. This prevents silent duplication or skipping across DST transitions.
- Invalid dates (month/day combos): skip impossible dates and search forward for the next valid candidate.
- Leap years: February 29 only matches when the year is leap and is treated like any other explicit day value.
- All matching/next-run operations use the system local timezone.

## Acceptance Criteria (testable)

- parseCron("*/15 * * * *") returns a parsed object where minutes resolve to [0,15,30,45] and secondsPresent is false.
- nextRun("0 9 * * 1", new Date("2025-01-01T00:00:00")) returns the next Monday at 09:00 local time after the anchor.
- matches("0 0 25 12 *", new Date("2025-12-25T00:00:00")) returns true (local time).
- nextRuns("@daily", 7, new Date("2025-06-01T00:00:00")) returns seven consecutive dates at local midnight starting the next day.
- nextRuns("0 2 29 2 *", 3, new Date("2023-01-01T00:00:00")) returns the next occurrences that include Feb 29 on leap years only (e.g., 2024-02-29, etc.).
- For a DST spring-forward boundary where a local hour is skipped, adjacent nextRuns results do not duplicate or omit scheduled runs when compared across the transition.
- Invalid expressions throw descriptive errors identifying the failing field and reason.

## Testing

- Add unit tests in tests/unit/main.test.js covering:
  - Parsing: ranges, lists, steps, wildcards, with and without seconds.
  - Matching: exact-time matches, day-of-month edge cases, leap year checks.
  - nextRun/nextRuns: sequential correctness, ordering, and DST boundary behavior (use deterministic anchors).
  - toString: round-trip from parseCron to toString and back.
  - Validation: invalid fields, invalid counts, and unsupported syntax.

## Implementation notes

- Keep code modular inside src/lib/main.js with small helpers: tokenize field, expand ranges/lists/steps, candidate generator, and local-date comparator.
- Ensure all named exports are present and documented in README.md.
- Avoid new dependencies; use Date and Intl APIs available in Node 24+.

## Files to update

- src/lib/main.js (implementation and CLI dispatch)  
- tests/unit/main.test.js (unit tests)  
- README.md (API usage examples)  

## Acceptance checklist

- [ ] parseCron supports 5- and 6-field cron forms and special strings
- [ ] nextRun and nextRuns produce correct local-time Dates for typical and edge cases
- [ ] matches validates dates correctly including leap-year and month-end rules
- [ ] DST transitions handled deterministically without duplication or omission
- [ ] Errors are descriptive and field-specific
