#!/usr/bin/env node
// src/lib/main.js
// FizzBuzz library matching MISSION.md

export const name = 'repo';
export const version = '0.1.0';
export const description = 'FizzBuzz demo library';

function assertNumberInteger(n) {
  if (typeof n !== 'number' || Number.isNaN(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
}

function assertNonNegative(n) {
  if (n < 0) throw new RangeError('n must not be negative');
}

// fizzBuzzSingle: returns Fizz/Buzz/FizzBuzz or the number as string
export function fizzBuzzSingle(n) {
  assertNumberInteger(n);
  if (n === 0) throw new RangeError('n must be positive and non-zero');
  assertNonNegative(n);
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

// fizzBuzz: returns array for 1..n; n === 0 -> []
export function fizzBuzz(n) {
  assertNumberInteger(n);
  assertNonNegative(n);
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) {
    out.push(fizzBuzzSingle(i));
  }
  return out;
}

export function getIdentity() {
  return { name, version, description };
}

// Lightweight CLI supporting commands: fizz, fizz-single and options --json, --help
if (typeof process !== 'undefined' && process?.versions?.node) {
  try {
    const { fileURLToPath } = await import('url');
    if (process.argv[1] === fileURLToPath(import.meta.url)) {
      const argv = process.argv.slice(2);
      const usage = `Usage: node src/lib/main.js <command> <n> [--json]\n\nCommands:\n  fizz         produce array 1..n (use --json for JSON)\n  fizz-single  produce single value for n\n  --help       show this message`;

      if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
        console.log(usage);
        process.exit(0);
      }

      const json = argv.includes('--json');
      const cmd = argv[0];
      const nArg = argv[1];
      const n = nArg !== undefined ? Number(nArg) : NaN;

      try {
        let out;
        if (cmd === 'fizz') {
          out = fizzBuzz(n);
          if (json) console.log(JSON.stringify(out));
          else console.log(out.join('\n'));
          process.exit(0);
        } else if (cmd === 'fizz-single') {
          out = fizzBuzzSingle(n);
          if (json) console.log(JSON.stringify(out));
          else console.log(out);
          process.exit(0);
        } else {
          console.error('Unknown command');
          console.log(usage);
          process.exit(1);
        }
      } catch (err) {
        // Map validation errors to specific exit codes per requirements
        if (err instanceof TypeError) process.exitCode = 2;
        else if (err instanceof RangeError) process.exitCode = 3;
        else process.exitCode = 1;
        console.error(err && err.message ? err.message : String(err));
        // ensure process exits with code
        process.exit(process.exitCode);
      }
    }
  } catch (e) {
    // ignore
  }
}
