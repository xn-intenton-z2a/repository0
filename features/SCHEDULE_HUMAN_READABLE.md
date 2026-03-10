# SCHEDULE_HUMAN_READABLE

# Summary

Provide a utility to convert parsed cron objects into concise, human-friendly English descriptions. Add an exported function describeSchedule(parsed) that produces readable phrases like Every 15 minutes, At 09:00 on Monday, or On the 1st of each month at 00:00. Extend the feature to define a small CLI surface that demonstrates the describer and other core library functions for interactive use and examples. Add a small interactive web demo page specification so the website can showcase the describer and next-runs output with a timezone toggle.

# Motivation

Users of the library frequently need to display schedules in UI or logs. A single canonical describer reduces duplication and ensures consistent phrasing across docs and examples. A lightweight CLI and a tiny interactive web demo make it easy for developers and product teams to experiment with expressions, reproduce issues, and embed a stable example into documentation and the website.

# Specification

1. API
   - Export describeSchedule(parsed) from src/lib/main.js. It accepts the parsed object returned by parseCron and returns a single-line English summary string.
   - Keep describeSchedule separate from toString; toString must still return a valid cron expression.
   - The describer must be deterministic and pure: given the same parsed object it returns the same string.

2. Output rules (examples)
   - Single-minute step: Every 15 minutes
   - Hourly at minute 0: Hourly at :00
   - Daily at 09:00: Daily at 09:00
   - Weekly patterned: Every Monday at 09:00
   - Monthly day-of-month: On day 1 of each month at 00:00
   - For complex expressions, produce a best-effort compact summary, never more than one sentence.
   - Use ordinal indicators for days (1st, 2nd, 3rd) when describing day-of-month.
   - Prefer concise phrasing and avoid listing large explicit value sets; fall back to a phrase like Every N minutes or On multiple weekdays at HH:MM.

3. CLI integration
   - Add a minimal CLI entrypoint in src/lib/main.js that runs when invoked directly (node src/lib/main.js) and supports these subcommands:
     - parse <expression> : prints the parsed JSON object to stdout as JSON
     - describe <expression> : prints the English description produced by describeSchedule to stdout
     - next <expression> [--after=<ISO>] : prints ISO timestamp of next run after optional ISO date (defaults to now)
     - next-runs <expression> <count> [--after=<ISO>] : prints a JSON array of ISO timestamps
     - matches <expression> <ISO-date> : prints true or false
   - CLI must use the library's exported functions and produce stable machine-readable output for parse and next-runs and human output for describe.
   - Keep CLI behaviour minimal and suitable for examples; full argument parsing may use a small inline parser and must not add new dependencies.
   - Document usage in README and add one example script in examples/ showing describe and next-runs output.

4. Interactive web demo
   - Add a specification for a single demo page in src/web/demo.html that uses the existing web assets and library to demonstrate:
     - an input for a cron expression
     - live parsed output shown as JSON
     - the describeSchedule output as a prominent one-line summary
     - next-runs preview for a configurable count
     - a timezone selector that toggles between process-local and UTC (or a simple fixed-offset preview) to demonstrate timezone-aware phrasing in the UI
   - The demo must use only the library API; it must not introduce new JS dependencies. Keep markup and script minimal and suitable for copying into docs.

5. Tests and examples
   - Unit tests mapping several parsed inputs to exact expected strings, covering at least:
     - step minute expressions, hourly, daily, weekly, monthly, special strings, and a complex expression.
   - CLI behaviours are tested by calling library functions directly from unit tests; avoid spawning processes in unit tests.
   - Add a small example file in examples/ that demonstrates invoking the library functions and printing results; the example should be runnable via node examples/describe-example.js and referenced by README.
   - Add a brief demo page in src/web/ that imports the library and exercises describeSchedule and next-runs.

# Acceptance Criteria

- describeSchedule(parseCron("*/15 * * * *")) returns Every 15 minutes.
- describeSchedule(parseCron("0 9 * * 1")) returns Every Monday at 09:00.
- describeSchedule handles special shortcuts consistently (for example @daily -> Daily at 00:00).
- A minimal CLI entrypoint exists in src/lib/main.js supporting parse, describe, next, next-runs, and matches subcommands; parse and next-runs produce valid JSON on stdout.
- examples/ contains a runnable example script that demonstrates describeSchedule and next-runs and is referenced from README.
- The repository contains a simple interactive web demo specification in src/web/demo.html that shows parsed JSON, describeSchedule output, next-runs preview, and a timezone toggle for demonstration purposes.
- Unit tests cover at least 6 representative expressions and assert exact describer outputs.
- No new runtime dependencies are added and the CLI and demo use only the exported library API.