#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Simple CLI wrapper around the log validator to check mission logs.
import fs from 'fs';
import { findMissionContradictions } from './log-validator.js';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node src/lib/validate-mission-logs.js <logfile>');
  process.exit(2);
}

try {
  const text = fs.readFileSync(file, 'utf8');
  const contradictions = findMissionContradictions(text);
  if (!contradictions || contradictions.length === 0) {
    console.log('No contradictions found');
    process.exit(0);
  }
  console.error('Contradictions found:');
  console.error(JSON.stringify(contradictions, null, 2));
  process.exit(1);
} catch (e) {
  console.error('Error reading or validating log:', e && e.message ? e.message : String(e));
  process.exit(2);
}
