// SPDX-License-Identifier: MIT
import { describe, it, expect } from 'vitest';
import { evaluateMissionComplete, formatMissionLog } from '../../src/lib/main.js';

describe('mission-complete evaluation and logging', () => {
  it('does not declare mission complete when acceptance criteria are unmet', () => {
    const metrics = { resolvedIssues: 0, sourceTodos: 0, acceptanceCriteriaMet: 0, acceptanceCriteriaTotal: 7 };
    const thresholds = { minResolvedIssues: 1, maxSourceTodos: 0, requireAcceptanceCriteria: true };
    const res = evaluateMissionComplete(metrics, thresholds);
    expect(res.missionComplete).toBe(false);
    const log = formatMissionLog(res);
    expect(log).toContain('Acceptance criteria | 0/7');
    expect(log).toContain('Mission complete declared | NO');
  });

  it('declares mission complete only when all metrics are satisfied', () => {
    const metrics = { resolvedIssues: 1, sourceTodos: 0, acceptanceCriteriaMet: 7, acceptanceCriteriaTotal: 7 };
    const thresholds = { minResolvedIssues: 1, maxSourceTodos: 0, requireAcceptanceCriteria: true };
    const res = evaluateMissionComplete(metrics, thresholds);
    expect(res.missionComplete).toBe(true);
    const log = formatMissionLog(res);
    expect(log).toContain('Acceptance criteria | 7/7');
    expect(log).toContain('Mission complete declared | YES');
  });
});
