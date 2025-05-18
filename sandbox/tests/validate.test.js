import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const cli = 'node sandbox/source/main.js';

describe('validate command', () => {
  const tempDir = path.join(os.tmpdir(), 'validate-tests');

  beforeEach(() => {
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('syntax validation success', () => {
    const file = path.join(tempDir, 'valid.json');
    fs.writeFileSync(file, JSON.stringify({ a: 1 }));
    const output = execSync(`${cli} validate ${file}`, { encoding: 'utf-8' });
    expect(output.trim()).toBe(`Validation passed for ${file}`);
  });

  test('syntax validation failure for invalid JSON', () => {
    const file = path.join(tempDir, 'bad.json');
    fs.writeFileSync(file, '{invalid json');
    let err;
    try {
      execSync(`${cli} validate ${file}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.status).toBe(1);
    expect(err.stderr).toContain(`Error parsing ${file}:`);
  });

  test('schema validation success', () => {
    const dataFile = path.join(tempDir, 'data.json');
    const schemaFile = path.join(tempDir, 'schema.json');
    fs.writeFileSync(dataFile, JSON.stringify({ foo: 'bar' }));
    fs.writeFileSync(
      schemaFile,
      JSON.stringify({
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        properties: { foo: { type: 'string' } },
        required: ['foo'],
      }),
    );
    const output = execSync(`${cli} validate ${dataFile} --schema ${schemaFile}`, { encoding: 'utf-8' });
    expect(output.trim()).toBe(`Validation passed for ${dataFile}`);
  });

  test('schema validation failure', () => {
    const dataFile = path.join(tempDir, 'data2.json');
    const schemaFile = path.join(tempDir, 'schema2.json');
    fs.writeFileSync(dataFile, JSON.stringify({ foo: 123 }));
    fs.writeFileSync(
      schemaFile,
      JSON.stringify({
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        properties: { foo: { type: 'string' } },
        required: ['foo'],
      }),
    );
    let err;
    try {
      execSync(`${cli} validate ${dataFile} --schema ${schemaFile}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.status).toBe(1);
    expect(err.stderr).toContain('must be string');
  });

  test('missing file argument', () => {
    let err;
    try {
      execSync(`${cli} validate`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.status).toBe(1);
    expect(err.stderr).toContain('Usage: npm run start -- validate');
  });

  test('writes output to file with --output', () => {
    const file = path.join(tempDir, 'valid2.json');
    const out = path.join(tempDir, 'report.txt');
    fs.writeFileSync(file, JSON.stringify({ a: 2 }));
    const stdout = execSync(`${cli} validate ${file} --output ${out}`, { encoding: 'utf-8' });
    expect(stdout).toBe('');
    const content = fs.readFileSync(out, 'utf-8');
    expect(content.trim()).toBe(`Validation passed for ${file}`);
  });

  test('writes errors to file with --output on failure', () => {
    const file = path.join(tempDir, 'bad2.json');
    const out = path.join(tempDir, 'report2.txt');
    fs.writeFileSync(file, '{bad json');
    let err;
    try {
      execSync(`${cli} validate ${file} --output ${out}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    const content = fs.readFileSync(out, 'utf-8');
    expect(content).toContain(`Error parsing ${file}:`);
  });
});
