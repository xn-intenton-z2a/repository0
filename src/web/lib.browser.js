// Browser-friendly FizzBuzz helper used by the demo website
export const name = 'repo';
export const version = '0.1.0';
export function fizzBuzzSingle(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) throw new TypeError('n must be an integer');
  if (n < 1) throw new RangeError('n must be >= 1');
  const by3 = n % 3 === 0;
  const by5 = n % 5 === 0;
  if (by3 && by5) return 'FizzBuzz';
  if (by3) return 'Fizz';
  if (by5) return 'Buzz';
  return String(n);
}
export function fizzBuzz(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n)) throw new TypeError('n must be an integer');
  if (n < 0) throw new RangeError('n must be >= 0');
  const out = [];
  for (let i = 1; i <= n; i++) out.push(fizzBuzzSingle(i));
  return out;
}
