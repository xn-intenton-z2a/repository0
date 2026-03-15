// SPDX-License-Identifier: MIT
// Demo module for FizzBuzz. Exposes helpers for unit tests and attaches behaviour to the demo page.
import { fizzbuzzRange, fizzBuzz } from './lib.js';

export function renderFizzbuzzToDocument(start, end, doc = document) {
  const outEl = doc.getElementById('fizz-output');
  const errEl = doc.getElementById('fizz-error');
  if (!outEl) throw new Error('Missing #fizz-output element');
  if (!errEl) throw new Error('Missing #fizz-error element');

  // Clear previous
  errEl.textContent = '';
  outEl.textContent = '';

  try {
    const seq = fizzbuzzRange(start, end);
    outEl.textContent = seq.join('\n');
  } catch (err) {
    errEl.textContent = err?.message ?? String(err);
  }
}

export function renderFizzbuzzNToDocument(n, doc = document) {
  const outEl = doc.getElementById('fizzbuzz-output');
  const errEl = doc.getElementById('fizzbuzz-error');
  if (!outEl) throw new Error('Missing #fizzbuzz-output element');
  if (!errEl) throw new Error('Missing #fizzbuzz-error element');

  errEl.textContent = '';
  outEl.textContent = '';

  try {
    const seq = fizzBuzz(n);
    outEl.textContent = seq.join('\n');
  } catch (err) {
    errEl.textContent = err?.message ?? String(err);
  }
}

export function attachDemo(doc = document) {
  const startInput = doc.getElementById('fizz-start');
  const endInput = doc.getElementById('fizz-end');
  const gen = doc.getElementById('fizz-gen');

  if (startInput && endInput && gen) {
    const runRange = () => {
      const s = Number(startInput.value);
      const e = Number(endInput.value);
      renderFizzbuzzToDocument(s, e, doc);
    };
    gen.addEventListener('click', runRange);
    // Initial render
    runRange();
  }

  const nInput = doc.getElementById('fizz-n');
  const runBtn = doc.getElementById('fizz-run');
  if (nInput && runBtn) {
    const runSingle = () => {
      const n = Number(nInput.value);
      renderFizzbuzzNToDocument(n, doc);
    };
    runBtn.addEventListener('click', runSingle);
    // Initial render for single demo
    runSingle();
  }
}
