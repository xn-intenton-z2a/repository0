import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import Database from 'better-sqlite3';
import jsYaml from 'js-yaml';

const cli = 'node sandbox/source/main.js';

describe('import-data command', () => {
  const tempDir = path.join(os.tmpdir(), 'import-data-tests');

  beforeEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('errors when missing arguments', () => {
    let err1;
    try {
      execSync(`${cli} import-data`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err1 = e;
    }
    expect(err1).toBeDefined();
    expect(err1.status).toBe(1);
    expect(err1.stderr).toContain('No input file specified');

    const csvPath = path.join(tempDir, 'd.csv');
    fs.writeFileSync(csvPath, 'a,b\n1,2');
    let err2;
    try {
      execSync(`${cli} import-data ${csvPath}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err2 = e;
    }
    expect(err2).toBeDefined();
    expect(err2.status).toBe(1);
    expect(err2.stderr).toContain('--db <database path> is required');
  });

  test('errors on unsupported extension', () => {
    const txtPath = path.join(tempDir, 'file.txt');
    fs.writeFileSync(txtPath, 'text');
    let err;
    try {
      execSync(`${cli} import-data ${txtPath} --db ${path.join(tempDir, 'db.sqlite')}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.status).toBe(1);
    expect(err.stderr).toContain('Unsupported input format');
  });

  test('CSV import with default options', () => {
    const csvPath = path.join(tempDir, 'data.csv');
    const dbPath = path.join(tempDir, 'data.sqlite');
    fs.writeFileSync(csvPath, 'x,y\n10,20\n30,40');
    const out = execSync(`${cli} import-data ${csvPath} --db ${dbPath}`, { encoding: 'utf-8' });
    expect(out.trim()).toBe(`Inserted 2 records into table 'data' in database ${dbPath}`);

    const db = new Database(dbPath, { readonly: true });
    const rowCount = db.prepare('SELECT COUNT(*) AS count FROM data').get().count;
    expect(rowCount).toBe(2);
    const cols = db.prepare("PRAGMA table_info('data')").all().map((c) => c.name);
    expect(cols.sort()).toEqual(['x', 'y'].sort());
    db.close();
  });

  test('JSON import', () => {
    const jsonPath = path.join(tempDir, 'data.json');
    const dbPath = path.join(tempDir, 'j.sqlite');
    fs.writeFileSync(jsonPath, JSON.stringify([{ a: 1 }, { a: 2 }]));
    const out = execSync(`${cli} import-data ${jsonPath} --db ${dbPath} --table tbl`, { encoding: 'utf-8' });
    expect(out.trim()).toBe(`Inserted 2 records into table 'tbl' in database ${dbPath}`);

    const db = new Database(dbPath, { readonly: true });
    const count = db.prepare('SELECT COUNT(*) AS c FROM tbl').get().c;
    expect(count).toBe(2);
    db.close();
  });

  test('YAML import', () => {
    const yamlPath = path.join(tempDir, 'data.yaml');
    const dbPath = path.join(tempDir, 'y.sqlite');
    fs.writeFileSync(yamlPath, '- foo: bar\n- foo: baz');
    const out = execSync(`${cli} import-data ${yamlPath} --db ${dbPath}`, { encoding: 'utf-8' });
    expect(out.trim()).toMatch(/Inserted 2 records into table 'data'/);

    const db = new Database(dbPath, { readonly: true });
    const rows = db.prepare('SELECT foo FROM data ORDER BY foo').all().map((r) => r.foo);
    expect(rows).toEqual(['bar', 'baz']);
    db.close();
  });

  test('ENV import', () => {
    const envPath = path.join(tempDir, 'data.env');
    const dbPath = path.join(tempDir, 'e.sqlite');
    fs.writeFileSync(envPath, 'K=V');
    const out = execSync(`${cli} import-data ${envPath} --db ${dbPath}`, { encoding: 'utf-8' });
    expect(out.trim()).toMatch(/Inserted 1 records into table 'data'/);

    const db = new Database(dbPath, { readonly: true });
    const row = db.prepare('SELECT K FROM data').get();
    expect(row.K).toBe('V');
    db.close();
  });

  test('overwrite existing table', () => {
    const csvPath = path.join(tempDir, 'data.csv');
    const dbPath = path.join(tempDir, 'o.sqlite');
    fs.writeFileSync(csvPath, 'a,b\n1,2');
    // First import
    execSync(`${cli} import-data ${csvPath} --db ${dbPath} --table t`, { encoding: 'utf-8' });
    // Second without overwrite should error
    let err;
    try {
      execSync(`${cli} import-data ${csvPath} --db ${dbPath} --table t`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.stderr).toContain('already exists');
    // With overwrite should succeed
    const out = execSync(`${cli} import-data ${csvPath} --db ${dbPath} --table t --overwrite`, { encoding: 'utf-8' });
    expect(out.trim()).toMatch(/Inserted 1 records into table 't'/);
  });

  test('error on invalid JSON content', () => {
    const badPath = path.join(tempDir, 'bad.json');
    fs.writeFileSync(badPath, '{ invalid');
    let err;
    try {
      execSync(`${cli} import-data ${badPath} --db ${path.join(tempDir, 'db.sqlite')}`, { encoding: 'utf-8', stdio: 'pipe' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.stderr).toContain('Error parsing input file');
  });
});