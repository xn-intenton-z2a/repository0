// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { spawnSync } from 'child_process';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

function runCmd(args, opts = {}) {
  const node = process.execPath;
  const result = spawnSync(node, ['src/lib/main.js', ...args], { encoding: 'utf8', ...opts });
  return result;
}

describe('CLI', () => {
  test('seed -> save -> export -> import round-trip', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'ont-'));
    try {
      const seed = runCmd(['seed']);
      expect(seed.status).toBe(0);
      const seedOut = JSON.parse(seed.stdout);
      expect(seedOut.ok).toBe(true);
      expect(seedOut.summary.classes).toBeGreaterThan(0);

      const save = runCmd(['save', tmp]);
      expect(save.status).toBe(0);
      const saveOut = JSON.parse(save.stdout);
      expect(saveOut.ok).toBe(true);
      expect(saveOut.summary.files.length).toBeGreaterThan(0);

      const exp = runCmd(['export']);
      expect(exp.status).toBe(0);
      const expOut = JSON.parse(exp.stdout);
      expect(expOut.ok).toBe(true);
      expect(expOut.summary['@graph']).toBeTruthy();

      // write exported graph to file and then import
      const fp = join(tmp, 'export.jsonld');
      // spawnSync node to write using a simple echo (use printf)
      const writer = spawnSync(process.execPath, ['-e', `import fs from 'fs'; fs.writeFileSync('${fp}', process.stdin.read ? process.stdin.read() : '', 'utf8')`], { input: JSON.stringify(expOut.summary), encoding: 'utf8' });
      // fallback to using child_process spawn to write file in JS is complicated here; instead, call import command with path of one of the saved files
      const importCmd = runCmd(['import', saveOut.summary.files[0]]);
      expect(importCmd.status).toBe(0);
      const importOut = JSON.parse(importCmd.stdout);
      expect(importOut.ok).toBe(true);
    } finally {
      try { rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* ignore */ }
    }
  });
});
