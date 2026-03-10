# repository0 - Cron Engine (DST aware)

This repository provides a small cron parsing and scheduling library with explicit DST-aware wall-clock semantics.

Features

- parseCron(expression) — parse standard cron expressions (5 or 6 fields) into a structured object.
- matches(expression, date) — evaluates cron fields against the Date object's local wall-clock getters (getFullYear, getMonth, getDate, getHours, getMinutes, getSeconds).
- nextRun(expression, after?) / nextRuns(expression, count, after?) — compute next occurrences using local wall-clock semantics; repeated local times are returned as distinct instants, and skipped local times are not manufactured.
- toString(parsed) — convert parsed object back to cron string.

DST semantics summary

- Repeated local times (fall-back): both instants are valid and returned.
- Skipped local times (spring-forward): no surrogate; the engine advances to the next valid matching date/time.

Example (US Eastern DST fall-back 2021-11-07)

```js
import { nextRuns } from './src/lib/main.js';

const runs = nextRuns('30 1 * * *', 2, new Date('2021-11-07T00:00:00-04:00'));
console.log(runs.map(r => r.toISOString()));
// [ '2021-11-07T05:30:00.000Z', '2021-11-07T06:30:00.000Z' ]
```

Testing

- Unit tests: npm test
- Behaviour tests (Playwright): npm run test:behaviour (builds the web demo into docs/ and runs Playwright)

Docs

See docs/DST_AWARE.md for rationale and deterministic testing guidance.

Mission

The library focuses on deterministic, testable schedule semantics and is designed so future work can add explicit timezone options.
