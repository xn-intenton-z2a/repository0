import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.join(process.cwd(), 'src', 'web', 'index.html'), 'utf8');

describe('web demo structure', () => {
  it('has demo container, input and button', async () => {
    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    const doc = dom.window.document;
    expect(doc.getElementById('fizzbuzz-demo')).toBeTruthy();
    expect(doc.getElementById('fizzbuzz-n')).toBeTruthy();
    expect(doc.getElementById('fizzbuzz-render')).toBeTruthy();
  });

  it('fizzbuzz-client is importable and exposes functions', async () => {
    const client = await import('../../../src/web/fizzbuzz-client.js');
    expect(typeof client.fizzBuzz).toBe('function');
    expect(typeof client.fizzBuzzSingle).toBe('function');
    expect(client.fizzBuzz(5)[2]).toBe('Fizz');
  });
});
