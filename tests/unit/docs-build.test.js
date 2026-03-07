import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('Docs build', () => {
  it('build:web copies examples into docs and includes canonical snippets', () => {
    const res = spawnSync('npm', ['run', 'build:web'], { encoding: 'utf8' });
    expect(res.status).toBe(0);

    const examplesPath = path.resolve('docs/examples/cli-output.md');
    expect(fs.existsSync(examplesPath)).toBe(true);
    const txt = fs.readFileSync(examplesPath, 'utf8');

    expect(txt).toMatch(/node src\/lib\/main\.js string karolin kathrin/);
    expect(txt).toMatch(/Expected stdout: 3/);
    expect(txt).toMatch(/node src\/lib\/main\.js bits 1 4/);
    expect(txt).toMatch(/Expected stdout: 2/);
  });
});
