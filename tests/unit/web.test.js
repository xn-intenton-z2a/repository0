// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited

import { test, expect, describe, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getIdentity } from '../../src/lib/main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Web Interface Structure', () => {
  let dom;
  let document;

  beforeEach(() => {
    const html = readFileSync(join(__dirname, '../../src/web/index.html'), 'utf-8');
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  test('has required HTML structure elements', () => {
    // Library identity elements
    expect(document.getElementById('lib-name')).toBeTruthy();
    expect(document.getElementById('lib-version')).toBeTruthy();
    expect(document.getElementById('lib-description')).toBeTruthy();

    // String distance interface
    expect(document.getElementById('string1')).toBeTruthy();
    expect(document.getElementById('string2')).toBeTruthy();
    expect(document.getElementById('string-demo')).toBeTruthy();

    // Bit distance interface
    expect(document.getElementById('int1')).toBeTruthy();
    expect(document.getElementById('int2')).toBeTruthy();
    expect(document.getElementById('bit-demo')).toBeTruthy();
  });

  test('input elements have appropriate types and attributes', () => {
    const string1 = document.getElementById('string1');
    const string2 = document.getElementById('string2');
    const int1 = document.getElementById('int1');
    const int2 = document.getElementById('int2');

    expect(string1.type).toBe('text');
    expect(string2.type).toBe('text');
    expect(int1.type).toBe('number');
    expect(int2.type).toBe('number');
    expect(int1.min).toBe('0');
    expect(int2.min).toBe('0');
  });

  test('has default values for demonstration', () => {
    const string1 = document.getElementById('string1');
    const string2 = document.getElementById('string2');
    const int1 = document.getElementById('int1');
    const int2 = document.getElementById('int2');

    expect(string1.value).toBe('karolin');
    expect(string2.value).toBe('kathrin');
    expect(int1.value).toBe('1');
    expect(int2.value).toBe('4');
  });

  test('includes proper page metadata', () => {
    expect(document.title).toBe('repository0');
    expect(document.querySelector('meta[charset="UTF-8"]')).toBeTruthy();
    expect(document.querySelector('meta[name="viewport"]')).toBeTruthy();
  });

  test('has buttons for calculations', () => {
    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    
    const buttonTexts = Array.from(buttons).map(btn => btn.textContent);
    expect(buttonTexts).toContain('Calculate');
  });
});

describe('Library Integration', () => {
  test('web lib.js re-exports main library functions', async () => {
    const webLib = await import('../../src/web/lib.js');
    
    expect(typeof webLib.hammingDistance).toBe('function');
    expect(typeof webLib.hammingDistanceBits).toBe('function');
    expect(typeof webLib.getIdentity).toBe('function');
    expect(typeof webLib.name).toBe('string');
    expect(typeof webLib.version).toBe('string');
  });

  test('web lib exports match main library exports', async () => {
    const mainLib = await import('../../src/lib/main.js');
    const webLib = await import('../../src/web/lib.js');

    expect(webLib.hammingDistance).toBe(mainLib.hammingDistance);
    expect(webLib.hammingDistanceBits).toBe(mainLib.hammingDistanceBits);
    expect(webLib.getIdentity).toBe(mainLib.getIdentity);
    expect(webLib.name).toBe(mainLib.name);
    expect(webLib.version).toBe(mainLib.version);
  });

  test('library functions work correctly when imported for web', async () => {
    const { hammingDistance, hammingDistanceBits } = await import('../../src/web/lib.js');

    // Test string distance
    expect(hammingDistance('karolin', 'kathrin')).toBe(3);
    expect(hammingDistance('', '')).toBe(0);

    // Test bit distance  
    expect(hammingDistanceBits(1, 4)).toBe(2);
    expect(hammingDistanceBits(0, 0)).toBe(0);
  });

  test('identity function provides consistent data', async () => {
    const { getIdentity } = await import('../../src/web/lib.js');
    const mainIdentity = getIdentity();
    
    expect(mainIdentity).toEqual(getIdentity());
    expect(typeof mainIdentity.name).toBe('string');
    expect(typeof mainIdentity.version).toBe('string');
    expect(typeof mainIdentity.description).toBe('string');
  });
});
