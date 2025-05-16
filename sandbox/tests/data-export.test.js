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

  test('GET /mission returns mission statement', async () => {
    const res = await fetch(`http://localhost:${port}/mission`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/plain');
    const text = await res.text();
    expect(text).toContain('# Mission Statement');
  });

  test('GET /version returns version number', async () => {
    const res = await fetch(`http://localhost:${port}/version`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/plain');
    const text = await res.text();
    const pkg = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')
    );
    expect(text.trim()).toBe(pkg.version);
  });

  test('GET /help returns help guide', async () => {
    const res = await fetch(`http://localhost:${port}/help`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/plain');
    const text = await res.text();
    expect(text).toContain('Usage:');
  });

  // New HTTP SVG endpoint tests
  test('GET /plot returns SVG content', async () => {
    const res = await fetch(`http://localhost:${port}/plot?function=quadratic&range=0,5`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
    const text = await res.text();
    expect(text).toMatch(/<svg[^>]*>/);
    expect(text).toMatch(/<polyline[^>]*>/);
  });

  test('GET /plot missing params returns 400', async () => {
    const res = await fetch(`http://localhost:${port}/plot?function=quadratic`);
    expect(res.status).toBe(400);
  });

  test('GET /polar returns SVG content', async () => {
    const res = await fetch(`http://localhost:${port}/polar?function=spiral&radius-range=0,2&angle-range=0,6.28&resolution=50`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
    const text = await res.text();
    expect(text).toMatch(/<svg[^>]*>/);
    expect(text).toMatch(/<polyline[^>]*>/);
    const commaCount = (text.match(/,/g) || []).length;
    expect(commaCount).toBe(50);
  });

  test('GET /polar invalid params returns 400', async () => {
    const res = await fetch(`http://localhost:${port}/polar?function=unknown&radius-range=0,1&angle-range=0,6.28`);
    expect(res.status).toBe(400);
  });

  // Log-scale HTTP tests
  test('GET /plot with logScale=x transforms x-axis', async () => {
    const res = await fetch(`http://localhost:${port}/plot?function=quadratic&range=1,100&logScale=x`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
    const text = await res.text();
    // x at 1 => log10(1)=0, y at 1 => 1
    expect(text).toMatch(/points="0,1/);
  });

  test('GET /plot with logScale=both transforms both axes', async () => {
    const res = await fetch(`http://localhost:${port}/plot?function=quadratic&range=1,100&logScale=both`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
    const text = await res.text();
    // both x and y at start -> log10(1)=0
    expect(text).toMatch(/points="0,0/);
  });

  test('GET /plot with non-positive range returns 400', async () => {
    const res = await fetch(`http://localhost:${port}/plot?function=quadratic&range=0,10&logScale=x`);
    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toMatch(/log-scale values must be positive/);
  });

  test('GET /plot with invalid logScale returns 400', async () => {
    const res = await fetch(`http://localhost:${port}/plot?function=quadratic&range=1,10&logScale=foo`);
    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toMatch(/invalid logScale/);
  });

  // New HTTP dimension tests
  test('GET /plot with width and height returns SVG with correct dimensions and viewBox', async () => {
    const res = await fetch(`http://localhost:${port}/plot?function=quadratic&range=0,5&width=400&height=200`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
    const text = await res.text();
    expect(text).toMatch(/width="400"/);
    expect(text).toMatch(/height="200"/);
    expect(text).toMatch(/viewBox="0 0 5 25"/);
  });
  test('GET /polar default width and height returns SVG with dimensions', async () => {
    const res = await fetch(`http://localhost:${port}/polar?function=rose&radius-range=0,1&angle-range=0,6.28`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
    const text = await res.text();
    expect(text).toMatch(/width="800"/);
    expect(text).toMatch(/height="600"/);
    expect(text).toMatch(/viewBox="[-0-9\.]+