import { describe, test, expect } from 'vitest';
import { generateSVG } from '../source/main.js';

describe('generateSVG function', () => {
  test('quadratic with a=0,b=0,c=0 produces horizontal line', () => {
    const svg = generateSVG('quadratic', { a: 0, b: 0, c: 0 });
    expect(svg.startsWith('<svg')).toBe(true);
    const match = svg.match(/<path d="([^"]+)"/);
    expect(match).not.toBeNull();
    const d = match[1];
    const yValues = d
      .split(' ')
      .map(seg => seg.split(',')[1])
      .filter(Boolean);
    expect([...new Set(yValues)]).toEqual(['0']);
  });

  test('sine with amplitude=0 produces horizontal line', () => {
    const svg = generateSVG('sine', { amplitude: 0, frequency: 1, phase: 0 });
    expect(svg.startsWith('<svg')).toBe(true);
    const match = svg.match(/<path d="([^"]+)"/);
    expect(match).not.toBeNull();
    const d = match[1];
    const yValues = d
      .split(' ')
      .map(seg => seg.split(',')[1])
      .filter(Boolean);
    expect([...new Set(yValues)]).toEqual(['0']);
  });
});
