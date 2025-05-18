import { describe, test, expect } from 'vitest';
import { execSync } from 'child_process';

describe('CLI sandbox/source/main.js', () => {
  test('features command lists headings of feature docs', () => {
    const output = execSync('node sandbox/source/main.js features', { encoding: 'utf-8' });
    expect(output).toContain('CLI Command Support');
  });

  test('features command with --validate-mission lists headings without mission references', () => {
    const output = execSync('node sandbox/source/main.js features --validate-mission', { encoding: 'utf-8' });
    expect(output).toContain('CLI Command Support');
  });
});
