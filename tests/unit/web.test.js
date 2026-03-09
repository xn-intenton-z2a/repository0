import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

describe('web demo', ()=>{
  let dom;
  beforeEach(()=>{
    const html = fs.readFileSync('src/web/index.html','utf8');
    dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
  });

  it('has start/end inputs and results list', async ()=>{
    const window = dom.window;
    await new Promise(r=>setTimeout(r,300));
    const start = window.document.getElementById('start');
    const end = window.document.getElementById('end');
    const results = window.document.getElementById('results');
    expect(start).toBeTruthy();
    expect(end).toBeTruthy();
    expect(results).toBeTruthy();
    // trigger generate to ensure rendering (may be no-op in JSDOM); presence of elements is sufficient here
    const btn = window.document.getElementById('generate');
    btn.click();
    await new Promise(r=>setTimeout(r,50));
    // we assert elements exist; end-to-end browser behaviour is covered by Playwright behaviour tests
    expect(start.tagName.toLowerCase()).toBe('input');
    expect(end.tagName.toLowerCase()).toBe('input');
    expect(results.tagName.toLowerCase()).toBe('ul');
  });
});
