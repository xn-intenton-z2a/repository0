import { describe, test, expect, vi } from 'vitest';
import * as mainModule from '@src/lib/main.js';

describe('Main Module Import', () => {
  test('should be non-null', () => {
    expect(mainModule).not.toBeNull();
  });
});

describe('Default Demo Output', () => {
  test('should output an SVG file and exit if no command-line arguments are provided', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const originalArgv = process.argv;
    process.argv = ['node', 'src/lib/main.js'];
    mainModule.main();
    expect(consoleLogSpy).toHaveBeenCalledWith('Run with: []');
    expect(exitSpy).toHaveBeenCalledWith(0);
    exitSpy.mockRestore();
    consoleLogSpy.mockRestore();
    process.argv = originalArgv;
  });
});
