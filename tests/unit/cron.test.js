import { describe, it, expect } from 'vitest';
import { parseCron } from '../../src/lib/main.js';

function range(a, b) { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; }

describe('parseCron', () => {
  it('expands wildcard and steps (*/15)', () => {
    const parsed = parseCron('*/15 * * * *');
    expect(parsed.minute).toEqual([0,15,30,45]);
    expect(parsed.hour).toEqual(range(0,23));
    expect(parsed.dayOfMonth).toEqual(range(1,31));
    expect(parsed.month).toEqual(range(1,12));
    expect(parsed.dayOfWeek).toEqual(range(0,6));
  });

  it('parses lists and ranges', () => {
    const p = parseCron('0 0 1,15 * 1-5');
    expect(p.minute).toEqual([0]);
    expect(p.hour).toEqual([0]);
    expect(p.dayOfMonth).toEqual([1,15]);
    expect(p.month).toEqual(range(1,12));
    expect(p.dayOfWeek).toEqual([1,2,3,4,5]);
  });

  it('parses ranges with steps (1-5/2)', () => {
    const p = parseCron('1-5/2 * * * *');
    expect(p.minute).toEqual([1,3,5]);
  });

  it('parses hour steps (0/2)', () => {
    const p = parseCron('0 0/2 * * *');
    expect(p.hour).toEqual([0,2,4,6,8,10,12,14,16,18,20,22]);
  });

  it('parses mixed expressions and deduplicates/sorts', () => {
    const p = parseCron('*/15,7,10-12/2 * * * *');
    // expected: 0,15,30,45 from */15 plus 7 plus 10 and 12 from 10-12/2
    expect(p.minute).toEqual([0,7,10,12,15,30,45]);
  });

  it('parses specific example with month list and hour range/step', () => {
    const p = parseCron('5 0-6/2 * 1,6,12 *');
    expect(p.minute).toEqual([5]);
    expect(p.hour).toEqual([0,2,4,6]);
    expect(p.month).toEqual([1,6,12]);
  });

  it('rejects out of range values', () => {
    expect(() => parseCron('60 * * * *')).toThrow(/out of range/);
  });

  it('rejects zero step', () => {
    expect(() => parseCron('*/0 * * * *')).toThrow(/step must be a positive integer/);
  });

  it('rejects wrong field count', () => {
    expect(() => parseCron('* * * *')).toThrow(/expected 5 fields/);
  });
});
