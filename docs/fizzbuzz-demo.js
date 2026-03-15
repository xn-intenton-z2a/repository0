// SPDX-License-Identifier: MIT
// src/web/fizzbuzz-demo.js
import { fizzBuzz, fizzBuzzSingle } from '../lib/main.js';

const canonical = fizzBuzz(15);

export function renderSequence(container) {
  container.innerHTML = '';
  const ol = document.createElement('ol');
  ol.id = 'sequence-list';
  canonical.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ol.appendChild(li);
  });
  container.appendChild(ol);
}

export function wireControls(form, outputEl) {
  const input = form.querySelector('input[name="number"]');
  const btn = form.querySelector('button[type="submit"]');
  const result = outputEl;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const val = Number(input.value);
    try {
      const res = fizzBuzzSingle(val);
      result.textContent = String(res);
    } catch (e) {
      result.textContent = e.name || 'Error';
    }
  });
}

export default function initDemo() {
  const seqContainer = document.getElementById('demo-sequence');
  const form = document.getElementById('fizz-form');
  const output = document.getElementById('fizz-output');
  if (seqContainer) renderSequence(seqContainer);
  if (form && output) wireControls(form, output);
}
