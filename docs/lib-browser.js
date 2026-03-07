// Browser-compatible fizzbuzz helper used by example pages
export function fizzBuzzSingle(n) {
  if (typeof n !== 'number' || Number.isNaN(n) || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) throw new RangeError('n must be a non-negative integer');
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

export function fizzBuzz(n) {
  if (typeof n !== 'number' || Number.isNaN(n) || !Number.isFinite(n) || !Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) throw new RangeError('n must be a non-negative integer');
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) out.push(fizzBuzzSingle(i));
  return out;
}
