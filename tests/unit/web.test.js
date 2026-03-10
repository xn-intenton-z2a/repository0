import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import * as demo from '../../src/web/demo-lib.js';

describe('website structure and demo wiring', () => {
  it('index.html contains expected elements', () => {
    const html = readFileSync(resolve('src/web/index.html'), 'utf8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    expect(doc.getElementById('lib-name')).toBeTruthy();
    expect(doc.getElementById('lib-version')).toBeTruthy();
    expect(doc.getElementById('demo-output')).toBeTruthy();
  });

  it('demo-lib exports functions and produces expected results', () => {
    expect(typeof demo.hammingDistance).toBe('function');
    expect(typeof demo.hammingDistanceBits).toBe('function');
    const results = demo.demoResults();
    expect(results.example1.distance).toBe(3);
    expect(results.example2.distance).toBe(0);
    expect(results.bits1.distance).toBe(2);
    expect(results.bits2.distance).toBe(0);
  });
});
