import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'module';
import * as mainModule from '@src/lib/main.js';

// Helper to capture console.log and console.error
let logSpy;
let errorSpy;
let exitSpy;

beforeEach(() => {
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  exitSpy = vi.spyOn(process, 'exit').mockImplementation(code => { throw code; });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('parseArgs', () => {
  it('returns all false for no flags', () => {
    const opts = mainModule.parseArgs([]);
    expect(opts).toEqual({ help: false, version: false, diagnostics: false });
  });

  it('parses --help flag', () => {
    const opts = mainModule.parseArgs(['--help']);
    expect(opts.help).toBe(true);
    expect(opts.version).toBe(false);
    expect(opts.diagnostics).toBe(false);
  });

  it('parses --version and --diagnostics flags simultaneously', () => {
    const opts = mainModule.parseArgs(['--version', '--diagnostics']);
    expect(opts).toEqual({ help: false, version: true, diagnostics: true });
  });

  it('errors on unknown flag', () => {
    expect(() => mainModule.parseArgs(['--unknown'])).toThrow(1);
    expect(errorSpy).toHaveBeenCalledWith('Unknown option: --unknown');
  });
});

describe('printUsage', () => {
  it('prints usage lines', () => {
    mainModule.printUsage();
    expect(logSpy).toHaveBeenCalledWith('Usage: node src/lib/main.js [options]');
    expect(logSpy).toHaveBeenCalledWith('Options:');
  });
});

describe('printVersion', () => {
  it('prints the version from package.json', () => {
    const require = createRequire(import.meta.url);
    const pkg = require('../../package.json');
    mainModule.printVersion();
    expect(logSpy).toHaveBeenCalledWith(pkg.version);
  });
});

describe('printDiagnostics', () => {
  it('prints JSON diagnostics with keys', () => {
    mainModule.printDiagnostics();
    const printed = logSpy.mock.calls[0][0];
    const obj = JSON.parse(printed);
    expect(obj).toHaveProperty('nodeVersion');
    expect(obj).toHaveProperty('platform');
    expect(obj).toHaveProperty('cwd');
    expect(obj).toHaveProperty('env');
  });
});

describe('main dispatch', () => {
  it('handles --help and exits', () => {
    expect(() => mainModule.main(['--help'])).toThrow(0);
    expect(logSpy).toHaveBeenCalled();
  });

  it('handles --version and exits', () => {
    expect(() => mainModule.main(['--version'])).toThrow(0);
    expect(logSpy).toHaveBeenCalled();
  });

  it('handles --diagnostics and exits', () => {
    expect(() => mainModule.main(['--diagnostics'])).toThrow(0);
    expect(logSpy).toHaveBeenCalled();
  });

  it('logs options when no special flags', () => {
    const opts = { help: false, version: false, diagnostics: false };
    mainModule.main([]);
    expect(logSpy).toHaveBeenCalledWith('Options:', opts);
  });
});
