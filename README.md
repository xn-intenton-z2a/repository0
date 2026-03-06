# Cron Engine

Compact, dependency-free cron parsing and scheduling engine.

Exports: parseCron, nextRun, nextRuns, matches, toString

Usage example:

import { parseCron, nextRun } from './src/lib/main.js';
const p = parseCron('@daily');
const next = nextRun(p, new Date());
console.log(next.toISOString());
