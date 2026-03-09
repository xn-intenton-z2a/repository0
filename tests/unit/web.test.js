import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('web demo wiring', () => {
  it('page has fizz-buzz elements and renders 15 items with FizzBuzz present', async () => {
    const file = path.resolve('src/web/index.html');
    const html = fs.readFileSync(file, 'utf-8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'file://' + file });
    // Wait for the module script to execute and render
    const window = dom.window;
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('timed out waiting for demo render')), 2000);
      function check() {
        const out = window.document.getElementById('fizz-buzz-output');
        if (out && out.children && out.children.length >= 15) {
          clearTimeout(timeout);
          resolve();
        } else setTimeout(check, 50);
      }
      check();
    });

    const document = window.document;
    const input = document.getElementById('fizz-buzz-input');
    const run = document.getElementById('fizz-buzz-run');
    const output = document.getElementById('fizz-buzz-output');

    expect(input).toBeTruthy();
    expect(run).toBeTruthy();
    expect(output).toBeTruthy();
    expect(output.children.length).toBe(15);

    // verify at least one FizzBuzz entry exists
    const texts = Array.from(output.children).map(c => c.textContent);
    expect(texts.some(t => t.includes('FizzBuzz'))).toBe(true);

    // simulate clicking Run with value 5
    input.value = '5';
    run.click();
    // allow update
    await new Promise(r => setTimeout(r, 50));
    expect(output.children.length).toBe(5);
    expect(output.children[4].textContent).toBe('Buzz');
  });
});
