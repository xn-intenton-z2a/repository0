#!/usr/bin/env node
// src/lib/main.js

// A small, self-contained fizz-buzz library with CLI support.
// Exports: generate(n) and format(n)

export const name = 'repo';
export const version = '0.1.0';
export const description = 'FizzBuzz demo library';

function validatePositiveInteger(n) {
  if (typeof n !== 'number' || Number.isNaN(n) || !Number.isInteger(n) || n < 1) {
    throw new TypeError('n must be a positive integer');
  }
}

export function generate(n) {
  validatePositiveInteger(n);
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push('fizzbuzz');
    else if (i % 3 === 0) out.push('fizz');
    else if (i % 5 === 0) out.push('buzz');
    else out.push(i);
  }
  return out;
}

export function format(n) {
  return generate(n).map((v) => String(v)).join('\n');
}

export function getIdentity() {
  return { name, version, description };
}

// Minimal CLI: when invoked directly print formatted fizz-buzz for provided n (default 100)
let _isNode = typeof process !== 'undefined' && process?.versions?.node;
if (_isNode) {
  try {
    // Use file detection to allow `node src/lib/main.js` to print
    // Avoid importing node-only modules at top-level in case of other environments.
    const { fileURLToPath } = await import('url');
    if (process.argv[1] === fileURLToPath(import.meta.url)) {
      const arg = process.argv[2] || '100';
      const n = Number(arg);
      try {
        console.log(format(n));
        process.exit(0);
      } catch (err) {
        console.error(err && err.message ? err.message : String(err));
        process.exit(1);
      }
    }
  } catch (e) {
    // If fileURLToPath or import fails, skip CLI behaviour silently.
  }
}
