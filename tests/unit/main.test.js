import { describe, test, expect } from 'vitest';
import http from 'http';
import main, { startHandler, diagnosticsHandler, serveHandler } from '../../src/lib/main.js';

describe('Main Module Import', () => {
  test('should export functions', () => {
    expect(typeof main).toBe('function');
    expect(typeof startHandler).toBe('function');
    expect(typeof diagnosticsHandler).toBe('function');
    expect(typeof serveHandler).toBe('function');
  });
});

describe('Start Handler', () => {
  test('default main should log empty args', async () => {
    const logs = [];
    console.log = (msg) => logs.push(msg);
    await main([]);
    expect(logs[0]).toBe('Run with: []');
  });

  test('main start with args should log args array', async () => {
    const logs = [];
    console.log = (msg) => logs.push(msg);
    await main(['start', 'arg1', 'arg2']);
    expect(logs[0]).toBe('Run with: ["arg1","arg2"]');
  });
});

describe('Diagnostics Handler', () => {
  test('diagnostics should log version, platform, and memory usage', async () => {
    const logs = [];
    console.log = (msg) => logs.push(msg);
    await main(['diagnostics']);
    expect(logs[0]).toMatch(/Node: v\d+\.\d+\.\d+, Platform: \w+, MemoryUsage: \{.*\}/);
  });
});

describe('Serve Handler', () => {
  test('serve should return server listening on port 3000 and respond to /health', async () => {
    const server = await main(['serve']);
    const address = server.address();
    expect(address.port).toBe(3000);

    const response = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:3000/health', (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      }).on('error', reject);
    });

    expect(response.statusCode).toBe(200);
    expect(response.data).toBe(JSON.stringify({ status: 'ok' }));

    server.close();
  });
});

describe('Invalid Command', () => {
  test('should throw on unrecognized command', async () => {
    await expect(main(['invalid'])).rejects.toThrow('Unrecognized command: invalid');
  });
});
