import { name, version, description } from './lib-meta.js';

// Browser-safe fizzbuzz implementation matching library behaviour
export function fizzBuzzSingle(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError('n must be a finite number');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n <= 0) {
    throw new RangeError('n must be a positive integer');
  }
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

export function fizzBuzz(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError('n must be a finite number');
  }
  if (!Number.isInteger(n)) {
    throw new TypeError('n must be an integer');
  }
  if (n < 0) {
    throw new RangeError('n must be >= 0');
  }
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) out.push(fizzBuzzSingle(i));
  return out;
}

function render() {
  document.getElementById('lib-name').textContent = name;
  document.getElementById('lib-version').textContent = version;
  document.getElementById('lib-description').textContent = description || '(no description)';
  document.title = `${name} v${version}`;

  const result = { fizzBuzz15: fizzBuzz(15) };
  const el = document.getElementById('demo-output');
  el.textContent = JSON.stringify(result, null, 2);
}

if (typeof window !== 'undefined' && document.readyState !== 'loading') render();
else if (typeof window !== 'undefined') window.addEventListener('DOMContentLoaded', render);
