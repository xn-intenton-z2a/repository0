import { describe, test, expect } from 'vitest';
import { execSync } from 'child_process';

describe('CLI sandbox/source/main.js', () => {
  test('mission-features command outputs mission then features', () => {
    const output = execSync('node sandbox/source/main.js mission-features', { encoding: 'utf-8' });
    // Verify mission heading
    expect(output).toContain('# Mission Statement');
    // Verify at least one feature heading (e.g., CLI Command Support)
    expect(output).toMatch(/CLI Command Support/);
  });
});
