import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('web demo wiring', ()=>{
  it('contains required inputs and outputs', ()=>{
    const html = fs.readFileSync(path.resolve('src/web/roman.html'),'utf8');
    expect(html).toContain('data-test-id="number-input"');
    expect(html).toContain('data-test-id="roman-input"');
    expect(html).toContain('data-test-id="number-output"');
    expect(html).toContain('data-test-id="roman-output"');
  });
});
