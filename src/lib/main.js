#!/usr/bin/env node
// src/lib/main.js
import { fileURLToPath } from 'url';
export { fizzBuzzSingle, fizzBuzz } from './fizzbuzz.js';

export function main(args = null) {
  const used = args === null ? process.argv.slice(2) : args;
  console.log(`Run with: ${JSON.stringify(used)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
