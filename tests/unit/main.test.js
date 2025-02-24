import { describe, test, expect, vi } from 'vitest';
import * as mainModule from '@src/lib/main.js';
import { main } from '@src/lib/main.js';
import fs from 'fs';
import readline from 'readline';
import sharp from 'sharp';

// Existing tests

describe('Main Module Import', () => {
  test('should be non-null', () => {
    expect(mainModule).not.toBeNull();
  });
});

// Exported API tests
describe('Exported API Functions', () => {
  test('plotToSvg returns string containing <svg>', () => {
    const svg = mainModule.plotToSvg({ formulas: ['quad:1,0,0,-10,10,1'] });
    expect(typeof svg).toBe('string');
    expect(svg).toContain('<svg');
  });

  test('plotToJson returns object with required keys', () => {
    const json = mainModule.plotToJson({ formulas: ['sine:1,1,0,0,360,30'] });
    expect(json).toHaveProperty('quadratic');
    expect(json).toHaveProperty('linear');
    expect(json).toHaveProperty('sine');
    expect(json).toHaveProperty('cosine');
  });

  test('plotToText returns non-empty string', () => {
    const text = mainModule.plotToText({ formulas: ['y=2x+3:-10,10,1'] });
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });

  test('plotToCsv returns CSV formatted string', () => {
    const csv = mainModule.plotToCsv({ formulas: ['quad:1,0,0,-10,10,1'] });
    expect(csv).toContain(',');
    expect(csv).toContain('Quadratic');
  });

  test('plotToHtml returns HTML string', () => {
    const html = mainModule.plotToHtml({ formulas: ['y=2x+3:-10,10,1'], grid: true });
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
  });

  test('plotToMarkdown returns markdown formatted string', () => {
    const md = mainModule.plotToMarkdown({ formulas: ['sine:1,1,0,0,360,30'] });
    expect(md).toContain('# Plot Data');
  });

  test('main generates markdown file when output file ends with .md', () => {
    const writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    const originalArgv = process.argv;
    process.argv = ['node', 'src/lib/main.js', 'output.md', 'y=2x+3:-10,10,1'];
    if (mainModule.main) {
      mainModule.main();
    }
    const argsCall = writeFileSyncSpy.mock.calls[0];
    expect(argsCall[1]).toContain('# Plot Data');
    writeFileSyncSpy.mockRestore();
    process.argv = originalArgv;
  });

  test('main generates PNG file when output file ends with .png', async () => {
    const toFileSpy = vi.spyOn(sharp.prototype, 'toFile').mockResolvedValue({});
    const originalArgv = process.argv;
    process.argv = ['node', 'src/lib/main.js', 'output.png', 'y=2x+3:-10,10,1'];
    await mainModule.main();
    expect(toFileSpy).toHaveBeenCalled();
    toFileSpy.mockRestore();
    process.argv = originalArgv;
  });
});

// New test for rotation feature
describe('Rotation Feature', () => {
  test('plotToSvg includes rotation transform when rotate parameter is provided', () => {
    const svg = mainModule.plotToSvg({ formulas: ['y=2x+3:-10,10,1'], rotate: 45 });
    expect(svg).toContain('transform="rotate(45.00, 400.00, 850.00)"');
  });
});

// New test for custom title feature
describe('Custom Title Feature', () => {
  test('plotToSvg includes custom title in <title> element when customTitle parameter is provided', () => {
    const svg = mainModule.plotToSvg({ formulas: ['y=2x+3:-10,10,1'], customTitle: 'Custom Plot Title' });
    expect(svg).toContain('<title>Custom Plot Title</title>');
  });
});

// New test for summary feature
describe('Summary Feature', () => {
  test('should output summary statistics when --summary flag is provided', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const originalArgv = process.argv;
    process.argv = ['node', 'src/lib/main.js', 'output.svg', 'y=2x+3:-10,10,1', '--summary'];
    mainModule.main();
    const summaryCall = consoleLogSpy.mock.calls.find(call => call[0] && call[0].includes('Summary of Plots:'));
    expect(summaryCall).toBeDefined();
    consoleLogSpy.mockRestore();
    process.argv = originalArgv;
  });
});

// New test for table summary feature
describe('Table Summary Feature', () => {
  test('should output summary table using console.table when --table flag is provided', () => {
    const consoleTableSpy = vi.spyOn(console, 'table').mockImplementation(() => {});
    const originalArgv = process.argv;
    process.argv = ['node', 'src/lib/main.js', 'output.svg', 'y=2x+3:-10,10,1', '--table'];
    mainModule.main();
    expect(consoleTableSpy).toHaveBeenCalled();
    consoleTableSpy.mockRestore();
    process.argv = originalArgv;
  });
});

// New test for getSummary function
describe('getSummary Function', () => {
  test('returns empty object for empty array', () => {
    const summary = mainModule.getSummary([]);
    expect(summary).toEqual({});
  });

  test('returns correct summary statistics for non-empty input', () => {
    const points = [{ x: 0, y: 1 }, { x: 2, y: 3 }, { x: 4, y: 5 }];
    const summary = mainModule.getSummary(points);
    expect(summary).toEqual({
      minX: '0.00',
      maxX: '4.00',
      avgX: '2.00',
      minY: '1.00',
      maxY: '5.00',
      avgY: '3.00'
    });
  });
});

// New test for incremental changes plan documentation
describe('Incremental Changes Plan Documentation', () => {
  test('source file contains incremental changes plan comment aligned with CONTRIBUTING.md', () => {
    const sourceContent = fs.readFileSync('src/lib/main.js', 'utf8');
    expect(sourceContent).toContain('Incremental Change Plan (aligned with CONTRIBUTING.md):');
  });
});

// Interactive CLI Mode test
describe('Interactive CLI Mode', () => {
  test('should prompt for input when --interactive flag is provided', () => {
    const rlMock = {
      question: vi.fn((prompt, callback) => { callback('y=2x+3:-10,10,1'); }),
      close: vi.fn()
    };
    vi.spyOn(readline, 'createInterface').mockReturnValue(rlMock);
    const originalArgv = process.argv;
    process.argv = ['node', 'src/lib/main.js', '--interactive'];
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
    mainModule.main();
    expect(rlMock.question).toHaveBeenCalled();
    exitSpy.mockRestore();
    process.argv = originalArgv;
  });
});

// Error Handling Tests
describe('Error Handling', () => {
  test('plotFromString returns empty array for unrecognized formula', () => {
    const result = mainModule.plotFromString('unknown:parameter');
    expect(result).toEqual([]);
  });

  test('parseSine throws error for invalid sine formula string', () => {
    expect(() => mainModule.parseSine('sine:invalid')).toThrow();
  });
});

// Default Demo Output Test
describe('Default Demo Output', () => {
  test('should output an SVG file and exit if no command-line arguments are provided', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const originalArgv = process.argv;
    process.argv = ['node', 'src/lib/main.js'];
    mainModule.main();
    expect(consoleLogSpy).toHaveBeenCalledWith('SVG file generated: output.svg');
    expect(consoleLogSpy).toHaveBeenCalledWith('Execution completed. Terminating without waiting for user input.');
    expect(exitSpy).toHaveBeenCalledWith(0);
    exitSpy.mockRestore();
    consoleLogSpy.mockRestore();
    process.argv = originalArgv;
  });
});
