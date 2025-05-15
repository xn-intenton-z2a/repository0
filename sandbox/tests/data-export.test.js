import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('CLI Data Export', () => {
  const cliPath = path.resolve(process.cwd(), 'sandbox/source/main.js');

  test('exports CSV data for plot', () => {
    const outfile = 'data.csv';
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync('node', [cliPath, '--plot', 'quadratic', '--export-data', outfile], { encoding: 'utf8' });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, 'utf8');
    const lines = content.trim().split('\n');
    expect(lines[0]).toBe('x,y');
    expect(lines.length).toBe(101); // header + 100 data points
    fs.unlinkSync(outPath);
  });

  test('exports JSON data for polar', () => {
    const outfile = 'data.json';
    const outPath = path.resolve(process.cwd(), outfile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    const result = spawnSync('node', [cliPath, '--polar', 'rose', '--export-data', outfile], { encoding: 'utf8' });
    expect(result.status).toBe(0);
    const content = fs.readFileSync(outPath, 'utf8');
    const data = JSON.parse(content);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(100);
    expect(data[0]).toHaveProperty('x');
    expect(data[0]).toHaveProperty('y');
    fs.unlinkSync(outPath);
  });
});

describe('HTTP Data Export Endpoints', () => {
  let server;
  const port = 4000;
  beforeAll(async () => {
    const mod = await import(new URL('../source/main.js', import.meta.url));
    server = mod.startServer();
  });
  afterAll(() => {
    server.close();
  });

  test('GET /plot-data returns JSON array', async () => {
    const res = await fetch(`http://localhost:${port}/plot-data?function=sine&range=0,6.28&format=json`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(100);
    expect(data[0]).toHaveProperty('x');
    expect(data[0]).toHaveProperty('y');
  });

  test('GET /polar-data returns CSV with header', async () => {
    const res = await fetch(`http://localhost:${port}/polar-data?function=spiral&radius-range=0,1&angle-range=0,6.28&format=csv`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/csv');
    const text = await res.text();
    const lines = text.trim().split('\n');
    expect(lines[0]).toBe('x,y');
    expect(lines.length).toBe(101);
  });

  test('GET missing format returns 400', async () => {
    const res = await fetch(`http://localhost:${port}/plot-data?function=sine&range=0,6.28`);
    expect(res.status).toBe(400);
  });
});
