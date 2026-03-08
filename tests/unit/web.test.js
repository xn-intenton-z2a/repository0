import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('web demo wiring', ()=>{
  it('contains required inputs and outputs', ()=>{
    const html = fs.readFileSync(path.resolve('src/web/index.html'),'utf8');
    expect(html).toContain('id="num-input"');
    expect(html).toContain('id="num-output"');
    expect(html).toContain('id="roman-input"');
    expect(html).toContain('id="roman-output"');
  });
});
