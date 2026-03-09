// src/web/fizzbuzz-client.js
// Browser-friendly fizzbuzz implementation used by the demo page.
export function generate(n) {
  if (typeof n !== 'number' || Number.isNaN(n) || !Number.isInteger(n) || n < 1) {
    throw new TypeError('n must be a positive integer');
  }
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push('fizzbuzz');
    else if (i % 3 === 0) out.push('fizz');
    else if (i % 5 === 0) out.push('buzz');
    else out.push(i);
  }
  return out;
}

export function format(n) {
  return generate(n).map((v) => String(v)).join('\n');
}

// Attach to window for demos/tests that expect a global hook
if (typeof window !== 'undefined') {
  window.generateFizzBuzz = generate;
  window.formatFizzBuzz = format;
}
