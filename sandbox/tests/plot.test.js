import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import { plotFunction, main } from '../source/main.js';

describe('plotFunction', () => {
  test('plotFunction quadratic returns SVG with polyline', () => {
    const svg = plotFunction('quadratic');
    expect(typeof svg).toBe('string');
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('<polyline');
  });

  test('plotFunction sine returns SVG with polyline', () => {
    const svg = plotFunction('sine');
    expect(typeof svg).toBe('string');
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('<polyline');
  });
});

describe('CLI plotting', () => {
  let writeSpy;
  let logSpy;
  let exitSpy;

  beforeEach(() => {
    writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => { throw new Error('ProcessExit'); });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('writes SVG to specified output file', () => {
    main(['--function', 'quadratic', '--output', 'out.svg']);
    expect(writeSpy).toHaveBeenCalledWith('out.svg', expect.any(String));
    expect(logSpy).toHaveBeenCalledWith('SVG written to out.svg');
  });

  test('uses default output filename when none provided', () => {
    main(['--function', 'sine']);
    expect(writeSpy).toHaveBeenCalledWith('sine.svg', expect.any(String));
    expect(logSpy).toHaveBeenCalledWith('SVG written to sine.svg');
  });

  test('invalid function type exits with code 1 and logs error', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => main(['--function', 'invalid'])).toThrow('ProcessExit');
    expect(errorSpy).toHaveBeenCalledWith('Invalid function type: invalid. Supported values: quadratic, sine.');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
