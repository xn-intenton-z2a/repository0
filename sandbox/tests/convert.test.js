import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import jsYaml from 'js-yaml';

const cli = 'node sandbox/source/main.js';

describe('convert command', () => {
  const tempDir = path.join(os.tmpdir(), 'convert-tests');

  beforeEach(() => {
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('.env to JSON conversion', () => {
    const envPath = path.join(tempDir, 'test.env');
    fs.writeFileSync(envPath, 'KEY1=VALUE1\nKEY2=VALUE2');
    const output = execSync(`${cli} convert ${envPath}`, { encoding: 'utf-8' });
    const json = JSON.parse(output);
    expect(json).toEqual({ KEY1: 'VALUE1', KEY2: 'VALUE2' });
  });

  test('YAML to JSON conversion', () => {
    const yamlPath = path.join(tempDir, 'test.yaml');
    fs.writeFileSync(yamlPath, 'foo: bar\nnum: 10');
    const output = execSync(`${cli} convert ${yamlPath}`, { encoding: 'utf-8' });
    const json = JSON.parse(output);
    expect(json).toEqual({ foo: 'bar', num: 10 });
  });

  test('JSON to .env conversion with --to-env', () => {
    const jsonPath = path.join(tempDir, 'test.json');
    fs.writeFileSync(jsonPath, JSON.stringify({ A: '1', B: '2' }));
    const output = execSync(`${cli} convert ${jsonPath} --to-env`, { encoding: 'utf-8' });
    const lines = output.trim().split('\n');
    expect(lines).toEqual(['A=1', 'B=2']);
  });

  test('JSON to YAML conversion with --to-yaml', () => {
    const jsonPath = path.join(tempDir, 'test2.json');
    fs.writeFileSync(jsonPath, JSON.stringify({ x: 'y', arr: [1, 2] }));
    const output = execSync(`${cli} convert ${jsonPath} --to-yaml`, { encoding: 'utf-8' });
    const parsed = jsYaml.load(output);
    expect(parsed).toEqual({ x: 'y', arr: [1, 2] });
  });

  test('writes output to file with --output', () => {
    const envPath = path.join(tempDir, 'test.env');
    const outPath = path.join(tempDir, 'out.json');
    fs.writeFileSync(envPath, 'Z=9');
    execSync(`${cli} convert ${envPath} --output ${outPath}`, { encoding: 'utf-8' });
    const fileContent = fs.readFileSync(outPath, 'utf-8');
    const json = JSON.parse(fileContent);
    expect(json).toEqual({ Z: '9' });
  });

  test('error on non-existent file', () => {
    const non = path.join(tempDir, 'nope.env');
    let err;
    try {
      execSync(`${cli} convert ${non}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.status).toBe(1);
    expect(err.stderr).toContain('Error reading input file');
  });

  test('error on invalid JSON input', () => {
    const jsonPath = path.join(tempDir, 'bad.json');
    fs.writeFileSync(jsonPath, '{invalid json');
    let err;
    try {
      execSync(`${cli} convert ${jsonPath}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.status).toBe(1);
    expect(err.stderr).toContain('Error parsing input file');
  });
});