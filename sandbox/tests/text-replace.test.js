import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const cli = 'node sandbox/source/main.js';

describe('text-replace command', () => {
  const tempDir = path.join(os.tmpdir(), 'text-replace-tests');

  beforeEach(() => {
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('errors when missing --search or --replace', () => {
    let err1;
    try {
      execSync(`${cli} replace`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (err) {
      err1 = err;
    }
    expect(err1).toBeDefined();
    expect(err1.status).toBe(1);
    expect(err1.stderr).toContain('Missing --search or --replace flag');

    let err2;
    try {
      execSync(`${cli} replace file.txt --search foo`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (err) {
      err2 = err;
    }
    expect(err2).toBeDefined();
    expect(err2.status).toBe(1);
    expect(err2.stderr).toContain('Missing --search or --replace flag');
  });

  test('literal replacement replaces first occurrence only', () => {
    const filePath = path.join(tempDir, 'lit.txt');
    fs.writeFileSync(filePath, 'foo foo foo');
    const output = execSync(
      `${cli} replace ${filePath} --search foo --replace bar`,
      { encoding: 'utf-8' }
    );
    expect(output.trim()).toBe('bar foo foo');
  });

  test('regex replacement with flags replaces all matches', () => {
    const filePath = path.join(tempDir, 'regex.txt');
    fs.writeFileSync(filePath, 'aAbB');
    const output = execSync(
      `${cli} replace ${filePath} --search a --replace X --regex --flags gi`,
      { encoding: 'utf-8' }
    );
    expect(output.trim()).toBe('XXbB');
  });

  test('invalid regex reports error', () => {
    const filePath = path.join(tempDir, 'inv.txt');
    fs.writeFileSync(filePath, 'text');
    let err;
    try {
      execSync(
        `${cli} replace ${filePath} --search [ --replace x --regex`,
        { encoding: 'utf-8', stdio: 'pipe' }
      );
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.status).toBe(1);
    expect(err.stderr).toContain('Invalid regular expression');
  });

  test('writes output to file when --output is specified', () => {
    const filePath = path.join(tempDir, 'out.txt');
    const outPath = path.join(tempDir, 'result.txt');
    fs.writeFileSync(filePath, 'hello hello');
    const stdout = execSync(
      `${cli} replace ${filePath} --search hello --replace hi --output ${outPath}`,
      { encoding: 'utf-8' }
    );
    const fileContent = fs.readFileSync(outPath, 'utf-8');
    expect(fileContent).toBe('hi hello');
    expect(stdout).toBe('');
  });
});