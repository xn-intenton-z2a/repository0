// src/web/fizzbuzz-client.js - browser shim for fizzBuzz
function validatePositiveInteger(n) {
  if (!Number.isSafeInteger(n) || n <= 0) {
    throw new TypeError('n must be a positive integer');
  }
}

export function fizzBuzz(n) {
  validatePositiveInteger(n);
  const out = new Array(n);
  for (let i = 1; i <= n; i++) {
    const idx = i - 1;
    if (i % 15 === 0) out[idx] = 'FizzBuzz';
    else if (i % 3 === 0) out[idx] = 'Fizz';
    else if (i % 5 === 0) out[idx] = 'Buzz';
    else out[idx] = String(i);
  }
  return out;
}

export function fizzBuzzSingle(n) {
  validatePositiveInteger(n);
  if (n % 15 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return String(n);
}

function renderList(container, items) {
  container.innerHTML = '';
  for (const it of items) {
    const li = document.createElement('li');
    li.textContent = it;
    container.appendChild(li);
  }
}

function init() {
  const input = document.getElementById('fizz-buzz-input');
  const btn = document.getElementById('fizz-buzz-run');
  const output = document.getElementById('fizz-buzz-output');
  function run(n) {
    const arr = fizzBuzz(n);
    renderList(output, arr);
  }
  btn.addEventListener('click', () => {
    const v = Number(input.value);
    try {
      run(v);
    } catch (e) {
      // simple feedback
      output.innerHTML = '';
      const li = document.createElement('li');
      li.textContent = e.message;
      output.appendChild(li);
    }
  });
  // default render
  try {
    run(Number(input.value) || 15);
  } catch (e) {
    output.innerHTML = '';
    const li = document.createElement('li');
    li.textContent = e.message;
    output.appendChild(li);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
