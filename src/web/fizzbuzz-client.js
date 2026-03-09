// src/web/fizzbuzz-client.js
// Browser-friendly shim that mirrors the library API for the demo page.
export function fizzBuzzSingle(n) {
  if (typeof n !== 'number' || Number.isNaN(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n === 0) throw new RangeError('n must be positive and non-zero');
  if (n < 0) throw new RangeError('n must not be negative');
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

export function fizzBuzz(n) {
  if (typeof n !== 'number' || Number.isNaN(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) throw new RangeError('n must not be negative');
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) out.push(fizzBuzzSingle(i));
  return out;
}

// Attach to window for demo page
if (typeof window !== 'undefined') {
  window.fizzBuzz = fizzBuzz;
  window.fizzBuzzSingle = fizzBuzzSingle;
}
