import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const cli = 'node sandbox/source/main.js';

describe('render command', () => {
  const tempDir = path.join(os.tmpdir(), 'render-tests');

  beforeEach(() => {
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('renders static template without data file', () => {
    const templatePath = path.join(tempDir, 'static.ejs');
    fs.writeFileSync(templatePath, 'Hello World');
    const output = execSync(`${cli} render ${templatePath}`, { encoding: 'utf-8' });
    expect(output.trim()).toBe('Hello World');
  });

  test('renders template with JSON data file', () => {
    const templatePath = path.join(tempDir, 'data.ejs');
    const dataPath = path.join(tempDir, 'data.json');
    fs.writeFileSync(templatePath, 'Value: <%= foo %>');
    fs.writeFileSync(dataPath, JSON.stringify({ foo: 'bar' }));
    const output = execSync(`${cli} render ${templatePath} ${dataPath}`, { encoding: 'utf-8' });
    expect(output.trim()).toBe('Value: bar');
  });

  test('writes rendered output to file with --output flag', () => {
    const templatePath = path.join(tempDir, 'out.ejs');
    const dataPath = path.join(tempDir, 'out.json');
    const outPath = path.join(tempDir, 'result.html');
    fs.writeFileSync(templatePath, 'X: <%= x %>');
    fs.writeFileSync(dataPath, JSON.stringify({ x: 123 }));
    const stdout = execSync(
      `${cli} render ${templatePath} ${dataPath} --output ${outPath}`,
      { encoding: 'utf-8' }
    );
    const fileContent = fs.readFileSync(outPath, 'utf-8');
    expect(fileContent).toBe('X: 123');
    expect(stdout.trim()).toBe(`Wrote rendered output to ${outPath}`);
  });

  test('error when template file does not exist', () => {
    const fakePath = path.join(tempDir, 'no.ejs');
    let error;
    try {
      execSync(`${cli} render ${fakePath}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.status).toBe(1);
    expect(error.stderr).toContain('Error reading template file');
  });

  test('error when data file contains invalid JSON', () => {
    const templatePath = path.join(tempDir, 'inv.ejs');
    const dataPath = path.join(tempDir, 'inv.json');
    fs.writeFileSync(templatePath, 'Test');
    fs.writeFileSync(dataPath, '{invalid json');
    let error;
    try {
      execSync(`${cli} render ${templatePath} ${dataPath}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.status).toBe(1);
    expect(error.stderr).toContain('Error parsing data file');
  });
});
