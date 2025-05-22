import { describe, it, expect } from 'vitest';
import {
  parseOpenPrsArg,
  parseConsolidatedPrArg,
  parseMissionArg,
  parseDiagnosticsArg,
  parseServeArgs,
  collectDiagnostics,
  readMission
} from '../../src/lib/main.js';

describe('Flag parsing', () => {
  it('parseOpenPrsArg returns false for empty args', () => {
    expect(parseOpenPrsArg([])).toBe(false);
  });

  it('parseOpenPrsArg returns true for ["--open-prs"]', () => {
    expect(parseOpenPrsArg(['--open-prs'])).toBe(true);
  });

  it('parseConsolidatedPrArg returns false for empty args', () => {
    expect(parseConsolidatedPrArg([])).toBe(false);
  });

  it('parseConsolidatedPrArg returns true for ["--open-prs-consolidated"]', () => {
    expect(parseConsolidatedPrArg(['--open-prs-consolidated'])).toBe(true);
  });

  it('parseMissionArg returns false for empty args', () => {
    expect(parseMissionArg([])).toBe(false);
  });

  it('parseMissionArg returns true for ["--mission"]', () => {
    expect(parseMissionArg(['--mission'])).toBe(true);
  });

  it('parseDiagnosticsArg returns false for empty args', () => {
    expect(parseDiagnosticsArg([])).toBe(false);
  });

  it('parseDiagnosticsArg returns true for ["--diagnostics"]', () => {
    expect(parseDiagnosticsArg(['--diagnostics'])).toBe(true);
  });
});

describe('Serve arguments parsing', () => {
  it('returns serve false and default port for empty args', () => {
    const result = parseServeArgs([]);
    expect(result.serve).toBe(false);
    expect(result.port).toBe(8080);
  });

  it('returns serve true and default port for ["--serve"]', () => {
    const result = parseServeArgs(['--serve']);
    expect(result.serve).toBe(true);
    expect(result.port).toBe(8080);
  });

  it('returns serve true and given port for ["--serve", "3000"]', () => {
    const result = parseServeArgs(['--serve', '3000']);
    expect(result.serve).toBe(true);
    expect(result.port).toBe(3000);
  });

  it('returns serve true and default port for invalid port', () => {
    const result = parseServeArgs(['--serve', 'not-a-number']);
    expect(result.serve).toBe(true);
    expect(result.port).toBe(8080);
  });
});

describe('Diagnostics utility', () => {
  it('collectDiagnostics returns object with expected keys and types', () => {
    const diag = collectDiagnostics();
    expect(diag).toHaveProperty('version');
    expect(typeof diag.version).toBe('string');
    expect(diag).toHaveProperty('uptime');
    expect(typeof diag.uptime).toBe('number');
    expect(diag).toHaveProperty('memoryUsage');
    expect(typeof diag.memoryUsage).toBe('object');
    expect(diag.memoryUsage).toHaveProperty('rss');
    expect(typeof diag.memoryUsage.rss).toBe('number');
    expect(diag.memoryUsage).toHaveProperty('heapTotal');
    expect(typeof diag.memoryUsage.heapTotal).toBe('number');
    expect(diag.memoryUsage).toHaveProperty('heapUsed');
    expect(typeof diag.memoryUsage.heapUsed).toBe('number');
    expect(diag).toHaveProperty('platform');
    expect(typeof diag.platform).toBe('string');
    expect(diag).toHaveProperty('arch');
    expect(typeof diag.arch).toBe('string');
  });
});

describe('Mission utility', () => {
  it('readMission returns mission content containing repository name', async () => {
    const content = await readMission();
    expect(content).toContain('# repository0');
  });
});
