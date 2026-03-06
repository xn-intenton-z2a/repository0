Cron engine usage examples

- parseCron('@daily') => parsed object
- nextRun('0 9 * * 1', new Date()) => next Monday 09:00 local
- nextRuns('@daily', 7) => array of 7 upcoming dates

Deterministic outputs are produced using Date.toISOString() in tests and examples.
