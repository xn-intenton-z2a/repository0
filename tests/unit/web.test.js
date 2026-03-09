import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

describe('web demo structure', ()=>{
  const html = fs.readFileSync(path.resolve('src/web/index.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
  const window = dom.window;

  it('has required elements', ()=>{
    const ids = ['fizz-input','fizz-submit','fizz-output','fizz-range','fizz-range-submit','fizz-range-output','fizz-error'];
    ids.forEach(id=>{
      expect(window.document.getElementById(id)).toBeTruthy();
    });
  });
});
