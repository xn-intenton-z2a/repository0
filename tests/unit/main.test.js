import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { main } from '../../src/lib/main.js';

let logSpy;
let errorSpy;
let exitSpy;

beforeEach(() => {
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('main', () => {
  it('should print usage when no args', async () => {
    await main([]);
    expect(logSpy).toHaveBeenCalledWith('Run with: []');
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('should fetch and print summary when article found', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ extract: 'Sample summary', type: 'standard' }),
      })
    ));
    await main(['--fetch-wikipedia', 'Term']);
    expect(logSpy).toHaveBeenCalledWith('Sample summary');
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('should handle 404', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ status: 404, ok: false, statusText: 'Not Found' })
    ));
    await main(['--fetch-wikipedia', 'Missing']);
    expect(errorSpy).toHaveBeenCalledWith('Article not found: Missing');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('should handle disambiguation', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ extract: '', type: 'disambiguation' }),
      })
    ));
    await main(['--fetch-wikipedia', 'Multi']);
    expect(errorSpy).toHaveBeenCalledWith('Multi is a disambiguation page');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('should handle network error', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('NetworkFail'))));
    await main(['--fetch-wikipedia', 'ErrorTerm']);
    expect(errorSpy).toHaveBeenCalledWith('Error fetching article: NetworkFail');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});