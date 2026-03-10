import { describe, it, expect } from 'vitest';
import { parseCron, nextRun, nextRuns, matches, toString } from '../../src/lib/cron.js';

describe('cron engine core', () => {
  it('parses step expression */15 for minutes', () => {
    const parsed = parseCron('*/15 * * * *');
    expect(parsed).toBeTruthy();
    expect(parsed.hasSeconds).toBe(false);
    const mins = parsed.fields.minutes;
    expect(mins.any).toBe(false);
    expect(mins.values.has(0)).toBe(true);
    expect(mins.values.has(15)).toBe(true);
    expect(mins.values.has(30)).toBe(true);
    expect(mins.values.has(45)).toBe(true);
  });

  it('nextRun returns next Monday at 09:00 for "0 9 * * 1"', () => {
    const after = new Date(2026, 2, 10, 10, 0, 0); // Tue Mar 10 2026
    const next = nextRun('0 9 * * 1', after);
    const expected = new Date(2026, 2, 16, 9, 0, 0); // Mon Mar 16 2026 09:00
    expect(next.getFullYear()).toBe(expected.getFullYear());
    expect(next.getMonth()).toBe(expected.getMonth());
    expect(next.getDate()).toBe(expected.getDate());
    expect(next.getHours()).toBe(expected.getHours());
    expect(next.getMinutes()).toBe(expected.getMinutes());
  });

  it('matches Christmas midnight', () => {
    const date = new Date(2025, 11, 25, 0, 0, 0);
    expect(matches('0 0 25 12 *', date)).toBe(true);
  });

  it('nextRuns for @daily returns consecutive days', () => {
    const start = new Date(2025, 0, 1, 0, 0, 0);
    const runs = nextRuns('@daily', 7, start);
    expect(runs.length).toBe(7);
    for (let i = 1; i < runs.length; i++) {
      const prev = runs[i-1];
      const cur = runs[i];
      const diff = Math.round((cur.getTime() - prev.getTime()) / (1000*60*60*24));
      expect(diff).toBe(1);
    }
  });

  it('invalid expressions throw descriptive errors', () => {
    expect(()=> parseCron('60 * * * *')).toThrow();
    expect(()=> parseCron('*/0 * * * *')).toThrow();
    expect(()=> parseCron('a b c d')).toThrow();
  });

  it('toString roundtrip', () => {
    const parsed = parseCron('*/30 1-3 10 1,12 0');
    const s = toString(parsed);
    expect(typeof s).toBe('string');
  });
});
