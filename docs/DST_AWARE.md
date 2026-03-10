DST_AWARE semantics

This project implements DST-aware wall-clock semantics for cron schedule matching and next-run generation.

Key decisions

- Wall-clock semantics: cron fields are evaluated against the JavaScript Date object's local wall-clock getters (getFullYear, getMonth, getDate, getHours, getMinutes, getSeconds). This matches how most applications think about schedules: "run at 02:30 local time".
- Repeated hours (fall-back): when a local wall-clock time repeats (clocks move back), both distinct UTC instants that share the same local wall-clock fields are considered valid occurrences. The library does not collapse duplicates.
- Skipped hours (spring-forward): when a local wall-clock time does not exist on a given date, the library does not invent a surrogate time; it advances to the next valid matching date/time.

Deterministic tests

Tests use explicit ISO 8601 timestamps with timezone offsets (for example "2021-11-07T01:30:00-04:00") when asserting exact UTC instants (via .toISOString()). By comparing the returned Date.toISOString() values the tests are deterministic and do not rely on the test host's timezone.

Future work

- Add an options object to allow evaluating cron expressions in an arbitrary IANA timezone (e.g., America/New_York) rather than using the host local timezone.
- Provide utilities to render schedules in a specific timezone for display purposes.
