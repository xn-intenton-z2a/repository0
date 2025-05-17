import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const cli = 'node sandbox/source/main.js';

describe('csv-import command', () => {
  const tempDir = path.join(os.tmpdir(), 'csv-import-tests');

  beforeEach(() => {
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('Header Row Parsing', () => {
    const csvPath = path.join(tempDir, 'data1.csv');
    const csvContent = 'a,b\n1,2\n3,4';
    fs.writeFileSync(csvPath, csvContent);
    const output = execSync(`${cli} csv-import ${csvPath}`, { encoding: 'utf-8' });
    const json = JSON.parse(output);
    expect(json).toEqual([{ a: '1', b: '2' }, { a: '3', b: '4' }]);
  });

  test('Headerless Mode', () => {
    const csvPath = path.join(tempDir, 'data2.csv');
    const csvContent = '1,2\n3,4';
    fs.writeFileSync(csvPath, csvContent);
    const output = execSync(`${cli} csv-import ${csvPath} --header false`, { encoding: 'utf-8' });
    const json = JSON.parse(output);
    expect(json).toEqual([['1', '2'], ['3', '4']]);
  });

  test('Custom Delimiter', () => {
    const csvPath = path.join(tempDir, 'data3.csv');
    const csvContent = 'a;b;c\nx;y;z';
    fs.writeFileSync(csvPath, csvContent);
    const output = execSync(`${cli} csv-import ${csvPath} --delimiter ";"`, { encoding: 'utf-8' });
    const json = JSON.parse(output);
    expect(json).toEqual([{ a: 'x', b: 'y', c: 'z' }]);
  });

  test('Output to File', () => {
    const csvPath = path.join(tempDir, 'data4.csv');
    const outPath = path.join(tempDir, 'out.json');
    const csvContent = 'a,b\n5,6';
    fs.writeFileSync(csvPath, csvContent);
    execSync(`${cli} csv-import ${csvPath} --output ${outPath}`, { encoding: 'utf-8' });
    const fileContent = fs.readFileSync(outPath, 'utf-8');
    const json = JSON.parse(fileContent);
    expect(json).toEqual([{ a: '5', b: '6' }]);
  });

  test('Error Handling for non-existent file', () => {
    const nonExistPath = path.join(tempDir, 'nope.csv');
    let error;
    try {
      execSync(`${cli} csv-import ${nonExistPath}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.status).toBe(1);
    expect(error.stderr).toContain('Error reading input file');
  });
});
