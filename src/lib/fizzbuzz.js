// src/lib/fizzbuzz.js
// Exports: fizzBuzzSingle, fizzBuzz

export function fizzBuzzSingle(n) {
  if (arguments.length === 0) {
    throw new TypeError('fizzBuzzSingle: input must be an integer');
  }
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('fizzBuzzSingle: input must be an integer');
  }
  if (n % 3 === 0 && n % 5 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

export function fizzBuzz(start, end) {
  // Overload: fizzBuzz(n) -> 1..n, or fizzBuzz(start, end) -> start..end
  if (arguments.length === 1) {
    const n = start;
    if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) {
      throw new TypeError('fizzBuzz: n must be an integer');
    }
    if (n <= 0) return [];
    const out = new Array(n);
    for (let i = 1; i <= n; i++) out[i - 1] = fizzBuzzSingle(i);
    return out;
  }

  if (arguments.length < 2) {
    throw new TypeError('fizzBuzz: start and end must be provided as integers');
  }
  if (typeof start !== 'number' || !Number.isFinite(start) || !Number.isInteger(start)) {
    throw new TypeError('fizzBuzz: start must be an integer');
  }
  if (typeof end !== 'number' || !Number.isFinite(end) || !Number.isInteger(end)) {
    throw new TypeError('fizzBuzz: end must be an integer');
  }

  const result = [];
  if (start <= end) {
    for (let i = start; i <= end; i++) {
      result.push(fizzBuzzSingle(i));
    }
  } else {
    for (let i = start; i >= end; i--) {
      result.push(fizzBuzzSingle(i));
    }
  }
  return result;
}
