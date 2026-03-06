# Cron Engine

Compact cron parsing and scheduling engine.

Exports (from src/lib/main.js): parseCron, nextRun, nextRuns, matches, toString

Examples:

import { parseCron, nextRun, nextRuns, matches, toString } from './src/lib/main.js';

const p = parseCron('@daily');
console.log(toString(p)); // "0 0 * * *"

const next = nextRun('0 0 * * *', new Date(2026,2,6,0,0,0));
console.log(next.toString());

Run tests: npm test
