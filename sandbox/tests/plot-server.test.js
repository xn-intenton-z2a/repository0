import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import { main } from '../source/main.js';

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', reject);
  });
}

describe('plot-server', () => {
  let server;
  let port;
  const host = '127.0.0.1';

  beforeAll(async () => {
    server = await main(['plot-server', '--port', '0', '--host', host]);
    port = server.address().port;
  });

  afterAll(() => {
    server.close();
  });

  test('quadratic plot', async () => {
    const res = await httpGet(`http://${host}:${port}/plot?type=quadratic&a=2&b=3&c=1`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/image\/svg\+xml/);
    expect(res.body.trim().startsWith('<svg')).toBe(true);
  });

  test('sine plot', async () => {
    const res = await httpGet(`http://${host}:${port}/plot?type=sine&frequency=2&amplitude=0.5`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/image\/svg\+xml/);
    expect(res.body.trim().startsWith('<svg')).toBe(true);
  });

  test('expression plot', async () => {
    const res = await httpGet(`http://${host}:${port}/plot?type=expression&expr=x%5E2&domain=-5,5&samples=50`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/image\/svg\+xml/);
    expect(res.body.trim().startsWith('<svg')).toBe(true);
  });

  test('missing parameters', async () => {
    const res = await httpGet(`http://${host}:${port}/plot`);
    expect(res.status).toBe(400);
    expect(res.body).toMatch(/Error:/);
  });

  test('unsupported type', async () => {
    const res = await httpGet(`http://${host}:${port}/plot?type=unknown`);
    expect(res.status).toBe(400);
    expect(res.body).toMatch(/Unsupported type/);
  });
});