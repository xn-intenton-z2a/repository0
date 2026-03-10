process.env.TZ = 'America/New_York';
import { describe, it, expect } from 'vitest';
import { parseCron, matches, nextRuns, nextRun } from '../../src/lib/main.js';

describe('cron DST-aware behaviour', () => {
  it('parseCron basic shape', () => {
    const p = parseCron('*/15 * * * *');
    expect(p).toBeTypeOf('object');
    expect(p.fields).toBeDefined();
  });

  it('repeated hour (fall-back) produces two distinct instants', () => {
    // US Eastern 2021-11-07: 01:30 occurs twice (EDT -04:00 then EST -05:00)
    const schedule = '30 1 * * *'; // 01:30 local
    const before = new Date('2021-11-07T00:00:00-04:00');
    const expected1 = new Date('2021-11-07T01:30:00-04:00');
    const expected2 = new Date('2021-11-07T01:30:00-05:00');

    // nextRuns should yield the two distinct instants in chronological order
    const runs = nextRuns(schedule, 2, before);
    expect(runs).toHaveLength(2);
    expect(runs[0].toISOString()).toBe(expected1.toISOString());
    expect(runs[1].toISOString()).toBe(expected2.toISOString());

    // matches should be true for both instants (they are valid occurrences)
    expect(matches(schedule, runs[0])).toBe(true);
    expect(matches(schedule, runs[1])).toBe(true);
  });

  it('skipped hour (spring-forward) does not manufacture a surrogate time', () => {
    // US Eastern 2021-03-14: 02:30 does not exist (clocks jump from 02:00 to 03:00)
    const schedule = '30 2 * * *';
    const before = new Date('2021-03-14T00:00:00-05:00');

    // The next valid occurrence should be the following day's 02:30 local (2021-03-15T02:30-04:00)
    const runs = nextRuns(schedule, 1, before);
    expect(runs).toHaveLength(1);
    const expected = new Date('2021-03-15T02:30:00-04:00');
    expect(runs[0].toISOString()).toBe(expected.toISOString());
    expect(matches(schedule, runs[0])).toBe(true);
  });

  it('nextRuns returns strictly increasing timestamps (monotonic)', () => {
    const schedule = '30 1 * * *';
    const before = new Date('2021-11-06T00:00:00-04:00');
    const runs = nextRuns(schedule, 5, before);
    expect(runs).toHaveLength(5);
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i].getTime()).toBeGreaterThan(runs[i-1].getTime());
    }
  });

  it('matches semantics: leap day and boundaries', () => {
    const schedule = '0 0 29 2 *'; // Feb 29th at 00:00 (local)
    // Use explicit local offset so the date's local components reflect Feb 29
    const d = new Date('2024-02-29T00:00:00-05:00');
    expect(matches(schedule, d)).toBe(true);
    const wrong = new Date('2023-02-28T00:00:00-05:00');
    expect(matches(schedule, wrong)).toBe(false);
  });

  it('validation: invalid cron expression throws', () => {
    expect(() => parseCron('60 * * * *')).toThrow();
    expect(() => parseCron('bad expr')).toThrow();
  });
});
