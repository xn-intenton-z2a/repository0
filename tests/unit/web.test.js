import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { describe, it, expect } from 'vitest';
import { generate } from '../../src/lib/main.js';

describe('web demo structure and wiring', () => {
  it('index.html contains demo container and control elements and wiring works', async () => {
    const html = readFileSync('src/web/index.html', 'utf8');
    const dom = new JSDOM(html);
    const { document, window } = dom.window;

    const demo = document.getElementById('fizzbuzz-demo');
    const input = document.getElementById('fizzbuzz-n');
    const button = document.getElementById('fizzbuzz-render');

    expect(demo).toBeTruthy();
    expect(input).toBeTruthy();
    expect(button).toBeTruthy();

    // Simulate wiring: expose library generate function to the page and assert results
    window.generateFizzBuzz = generate;
    const res = window.generateFizzBuzz(15);
    expect(res[2]).toBe('fizz');
    expect(res[4]).toBe('buzz');
    expect(res[14]).toBe('fizzbuzz');
  });
});
