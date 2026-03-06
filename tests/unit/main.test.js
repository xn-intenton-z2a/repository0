import { describe, it, expect } from 'vitest';
import { parseCron, nextRun, nextRuns, matches, toString } from '../../src/lib/main.js';

describe('CRON_ENGINE core', () => {
  it('parseCron parses 5-field expression into structured object', () => {
    const p = parseCron('*/15 0-23/1 * * *');
    expect(p).toBeTruthy();
    expect(Array.isArray(p.minutes)).toBe(true);
    expect(p.minutes).toContain(0);
    expect(p.minutes).toContain(15);
    expect(p.minutes).toContain(30);
    expect(p.minutes).toContain(45);
  });

  it('parseCron handles 6-field with seconds', () => {
    const p = parseCron('0 */10 * * * *');
    expect(p.hasSeconds).toBe(true);
    expect(p.seconds).toEqual([0]);
    expect(p.minutes).toContain(0);
    expect(p.minutes).toContain(10);
  });

  it('parseCron expands @daily macro', () => {
    const p = parseCron('@daily');
    expect(p.hasSeconds).toBe(false);
    expect(p.minutes).toEqual([0]);
    expect(p.hours).toEqual([0]);
    // tostring should be canonical
    expect(toString(p)).toBe('0 0 * * *');
  });

  it('parseCron throws for invalid values', () => {
    expect(() => parseCron('60 * * * *')).toThrow(/seconds|minutes|value/);
    expect(() => parseCron('*/15 0-23/ * * *')).toThrow();
    expect(() => parseCron('5- * * * *')).toThrow();
  });

  it('nextRun returns next midnight strictly after anchor', () => {
    const anchor = new Date(2026, 2, 6, 0, 0, 0); // 2026-03-06 00:00 local
    const nxt = nextRun('0 0 * * *', anchor);
    expect(nxt.getTime()).toBeGreaterThan(anchor.getTime());
    expect(nxt.getHours()).toBe(0);
    expect(nxt.getMinutes()).toBe(0);
    // should be next day
    const expected = new Date(2026, 2, 7, 0, 0, 0);
    expect(nxt.getFullYear()).toBe(expected.getFullYear());
    expect(nxt.getMonth()).toBe(expected.getMonth());
    expect(nxt.getDate()).toBe(expected.getDate());
  });

  it('nextRun with seconds resolves next occurrence strictly after anchor', () => {
    const anchor = new Date(2026, 0, 1, 0, 0, 0);
    const p = parseCron('30 0 * * * *'); // seconds=30, minutes=0
    const nxt = nextRun(p, anchor);
    expect(nxt.getSeconds()).toBe(30);
    expect(nxt.getMinutes()).toBe(0);
    expect(nxt.getTime()).toBeGreaterThan(anchor.getTime());
  });

  it('nextRuns returns sequence of strictly increasing dates and skips invalid DOM months', () => {
    const after = new Date(2026, 0, 1, 0, 0, 0);
    const arr = nextRuns('0 0 31 * *', 3, after);
    expect(arr.length).toBe(3);
    for (let i=1;i<arr.length;i++){
      expect(arr[i].getTime()).toBeGreaterThan(arr[i-1].getTime());
      expect(arr[i].getDate()).toBe(31);
    }
  });

  it('matches validates a date against schedule', () => {
    const d = new Date(2025, 11, 25, 0, 0, 0); // 2025-12-25 00:00 local
    expect(matches('0 0 25 12 *', d)).toBe(true);
    expect(matches('0 0 25 12 *', new Date(2025,11,25,1,0,0))).toBe(false);
  });

  it('toString round-trips and is canonical', () => {
    const p = parseCron('*/15 0-23/1 * * *');
    const s = toString(p);
    const p2 = parseCron(s);
    expect(JSON.stringify(p.minutes)).toBe(JSON.stringify(p2.minutes));
    expect(JSON.stringify(p.hours)).toBe(JSON.stringify(p2.hours));
  });

});
