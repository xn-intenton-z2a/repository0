import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('Web demo wiring', ()=>{
  it('DOM contains required IDs and wiring produces outputs', async ()=>{
    const html = fs.readFileSync(path.resolve('src/web/index.html'), 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    // wait for module to load
    await new Promise((res)=> setTimeout(res, 50));
    const doc = dom.window.document;
    const ids = ['fizz-input','fizz-submit','fizz-output','fizz-range','fizz-range-submit','fizz-range-output','fizz-error'];
    ids.forEach(id=> expect(doc.getElementById(id)).toBeTruthy());

    // Simulate clicking handlers by importing app module and triggering events
    // Load the app module script
    const scriptUrl = path.resolve('src/web/app.js');
    // evaluate the module in the JSDOM window context
    const moduleCode = fs.readFileSync(scriptUrl, 'utf8');
    const module = new dom.window.Function('exports', 'require', 'module', '__filename', '__dirname', moduleCode);
    // A simple require shim to allow importing from '../lib/main.js'
    const requireShim = (p)=>{
      // only allow local lib import
      if (p.endsWith('../lib/main.js') || p === '../lib/main.js'){
        return require('../../src/lib/main.js');
      }
      throw new Error('unexpected require: '+p);
    };
    // execute module to wire handlers
    module({}, requireShim, {exports:{}}, scriptUrl, path.dirname(scriptUrl));

    const input = doc.getElementById('fizz-input');
    const btn = doc.getElementById('fizz-submit');
    input.value = '15';
    btn.click();
    // allow handlers
    await new Promise(res=>setTimeout(res,20));
    expect(doc.getElementById('fizz-output').textContent).toBe('FizzBuzz');

    const rangeInput = doc.getElementById('fizz-range');
    const rangeBtn = doc.getElementById('fizz-range-submit');
    rangeInput.value = '0';
    rangeBtn.click();
    await new Promise(res=>setTimeout(res,20));
    expect(doc.getElementById('fizz-range-output').textContent).toBe('');
  });
});
