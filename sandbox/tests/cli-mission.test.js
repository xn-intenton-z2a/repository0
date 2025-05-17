import { describe, test, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const cliPath = path.resolve(__dirname, '../source/main.js');
const nodeCmd = `node ${cliPath}`;

describe('CLI --mission flag', () => {
  test('prints mission from MISSION.md with --mission', () => {
    const output = execSync(`${nodeCmd} --mission`, { encoding: 'utf-8' });
    const mission = fs.readFileSync(path.resolve(__dirname, '../../MISSION.md'), 'utf-8');
    expect(output.trim()).toBe(mission.trim());
  });

  test('prints mission from MISSION.md with -m', () => {
    const output = execSync(`${nodeCmd} -m`, { encoding: 'utf-8' });
    const mission = fs.readFileSync(path.resolve(__dirname, '../../MISSION.md'), 'utf-8');
    expect(output.trim()).toBe(mission.trim());
  });

  test('falls back to default echo when no flags', () => {
    const output = execSync(`${nodeCmd}`, { encoding: 'utf-8' });
    expect(output.trim()).toBe('Run with: []');
  });

  test('echoes arguments without mission flag', () => {
    const output = execSync(`${nodeCmd} foo bar`, { encoding: 'utf-8' });
    expect(output.trim()).toBe('Run with: ["foo","bar"]');
  });
});
