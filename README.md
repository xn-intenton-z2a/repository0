# Cron Engine

This repository implements a small cron engine library that can parse cron expressions, compute next run times, and check schedule matches.

Usage examples

```js
import { parseCron, nextRun, nextRuns, matches } from './src/lib/cron.js';

const parsed = parseCron('*/15 * * * *');
console.log(parsed);

const next = nextRun('0 9 * * 1', new Date());
console.log('Next Monday 09:00:', next);

console.log(matches('0 0 25 12 *', new Date(2025,11,25)));
```

Website demo

Run `npm run build:web` then `npm run start` to view the demo at http://localhost:3000 (served by serve).

Tests

- Unit tests: `npm test`
- Behaviour tests: `npm run test:behaviour`
