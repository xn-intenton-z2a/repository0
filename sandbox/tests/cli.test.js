import { describe, test, expect, vi } from 'vitest';
import { main } from '../source/main.js';
import fs from 'fs/promises';
import path from 'path';

describe('CLI Commands', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('help command prints usage instructions', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await main(['help']);
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls.map(c => c.join(' ')).join('\n');
    expect(output).toContain('Usage:');
    expect(output).toContain('help');
    expect(output).toContain('mission');
    expect(output).toContain('version');
    expect(output).toContain('echo');
  });

  test('mission command prints mission statement', async () => {
    const fakeMission = 'Test mission statement';
    vi.spyOn(fs, 'readFile').mockResolvedValue(fakeMission);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await main(['mission']);
    expect(fs.readFile).toHaveBeenCalledWith(path.resolve(process.cwd(), 'MISSION.md'), 'utf-8');
    expect(logSpy).toHaveBeenCalledWith(fakeMission);
  });

  test('version command prints version from package.json', async () => {
    const fakePkg = JSON.stringify({ version: '9.9.9' });
    vi.spyOn(fs, 'readFile').mockImplementation(async () => fakePkg);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await main(['version']);
    expect(logSpy).toHaveBeenCalledWith('9.9.9');
  });

  test('echo command echoes provided arguments', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await main(['echo', 'hello', 'world']);
    expect(logSpy).toHaveBeenCalledWith('hello world');
  });

  test('unknown command shows help', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await main(['foobar']);
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls.map(c => c.join(' ')).join('\n');
    expect(output).toContain('Usage:');
  });
});
