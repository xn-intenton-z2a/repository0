// SPDX-License-Identifier: MIT
import { describe, test, expect } from 'vitest';
import { findMissionContradictions } from '../../src/lib/main.js';

const goodLog = `2026-03-18T11:55:07 Acceptance criteria | 7/7\n2026-03-18T11:55:08 Mission complete declared | YES`;
const badLog = `2026-03-18T11:55:07 Acceptance criteria | 0/7\n2026-03-18T11:55:08 Mission complete declared | YES`;
const noAcceptanceLog = `2026-03-18T11:55:08 Mission complete declared | YES`;
const trickyLog = `2026-03-18T11:55:07 Acceptance criteria | 7/7\n2026-03-18T11:55:08 Mission complete declared | YES\n2026-03-18T11:55:09 Acceptance criteria | 0/7`;

describe('findMissionContradictions', () => {
  test('returns empty array for matching acceptance and mission declaration', () => {
    const contradictions = findMissionContradictions(goodLog);
    expect(Array.isArray(contradictions)).toBe(true);
    expect(contradictions.length).toBe(0);
  });

  test('detects contradiction when mission declared but acceptance counters mismatch', () => {
    const contradictions = findMissionContradictions(badLog);
    expect(Array.isArray(contradictions)).toBe(true);
    expect(contradictions.length).toBeGreaterThan(0);
    expect(contradictions[0]).toHaveProperty('message');
    expect(contradictions[0]).toHaveProperty('acceptance');
  });

  test('mission declared without acceptance counters is flagged', () => {
    const contradictions = findMissionContradictions(noAcceptanceLog);
    expect(contradictions.length).toBeGreaterThan(0);
    expect(contradictions[0].message).toContain('Mission declared without acceptance counters');
  });

  test('pairs with most recent prior acceptance and ignores later unrelated acceptance entries', () => {
    const contradictions = findMissionContradictions(trickyLog);
    // The mission at line 2 should pair with the prior 7/7 entry and not be considered a contradiction
    expect(Array.isArray(contradictions)).toBe(true);
    expect(contradictions.length).toBe(0);
  });
});
