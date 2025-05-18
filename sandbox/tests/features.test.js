import { describe, test, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('CLI sandbox/source/main.js', () => {
  test('features command lists headings of feature docs', () => {
    const output = execSync('node sandbox/source/main.js features', { encoding: 'utf-8' });
    expect(output).toContain('CLI Command Support');
  });

  test('features command with --validate-mission lists headings without mission references', () => {
    const output = execSync('node sandbox/source/main.js features --validate-mission', { encoding: 'utf-8' });
    expect(output).toContain('CLI Command Support');
  });

  test('features command with --validate-mission fails on mission references', () => {
    // Create a temporary feature document that references the mission
    const dummyPath = path.join(process.cwd(), 'sandbox/features/tmp_mission.md');
    fs.writeFileSync(dummyPath, '# Dummy Feature\nThis references MISSION.md', 'utf-8');
    let err;
    try {
      execSync('node sandbox/source/main.js features --validate-mission', { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err = e;
    } finally {
      // Clean up the dummy file
      fs.unlinkSync(dummyPath);
    }
    expect(err).toBeDefined();
    expect(err.status).toBe(1);
    expect(err.stderr).toContain('tmp_mission.md');
  });
});
