import { describe, it, expect } from 'vitest';
import { parseCron, toString, matches, nextRun, nextRuns } from '../../src/lib/main.js';

describe('CRON engine - parseCron', () => {
  it('parses 5-field expression and returns normalized object', () => {
    const p = parseCron('0 12 * * 1-5');
    expect(p.secondsPresent).toBe(false);
    expect(p.minutes).toEqual([0]);
    expect(p.hours).toEqual([12]);
    expect(p.dayOfWeek).toEqual([1,2,3,4,5]);
  });

  it('parses 6-field expression with seconds', () => {
    const p = parseCron('5 0 9 * * 1');
    expect(p.secondsPresent).toBe(true);
    expect(p.seconds).toEqual([5]);
    expect(p.minutes).toEqual([0]);
    expect(p.hours).toEqual([9]);
  });

  it('parses special macros like @daily', () => {
    const p = parseCron('@daily');
    expect(p.secondsPresent).toBe(false);
    expect(p.minutes).toEqual([0]);
    expect(p.hours).toEqual([0]);
  });

  it('throws descriptive errors for invalid tokens', () => {
    expect(() => parseCron('61 * * * *')).toThrow(/minutes value 61 out of range/);
    expect(() => parseCron('0 0 0 0 0')).toThrow(/dayOfMonth value 0 out of range/);
  });
});

describe('toString round-trip', () => {
  it('toString(parseCron(expr)) returns canonical cron string', () => {
    const expr = '0 12 * * *';
    const p = parseCron(expr);
    expect(toString(p)).toBe('0 12 * * *');
  });
});

describe('matches', () => {
  it('matches date for a specific day (Christmas example)', () => {
    const p = parseCron('0 0 25 12 *');
    const d = new Date(2025, 11, 25, 0, 0, 0); // 2025-12-25 00:00 local
    expect(matches(p, d)).toBe(true);
  });

  it('handles leap day schedules', () => {
    const p = parseCron('0 0 29 2 *');
    const dLeap = new Date(2024, 1, 29, 0, 0, 0);
    expect(matches(p, dLeap)).toBe(true);
    const dNonLeap = new Date(2023, 1, 28, 0, 0, 0);
    expect(matches(p, dNonLeap)).toBe(false);
  });
});

describe('nextRun and nextRuns', () => {
  it('nextRun returns next Monday at 09:00 for weekly schedule', () => {
    const p = parseCron('0 9 * * 1'); // 5-field: minute hour dom mon dow
    const anchor = new Date(2026, 1, 1, 0, 0, 0); // 2026-02-01 is Sunday
    const nxt = nextRun(p, anchor);
    expect(nxt.getFullYear()).toBe(2026);
    expect(nxt.getMonth()).toBe(1);
    expect(nxt.getDate()).toBe(2); // Monday 2nd
    expect(nxt.getHours()).toBe(9);
    expect(nxt.getMinutes()).toBe(0);
  });

  it('nextRuns @daily returns N consecutive days', () => {
    const p = parseCron('@daily');
    const anchor = new Date(2026, 0, 1, 0, 0, 0);
    const arr = nextRuns(p, 7, anchor);
    expect(arr).toHaveLength(7);
    const iso = arr.map(d => d.toISOString());
    // ensure strictly increasing
    for (let i = 1; i < iso.length; i++) expect(iso[i] > iso[i-1]).toBe(true);
  });

  it('handles leap-year nextRun for Feb 29 schedules', () => {
    const p = parseCron('0 0 29 2 *');
    const anchor = new Date(2021, 0, 1, 0, 0, 0);
    const nxt = nextRun(p, anchor);
    expect(nxt.getFullYear()).toBe(2024);
    expect(nxt.getMonth()).toBe(1);
    expect(nxt.getDate()).toBe(29);
  });

  it('handles DST spring-forward hour (America/New_York)', () => {
    const prevTZ = process.env.TZ;
    try {
      process.env.TZ = 'America/New_York';
      const p = parseCron('@hourly');
      // local time: 2021-03-14 01:30 (before DST skip at 2:00 -> 3:00)
      const anchor = new Date(2021, 2, 14, 1, 30, 0);
      const nxt = nextRun(p, anchor);
      const expected = new Date(2021, 2, 14, 3, 0, 0);
      expect(nxt.toISOString()).toBe(expected.toISOString());
    } finally {
      process.env.TZ = prevTZ;
    }
  });

});
