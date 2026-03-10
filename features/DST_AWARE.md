# DST_AWARE

# Summary

Add DST_AWARE behavior to the cron library so nextRun, nextRuns and matches operate with explicit, testable semantics across daylight saving time transitions. The feature defines wall-clock semantics for local timezones, ensuring occurrences are consistent, deterministic, and testable when clocks move forward or backward.

# Motivation

The mission requires correct handling of DST transitions; without explicit semantics the library can return skipped or duplicated run times when clocks change. This feature makes the desired behaviour explicit, adds tests, and documents API-level expectations so implementers can produce reliable results across timezones.

# Specification

1. Wall-clock interpretation
   - All scheduling functions interpret cron fields against the user's local wall-clock time rather than raw UTC unless an explicit timezone option is provided in a future feature. That means hour, minute, day, month, and weekday matching is evaluated from the local Date fields.

2. Repeated hour (fall back)
   - When a local time repeats because clocks are set back (for example 01:30 occurs twice), matches(date) returns true for both distinct Date instants whose local wall-clock fields match the cron expression. nextRuns should include both occurrences as separate Date objects with different underlying timestamps when they fall after the after parameter.

3. Skipped hour (spring forward)
   - When a local wall-clock time does not exist because clocks jump forward (for example 02:30 is skipped), the library considers that specific local occurrence as not present for that date. nextRuns should not invent an occurrence at a different wall-clock time for that date. Instead the algorithm should advance to the next date/time that matches the expression. This policy avoids silently grouping or shifting runs that would change the intended wall-clock schedule.

4. Monotonic results
   - nextRuns must return Date objects in strictly increasing chronological order (by timestamp). When a repeated local time produces two distinct timestamps they must appear in chronological order.

5. Determinism and tests
   - All behaviour must be deterministic with respect to the JavaScript Date implementation in Node.js. Tests will assert exact timestamps for specific well-known DST transitions in commonly used timezones (for Node environment tests local timezone can be set or tests can construct Date objects with explicit ISO strings that include offset).

# API changes

- No signature changes to parseCron, nextRun, nextRuns, matches, or toString are required by this feature. This feature adds behavioural guarantees and tests only.

- Optional future extension: allow an options object with timezone to explicitly choose IANA timezone semantics; out of scope for this ticket but the tests should be written so future timezone option integration is straightforward.

# Implementation notes

- Implementation should evaluate cron fields against local Date getters (getFullYear, getMonth, getDate, getHours, getMinutes, getSeconds) to establish wall-clock matches.

- For nextRuns and nextRun the generator should advance by one minute or the smallest granularity required and evaluate matches until the next occurrence is found. Care must be taken to avoid infinite loops on invalid cron expressions; expression validation should remain strict.

- Tests that depend on specific DST transitions should use fixed ISO timestamps with explicit offsets, and where necessary use Date constructors that include timezone offsets to make expected timestamps unambiguous.

# Tests

- Unit tests must cover:
  - A schedule that runs at a time that is skipped during spring-forward: assert that no occurrence is returned on that local date and that the sequence continues at the next valid matching local date.
  - A schedule that runs at a time that repeats during fall-back: assert that both distinct timestamps are included and that matches returns true for both instants.
  - nextRuns across a DST boundary returns the requested number of occurrences and timestamps are strictly increasing.
  - matches returns true only when local wall-clock fields match the parsed cron expression.
  - Validation remains unchanged: invalid cron expressions still throw descriptive errors.

# Acceptance Criteria

- parseCron("*/15 * * * *") still returns a valid parsed object as before.
- nextRun for a weekly schedule returns the next correct wall-clock occurrence around DST boundaries rather than a shifted or omitted time.
- matches for a scheduled local time that repeats during fall-back returns true for both underlying timestamps representing the repeated wall-clock time.
- nextRuns across a spring-forward boundary returns the requested count of occurrences without producing duplicate timestamps and without inventing shifted wall-clock occurrences for the skipped local time.
- nextRuns returns Date objects in strictly increasing timestamp order.
- Unit tests added to tests/unit/ cover the above cases with precise expected timestamps around a documented DST transition.
- README updated to document DST semantics for scheduling behaviour.

# Notes

This feature documents and tests behaviour rather than changing public signatures, making it achievable within a single repository and a single source file update. Tests and README changes are part of the feature scope to make the behaviour explicit for users and maintainers.
