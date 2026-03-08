// SPDX-License-Identifier: MIT
// Pure FizzBuzz implementation usable in Node and browser.
export function _ensureNumberInteger(n, name = 'n') {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError(`${name} must be a finite number`);
  }
  if (!Number.isInteger(n)) {
    throw new TypeError(`${name} must be an integer`);
  }
}

export function fizzBuzzSingle(n) {
  _ensureNumberInteger(n, 'n');
  if (n < 0) throw new RangeError('n must be non-negative');
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

export function fizzBuzz(n) {
  _ensureNumberInteger(n, 'n');
  if (n < 0) throw new RangeError('n must be non-negative');
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) out.push(fizzBuzzSingle(i));
  return out;
}

export function fizzBuzzSingleFormatted(n, formatter) {
  if (typeof formatter !== 'function') throw new TypeError('formatter must be a function');
  const base = fizzBuzzSingle(n);
  return formatter(n, base);
}

export function fizzBuzzFormatted(n, formatter) {
  if (typeof formatter !== 'function') throw new TypeError('formatter must be a function');
  const arr = fizzBuzz(n);
  return arr.map((s, i) => formatter(i + 1, s));
}
