# SCHEDULE_HUMAN_READABLE

# Summary

Provide a utility to convert parsed cron objects into concise, human-friendly English descriptions. Add an exported function describeSchedule(parsed) that produces readable phrases like "Every 15 minutes", "At 09:00 on Monday", or "On the 1st of each month at 00:00". Extend the feature to define a small CLI surface that demonstrates the describer and other core library functions for interactive use and examples.

# Motivation

Users of the library frequently need to display schedules in UI or logs. A single canonical describer reduces duplication and ensures consistent phrasing across docs and examples. A lightweight CLI makes it easy for developers to experiment with expressions, reproduce issues, and run quick checks in CI or local environments.

# Specification

1. API
   - Export describeSchedule(parsed) from src/lib/main.js. It accepts the parsed object returned by parseCron and returns a single-line English summary string.
   - Keep describeSchedule separate from toString; toString must still return a valid cron expression.

2. Output rules (examples)
   - Single-minute step: Every 15 minutes
   - Hourly at minute 0: Hourly at :00
   - Daily at 09:00: Daily at 09:00
   - Weekly patterned: Every Monday at 09:00
   - Monthly day-of-month: On day 1 of each month at 00:00
   - For complex expressions, produce a best-effort compact summary, never more than one sentence.
   - Use ordinal indicators for days (1st, 2nd, 3rd) when describing day-of-month.

3. CLI integration
   - Add a minimal CLI entrypoint in src/lib/main.js that runs when invoked directly (node src/lib/main.js) and supports these subcommands:
     - parse <expression> : prints the parsed JSON object
     - describe <expression> : prints the English description produced by describeSchedule
     - next <expression> [--after=<ISO>] : prints ISO timestamp of next run after optional ISO date (defaults to now)
     - next-runs <expression> <count> [--after=<ISO>] : prints count next run timestamps
     - matches <expression> <ISO-date> : prints true/false whether the date matches
   - CLI must use the library's exported functions and produce stable machine-readable output for parse and next-runs (JSON array) and human output for describe.
   - Keep CLI behaviour minimal and suitable for examples; full argument parsing may use a small inline parser and should not add new dependencies.
   - Document usage in README and examples/ with one or two sample commands.

4. Tests and examples
   - Unit tests mapping several parsed inputs to exact expected strings.
   - Tests for CLI behaviour may run the library functions directly (avoid brittle process.spawn tests). Include one example script in examples/ demonstrating describe and next-runs usage.
   - README demonstrating parseCron + describeSchedule and a short CLI usage snippet.

# Acceptance Criteria

- describeSchedule(parseCron("*/15 * * * *")) returns "Every 15 minutes".
- describeSchedule(parseCron("0 9 * * 1")) returns "Every Monday at 09:00".
- describeSchedule handles @special shortcuts consistently (e.g., @daily -> "Daily at 00:00").
- A minimal CLI entrypoint exists in src/lib/main.js supporting parse, describe, next, next-runs, and matches subcommands as specified and documented in README.
- README contains a short example showing parseCron, describeSchedule, and a CLI invocation example.
- Unit tests cover the describer outputs for at least 6 representative expressions including special strings and complex expressions.