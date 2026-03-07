import { name, version, description } from './lib-meta.js';

function fizzBuzzSingle(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) throw new TypeError('n must be an integer');
  if (n <= 0) throw new RangeError('n must be a positive integer');
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

function fizzBuzz(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) throw new TypeError('n must be an integer');
  if (n < 0) throw new RangeError('n must be >= 0');
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) out.push(fizzBuzzSingle(i));
  return out;
}

const demoOutput = {
  identity: { name, version, description },
  fizz15: fizzBuzz(15)
};

document.getElementById('lib-name').textContent = name;
document.getElementById('lib-version').textContent = version;
document.getElementById('lib-description').textContent = description || '(no description)';
document.getElementById('demo-output').textContent = JSON.stringify(demoOutput, null, 2);
document.title = name + ' v' + version;
