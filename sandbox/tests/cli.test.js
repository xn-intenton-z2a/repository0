import { describe, test, expect, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('CLI Integration', () => {
  const outputFile = path.resolve('test_output.svg');

  afterAll(() => {
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
  });

  test('sine type with --output writes SVG file', () => {
    execSync(`node sandbox/source/main.js --type sine --output ${outputFile}`);
    expect(fs.existsSync(outputFile)).toBe(true);
    const content = fs.readFileSync(outputFile, 'utf-8');
    expect(content.startsWith('<svg')).toBe(true);
    expect(content.includes('<path')).toBe(true);
  });

  test('outputs to stdout when no --output', () => {
    const out = execSync('node sandbox/source/main.js --type quadratic --a 1 --b 0 --c 0');
    const str = out.toString().trim();
    expect(str.startsWith('<svg')).toBe(true);
  });

  test('prints mission statement with --mission', () => {
    const output = execSync('node sandbox/source/main.js --mission').toString();
    expect(output).toContain('# Mission Statement');
    expect(output.split('\n').length).toBeGreaterThan(1);
  });
});
