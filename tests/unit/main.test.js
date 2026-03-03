// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// tests/unit/main.test.js

import { describe, it, expect } from 'vitest';
import { parseRange, generateTimeSeries, generateSVGPlot } from '../../src/lib/main.js';

describe('parseRange', () => {
  it('should parse single variable range', () => {
    const result = parseRange('x=-10:10');
    expect(result).toEqual({
      x: { min: -10, max: 10 }
    });
  });

  it('should parse multiple variable ranges', () => {
    const result = parseRange('x=-10:10,y=-5:5');
    expect(result).toEqual({
      x: { min: -10, max: 10 },
      y: { min: -5, max: 5 }
    });
  });

  it('should handle whitespace in ranges', () => {
    const result = parseRange('x = -1.5 : 1.5 , y = -2 : 2');
    expect(result).toEqual({
      x: { min: -1.5, max: 1.5 },
      y: { min: -2, max: 2 }
    });
  });
});

describe('generateTimeSeries', () => {
  it('should generate points for simple linear expression', () => {
    const ranges = { x: { min: 0, max: 2 } };
    const points = generateTimeSeries('y=x', ranges, 2);
    
    expect(points).toHaveLength(3); // 0, 1, 2 steps
    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[1]).toEqual({ x: 1, y: 1 });
    expect(points[2]).toEqual({ x: 2, y: 2 });
  });

  it('should generate points for sine function', () => {
    const ranges = { x: { min: 0, max: Math.PI } };
    const points = generateTimeSeries('y=sin(x)', ranges, 2);
    
    expect(points).toHaveLength(3);
    expect(points[0].x).toBe(0);
    expect(points[0].y).toBeCloseTo(0, 10);
    expect(points[1].x).toBeCloseTo(Math.PI / 2, 10);
    expect(points[1].y).toBeCloseTo(1, 10);
    expect(points[2].x).toBeCloseTo(Math.PI, 10);
    expect(points[2].y).toBeCloseTo(0, 10);
  });

  it('should handle expressions without explicit y=', () => {
    const ranges = { x: { min: 0, max: 1 } };
    const points = generateTimeSeries('x^2', ranges, 1);
    
    expect(points).toHaveLength(2);
    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[1]).toEqual({ x: 1, y: 1 });
  });

  it('should skip invalid points (NaN)', () => {
    const ranges = { x: { min: -1, max: 1 } };
    const points = generateTimeSeries('sqrt(x)', ranges, 2);
    
    // Should only include points where x >= 0
    expect(points.length).toBe(2); // x=0 and x=1
    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[1]).toEqual({ x: 1, y: 1 });
  });

  it('should use default range when not specified', () => {
    const points = generateTimeSeries('x', {}, 1);
    
    expect(points).toHaveLength(2);
    expect(points[0].x).toBe(-10);
    expect(points[1].x).toBe(10);
  });

  it('should throw error for invalid expressions', () => {
    const ranges = { x: { min: 0, max: 1 } };
    
    expect(() => {
      generateTimeSeries('invalid_function(x)', ranges, 1);
    }).toThrow(/Failed to parse expression/);
  });
});

describe('generateSVGPlot', () => {
  it('should generate valid SVG for simple data', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 4 }
    ];
    
    const svg = generateSVGPlot(points);
    
    expect(svg).toContain('<?xml version="1.0"');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('<path');
    expect(svg).toContain('Mathematical Plot');
  });

  it('should include custom title', () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const svg = generateSVGPlot(points, { title: 'Custom Title' });
    
    expect(svg).toContain('Custom Title');
  });

  it('should handle custom colors and dimensions', () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const svg = generateSVGPlot(points, {
      width: 400,
      height: 300,
      strokeColor: '#ff0000',
      backgroundColor: '#f0f0f0'
    });
    
    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="300"');
    expect(svg).toContain('stroke: #ff0000');
    expect(svg).toContain('fill="#f0f0f0"');
  });

  it('should throw error for empty points array', () => {
    expect(() => {
      generateSVGPlot([]);
    }).toThrow('No valid points to plot');
  });

  it('should generate proper path data', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 1 }
    ];
    
    const svg = generateSVGPlot(points);
    
    // Should contain move (M) and line (L) commands
    expect(svg).toMatch(/d="M[\d\s.-]+L[\d\s.-]+"/);
  });

  it('should include grid lines and axes', () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const svg = generateSVGPlot(points);
    
    expect(svg).toContain('class="grid"');
    expect(svg).toContain('class="axis"');
    expect(svg).toContain('class="axis-label"');
  });
});
