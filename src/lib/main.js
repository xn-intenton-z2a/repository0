// SPDX-License-Identifier: MIT
// CLI and Node-facing exports for the library.
import { fileURLToPath } from 'url';
import pkg from '../../package.json' assert { type: 'json' };
import { fizzBuzz, fizzBuzzSingle, fizzBuzzFormatted, fizzBuzzSingleFormatted } from './fizz.js';

export const name = pkg.name || 'repo';
export const version = pkg.version || '0.0.0';
export const description = pkg.description || '';

export function getIdentity() {
  return { name, version, description };
}

/**
 * main - CLI handler. Accepts args array (strings).
 * - No args: prints identity line
 * - --version: prints version
 * - --identity: prints JSON identity
 * - single integer arg: prints fizzbuzz lines
 * - invalid arg: prints error to stderr and returns non-zero
 */
export function main(args) {
  args = Array.isArray(args) ? args : undefined;
  if (!args) {
    console.log(`${name}@${version}`);
    return 0;
  }
  if (args.includes('--version')) {
    console.log(version);
    return 0;
  }
  if (args.includes('--identity')) {
    console.log(JSON.stringify(getIdentity(), null, 2));
    return 0;
  }

  if (args.length === 0) {
    console.log(`Usage: node src/lib/main.js <n>`);
    return 0;
  }

  // if single positional arg
  if (args.length === 1) {
    const raw = args[0];
    const num = Number(raw);
    if (!Number.isFinite(num) || !Number.isInteger(num)) {
      console.error('Error: n must be an integer');
      return 2;
    }
    try {
      const arr = fizzBuzz(num);
      for (const line of arr) console.log(line);
      return 0;
    } catch (err) {
      console.error('Error:', err.message || String(err));
      return 3;
    }
  }

  console.log(`Usage: node src/lib/main.js <n>`);
  return 0;
}

// Re-export fizz functions for consumers that import main.js
export { fizzBuzz as fizzBuzz, fizzBuzzSingle as fizzBuzzSingle, fizzBuzzFormatted as fizzBuzzFormatted, fizzBuzzSingleFormatted as fizzBuzzSingleFormatted };

// If executed directly, run CLI and exit accordingly
if (typeof process !== 'undefined' && process.argv && process.argv[1] === fileURLToPath(import.meta.url)) {
  const code = main(process.argv.slice(2));
  // Only call process.exit when running as CLI
  if (typeof code === 'number') process.exit(code);
}
