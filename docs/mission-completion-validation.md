# Mission completion validation

This document describes the mission-completion validation helpers added to the library.

Files
- `src/lib/log-validator.js` — exports `isMissionComplete` and `findMissionContradictions`.
- `src/lib/validate-mission-logs.js` — CLI wrapper that reads a logfile and exits non-zero when contradictions are found.

Decision rule
- `isMissionComplete({passed, total})` returns `true` iff:
  - `passed` and `total` are integers
  - `total > 0`
  - `0 <= passed <= total`
  - and `passed === total`
- It throws an Error when counters are invalid (non-integer, NaN, negative, or passed &gt; total).

Log validation
- `findMissionContradictions(logText)` scans the provided plain-text logs for lines matching
  `Acceptance criteria | X/Y` and `Mission complete declared | YES|NO`, pairs nearby entries,
  and returns an array of contradictions if any mission declarations disagree with acceptance counters.

CLI usage

Run the included CLI script against a log file:

```bash
node src/lib/validate-mission-logs.js path/to/agent-log-2026-03-18T11-55-07-132Z-003.md
```

Exit codes
- `0` — no contradictions found
- `1` — contradictions found (non-empty report printed to stderr)
- `2` — usage error or failure reading file

CI integration
- Add a CI step that runs the CLI against produced agent logs and fails the job when contradictions are detected.

Remediation
- If contradictions are reported, inspect the reported `acceptance` counters and the nearby `Mission complete declared` lines to determine which producer emitted stale or incorrect data. The validator helps find the inconsistency; the next step is to enforce a single source of truth for counters.
