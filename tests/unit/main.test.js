import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import { parseArgs, parseExpression, buildEvaluator, parseRange, generateTimeSeries, generateSVG, generatePNG, main } from '../../src/lib/main.js';

describe('CLI parsing and generation', () => {
  it('parses args including style flags', () => {
    const args = ['--expression', 'y=sin(x)', '--range', 'x=0:3.14:p10', '--file', 'out.svg', '--format', 'svg', '--width', '300', '--height', '200', '--bg', 'white', '--stroke', 'red', '--fill', 'none', '--stroke-width', '3'];
    const parsed = parseArgs(args);
    expect(parsed.expression).toBe('y=sin(x)');
    expect(parsed.range).toBe('x=0:3.14:p10');
    expect(parsed.file).toBe('out.svg');
    expect(parsed.format).toBe('svg');
    expect(parsed.width).toBe(300);
    expect(parsed.height).toBe(200);
    expect(parsed.bg).toBe('white');
    expect(parsed.stroke).toBe('red');
    expect(parsed.fill).toBe('none');
    expect(parsed.strokeWidth).toBe(3);
  });

  it('builds evaluator and series', () => {
    const expr = parseExpression('y=sin(x)');
    expect(expr).toBe('sin(x)');
    const fn = buildEvaluator(expr);
    const range = parseRange('x=0:3.1415:p5');
    const pts = generateTimeSeries(fn, range);
    expect(pts.length).toBe(5);
    expect(typeof pts[0].x).toBe('number');
  });

  it('generates svg string containing path and attributes', () => {
    const pts = [{x:0,y:0},{x:1,y:1},{x:2,y:0}];
    const svg = generateSVG(pts, {width:100,height:50,stroke:'blue',fill:'none',strokeWidth:2,bg:'white'});
    expect(svg).toContain('<svg');
    expect(svg).toContain('stroke="blue"');
    expect(svg).toContain('fill="none"');
  });

  it('generates a PNG buffer from svg', async () => {
    const pts = [{x:0,y:0},{x:1,y:1},{x:2,y:0}];
    const svg = generateSVG(pts, {width:100,height:50});
    const buf = await generatePNG(svg, {width:100,height:50});
    // PNG files start with 0x89 0x50 0x4E 0x47
    expect(buf instanceof Buffer).toBe(true);
    expect(buf.slice(0,4).toString('hex')).toBe('89504e47');
  });

  it('main writes files (svg/png) without throwing', async () => {
    const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    await main(['--expression','y=sin(x)','--range','x=0:3.14:p10','--file','temp.svg','--format','svg']);
    expect(writeSpy).toHaveBeenCalled();
    writeSpy.mockRestore();
  });
});
