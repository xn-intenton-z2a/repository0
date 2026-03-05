#!/usr/bin/env node
// Lightweight test runner that executes the exported runTests function from test modules
import { runTests } from './main.test.js';

async function main() {
  try {
    await runTests();
    console.log('\u2705 All tests passed');
    process.exit(0);
  } catch (err) {
    console.error('\u274C Tests failed');
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

main();
