import { describe, test, expect } from 'vitest';
import { execSync } from 'child_process';

const cli = 'node sandbox/source/main.js';

describe('help and fallback behavior', () => {
  test('help command outputs usage and lists help command', () => {
    const output = execSync(`${cli} help`, { encoding: 'utf-8' });
    expect(output).toContain('Usage: npm run start --');
    expect(output).toContain('help');
  });

  test('no command provided outputs help usage', () => {
    const output = execSync('node sandbox/source/main.js', { encoding: 'utf-8' });
    expect(output).toContain('Usage: npm run start --');
    expect(output).toContain('help');
  });

  test('unknown command fallback prints unknown and usage', () => {
    const output = execSync(`${cli} foobar`, { encoding: 'utf-8' });
    expect(output).toContain('Unknown command: foobar');
    expect(output).toContain('Usage: npm run start --');
    expect(output).toContain('help');
  });
});