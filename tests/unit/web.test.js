import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Web demo structure', ()=>{
  it('index.html contains required IDs', ()=>{
    const html = fs.readFileSync(path.resolve('src/web/index.html'),'utf8');
    expect(html).toContain('id="fizz-input"');
    expect(html).toContain('id="fizz-submit"');
    expect(html).toContain('id="fizz-output"');
    expect(html).toContain('id="fizz-range"');
    expect(html).toContain('id="fizz-range-submit"');
    expect(html).toContain('id="fizz-range-output"');
    expect(html).toContain('id="fizz-error"');
  });
});
