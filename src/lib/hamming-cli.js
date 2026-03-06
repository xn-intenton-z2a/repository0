#!/usr/bin/env node
// src/lib/hamming-cli.js
// Small CLI wrapper for the Hamming library functions.

import { hammingDistance, hammingDistanceBits, hammingDistanceString, hammingDistanceInt } from './main.js';

const argv = process.argv.slice(2);

function usageAndExit() {
  console.error('Usage: node src/lib/hamming-cli.js <string|s|bits|b> <a> <b>');
  process.exitCode = 1;
}

if (argv.length !== 3) {
  usageAndExit();
}

const [mode, a, b] = argv;

function handleError(e) {
  const code = e instanceof TypeError ? 2 : e instanceof RangeError ? 3 : 1;
  console.error(`${e.name}: ${e.message}`);
  process.exit(code);
}

try {
  if (mode === 'string' || mode === 's') {
    const fn = typeof hammingDistance === 'function' ? hammingDistance : hammingDistanceString;
    const res = fn(a, b);
    console.log(res);
  } else if (mode === 'bits' || mode === 'bit' || mode === 'b') {
    const fn = typeof hammingDistanceBits === 'function' ? hammingDistanceBits : hammingDistanceInt;
    const x = Number(a);
    const y = Number(b);
    const res = fn(x, y);
    console.log(res);
  } else {
    usageAndExit();
  }
} catch (e) {
  handleError(e);
}
