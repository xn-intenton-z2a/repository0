# SCHEDULE_HUMAN_READABLE

# Summary

Provide a utility to convert parsed cron objects into concise, human-friendly English descriptions. Add an exported function describeSchedule(parsed) that produces readable phrases like "Every 15 minutes", "At 09:00 on Monday", or "On the 1st of each month at 00:00".

# Motivation

Users of the library frequently need to display schedules in UI or logs. A single canonical describer reduces duplication and ensures consistent phrasing across docs and examples.

# Specification

1. API
   - Export describeSchedule(parsed) from src/lib/main.js. It accepts the parsed object returned by parseCron and returns a string.
   - Keep describeSchedule separate from toString; toString must still return a valid cron expression.

2. Output rules (examples)
   - Single-minute step: "Every 15 minutes"
   - Hourly at minute 0: "Hourly at :00"
   - Daily at 09:00: "Daily at 09:00"
   - Weekly patterned: "Every Monday at 09:00"
   - Monthly day-of-month: "On day 1 of each month at 00:00"
   - For complex expressions, produce a best-effort compact summary, never more than one sentence.

3. Internationalisation
   - DescribeSchedule will return English strings only. Future work may add localization.

4. Tests and examples
   - Unit tests mapping several parsed inputs to exact expected strings.
   - Example usage added to README demonstrating parseCron + describeSchedule.

# Acceptance Criteria

- describeSchedule(parseCron("*/15 * * * *")) returns "Every 15 minutes".
- describeSchedule(parseCron("0 9 * * 1")) returns "Every Monday at 09:00".
- describeSchedule handles @special shortcuts consistently (e.g., @daily -> "Daily at 00:00").
- README contains a short example showing parseCron and describeSchedule together.