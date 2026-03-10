import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('web demo structure', () => {
  it('index.html contains required elements and demo script loads', async () => {
    const html = fs.readFileSync(path.resolve('./src/web/index.html'), 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    const document = dom.window.document;

    expect(document.getElementById('lib-name')).toBeTruthy();
    expect(document.getElementById('lib-version')).toBeTruthy();
    expect(document.getElementById('cron-input')).toBeTruthy();
    expect(document.getElementById('start-input')).toBeTruthy();
    expect(document.getElementById('count-input')).toBeTruthy();
    expect(document.getElementById('generate-button')).toBeTruthy();
    expect(document.getElementById('demo-output')).toBeTruthy();
  });
});
