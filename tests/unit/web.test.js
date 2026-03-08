import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('Web demo structure', ()=>{
  it('index.html contains required elements', ()=>{
    const html = fs.readFileSync('src/web/index.html','utf8');
    expect(html).toContain('id="num-input"');
    expect(html).toContain('id="roman-input"');
    expect(html).toContain('id="to-roman"');
    expect(html).toContain('id="from-roman"');
    expect(html).toContain('id="result"');
  });
});
