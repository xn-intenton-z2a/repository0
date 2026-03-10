# TIMEZONE_SUPPORT

# Summary

Add optional timezone support to the cron library so parseCron, nextRun, nextRuns and matches can be evaluated against a specified IANA timezone string (for example Europe/London). This feature complements DST_AWARE by allowing callers to request deterministic schedule semantics anchored to a chosen timezone rather than the process-local wall-clock.

# Motivation

Applications often need schedules evaluated in a specific IANA timezone (server in UTC, users in America/New_York). Providing a timezone option makes behaviour explicit, avoids reliance on process-local timezone, and enables correct schedule computation for remote users.

# Specification

1. API surface
   - Add optional parameter options to nextRun, nextRuns and matches with signature options?: { timezone?: string }
   - parseCron and toString keep current signatures but must remain compatible with the new behaviour.
   - When options.timezone is provided, library must evaluate scheduling fields against that timezone's local wall-clock semantics (respecting DST rules for the named zone). When omitted behaviour falls back to DST_AWARE semantics (process-local wall clock).

2. Semantics
   - Timezone strings must be valid IANA zone names. Invalid names produce a clear validation error.
   - All DST semantics from DST_AWARE apply inside the chosen timezone: repeated times during fall-back produce distinct timestamps, skipped times are omitted.
   - nextRuns returns Date objects in UTC (JavaScript Date) representing the exact instants when the schedule fires in the target timezone.

3. Implementation notes
   - Implementation may use built-in Intl APIs (Intl.DateTimeFormat with timeZone) or a dependency if justified. Keep changes local to src/lib/main.js and tests.
   - Unit tests should use explicit ISO strings with offsets and/or construct Dates from known instants to make expected timestamps unambiguous.

# Tests

- Unit tests for nextRun/nextRuns/matches with options.timezone set to a well-known zone (Europe/London and America/New_York) covering a DST spring-forward and fall-back transition.
- Validation tests for invalid timezone name raising a descriptive error.
- Tests asserting that behaviour with options.timezone omitted remains unchanged (process-local wall-clock behaviour).

# Acceptance Criteria

- nextRun supports an options parameter with timezone and returns the next occurrence evaluated in that timezone.
- matches accepts options.timezone and correctly matches instants that correspond to the same local wall-clock fields in the target timezone.
- nextRuns(@daily, 7, { timezone: "America/New_York" }) returns 7 consecutive daily instants that match midnight in America/New_York, even across DST.
- Invalid timezone strings throw descriptive errors and are covered by unit tests.
- README updated with a short example showing usage of the timezone option.