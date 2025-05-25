import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('main', () => {
  let logSpy;
  let errorSpy;
  let originalFetch;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    originalFetch = global.fetch;
    process.exitCode = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
    process.exitCode = 0;
  });

  it('should terminate without error when no args', async () => {
    const { main } = await import('../../src/lib/main.js');
    await main([]);
    expect(logSpy).toHaveBeenCalledWith('Run with: []');
    expect(process.exitCode).toBe(0);
  });

  it('should extract multiple JSON-LD blocks successfully', async () => {
    const html = `<html><head>
      <script type="application/ld+json">{"id":1}</script>
      <script type="application/ld+json">{"id":2}</script>
    </head></html>`;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => html,
    });
    const { main } = await import('../../src/lib/main.js');
    await main(['--crawl', 'https://example.com']);
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify([{ id: 1 }, { id: 2 }]));
    expect(errorSpy).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(0);
  });

  it('should log empty array when no JSON-LD blocks found', async () => {
    const html = '<html><head><title>No JSON-LD here</title></head></html>';
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => html,
    });
    const { main } = await import('../../src/lib/main.js');
    await main(['--crawl', 'https://example.com']);
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify([]));
    expect(process.exitCode).toBe(0);
  });

  it('should handle parse error gracefully', async () => {
    const html = `<script type="application/ld+json">{invalid json}</script>`;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => html,
    });
    const { main } = await import('../../src/lib/main.js');
    await main(['--crawl', 'https://example.com']);
    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mock.calls[0][0]).toMatch(/Error parsing JSON-LD/);
    expect(process.exitCode).toBe(1);
  });

  it('should handle fetch network errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));
    const { main } = await import('../../src/lib/main.js');
    await main(['--crawl', 'https://example.com']);
    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mock.calls[0][0]).toMatch(/Fetch error/);
    expect(process.exitCode).toBe(1);
  });

  it('should handle non-200 HTTP status', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => '',
    });
    const { main } = await import('../../src/lib/main.js');
    await main(['--crawl', 'https://example.com']);
    expect(errorSpy).toHaveBeenCalledWith('HTTP request failed with status 404');
    expect(process.exitCode).toBe(1);
  });
});
