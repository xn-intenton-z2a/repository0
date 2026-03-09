#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

export const name = pkg.name || 'repository0';
export const version = pkg.version || '0.0.0';
export const description = pkg.description || '';

export function getIdentity(){
  return { name, version, description };
}

function assertInteger(n){
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
}

function assertNonNegative(n){
  if (n < 0) throw new RangeError('n must be a non-negative integer');
}

export function fizzBuzzSingle(i){
  assertInteger(i);
  assertNonNegative(i);
  if (i === 0) return '0'; // though API expects only n>=1 for single, keep logical mapping
  const by3 = i % 3 === 0;
  const by5 = i % 5 === 0;
  if (by3 && by5) return 'FizzBuzz';
  if (by3) return 'Fizz';
  if (by5) return 'Buzz';
  return String(i);
}

export function fizzBuzz(n){
  // per spec: n === 0 -> [] , integer >=1 returns array length n
  assertInteger(n);
  if (n === 0) return [];
  assertNonNegative(n);
  const out = [];
  for (let i = 1; i <= n; i++) out.push(fizzBuzzSingle(i));
  return out;
}

// CLI entrypoint
export function main(argv){
  // argv is array of args (strings) after script
  if (!argv || argv.length === 0){
    console.log(`${name}@${version} - FizzBuzz demo`);
    console.log('Usage: node src/lib/main.js <number>');
    return 1;
  }
  if (argv.includes('--version')){
    console.log(version);
    return 0;
  }
  const arg = argv[0];
  const n = Number(arg);
  if (arg === undefined || arg === '' || Number.isNaN(n)){
    console.error('Invalid number');
    console.log('Usage: node src/lib/main.js <number>');
    return 2;
  }
  try{
    // If single numeric arg, print fizzBuzzSingle
    const res = fizzBuzzSingle(n);
    console.log(res);
    return 0;
  }catch(e){
    console.error(e.message);
    return 2;
  }
}

// If executed directly
if (typeof process !== 'undefined' && process.argv && fileURLToPath(import.meta.url) === process.argv[1]){
  const code = main(process.argv.slice(2));
  process.exit(code);
}
