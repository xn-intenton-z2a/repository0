// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { JSDOM } from 'jsdom';
import { renderFizzbuzzToDocument, renderFizzbuzzNToDocument } from '../../src/web/fizzbuzz-demo.js';

describe('Website demo (unit)', () => {
  test('fizzbuzz-demo.html exists and has form elements', () => {
    expect(existsSync('src/web/fizzbuzz-demo.html')).toBe(true);
    const html = readFileSync('src/web/fizzbuzz-demo.html', 'utf8');
    expect(html).toContain('fizz-form');
    expect(html).toContain('fizz-start');
    expect(html).toContain('fizz-end');
    expect(html).toContain('fizz-gen');
    expect(html).toContain('fizz-output');
    // single-n demo elements
    expect(html).toContain('fizz-n');
    expect(html).toContain('fizz-run');
    expect(html).toContain('fizzbuzz-output');
  });

  test('rendering demo with start=1 end=5 produces exact output', () => {
    const html = readFileSync('src/web/fizzbuzz-demo.html', 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;
    // Ensure elements exist in the test DOM
    const out = document.createElement('div'); out.id = 'fizz-output'; document.body.appendChild(out);
    const err = document.createElement('div'); err.id = 'fizz-error'; document.body.appendChild(err);

    renderFizzbuzzToDocument(1,5, document);
    expect(document.getElementById('fizz-output').textContent).toBe('1\n2\nFizz\n4\nBuzz');
  });

  test('non-integer input shows exact error message for range demo', () => {
    const html = readFileSync('src/web/fizzbuzz-demo.html', 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;
    const out = document.createElement('div'); out.id = 'fizz-output'; document.body.appendChild(out);
    const err = document.createElement('div'); err.id = 'fizz-error'; document.body.appendChild(err);

    renderFizzbuzzToDocument(1.5,5, document);
    expect(document.getElementById('fizz-error').textContent).toBe('start and end must be integers');
  });

  test('single-n demo renders correct 15-item output', () => {
    const html = readFileSync('src/web/fizzbuzz-demo.html', 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;
    const out = document.createElement('div'); out.id = 'fizzbuzz-output'; document.body.appendChild(out);
    const err = document.createElement('div'); err.id = 'fizzbuzz-error'; document.body.appendChild(err);

    renderFizzbuzzNToDocument(15, document);
    expect(document.getElementById('fizzbuzz-output').textContent.split(/\r?\n/).length).toBe(15);
    const lines = document.getElementById('fizzbuzz-output').textContent.split(/\r?\n/);
    expect(lines[14]).toBe('FizzBuzz');
  });

  test('single-n demo non-integer shows error', () => {
    const html = readFileSync('src/web/fizzbuzz-demo.html', 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;
    const out = document.createElement('div'); out.id = 'fizzbuzz-output'; document.body.appendChild(out);
    const err = document.createElement('div'); err.id = 'fizzbuzz-error'; document.body.appendChild(err);

    renderFizzbuzzNToDocument(15.5, document);
    expect(document.getElementById('fizzbuzz-error').textContent).toBe('n must be an integer');
  });
});
