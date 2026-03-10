# Cron Engine Usage Report

This report contains a quick walkthrough of the cron engine API and sample outputs.

- parseCron(expression) returns a parsed object with fields for seconds, minutes, hours, dayOfMonth, month and dayOfWeek.
- nextRun(expression, after?) returns the next Date after `after` (or now).
- nextRuns(expression, count, after?) returns an array of Dates.
- matches(expression, date) returns a boolean.

See src/lib/cron.js for implementation details.
