import fs from 'fs';
import path from 'path';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as mainModule from '../../src/lib/main.js';

describe('parseArgs', () => {
  let errorSpy;
  let exitSpy;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => { throw code; });
  });

  afterEach(() => {
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('returns all false for no flags', () => {
    expect(mainModule.parseArgs([])).toEqual({ help: false, version: false, diagnostics: false });
  });

  it('parses --help flag', () => {
    expect(mainModule.parseArgs(['--help'])).toEqual({ help: true, version: false, diagnostics: false });
  });

  it('parses --version and --diagnostics flags simultaneously', () => {
    expect(mainModule.parseArgs(['--version', '--diagnostics'])).toEqual({ help: false, version: true, diagnostics: true });
  });

  it('errors on unknown flag', () => {
    expect(() => mainModule.parseArgs(['--unknown'])).toThrow();
    expect(errorSpy).toHaveBeenCalledWith('Unknown option: --unknown');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

describe('printUsage', () => {
  let logSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('prints usage lines', () => {
    mainModule.printUsage();
    expect(logSpy).toHaveBeenCalledTimes(5);
    expect(logSpy).toHaveBeenCalledWith('Usage: node src/lib/main.js [options]');
    expect(logSpy).toHaveBeenCalledWith('Options:');
    expect(logSpy).toHaveBeenCalledWith('  --help         Show usage information and exit');
    expect(logSpy).toHaveBeenCalledWith('  --version      Print current tool version and exit');
    expect(logSpy).toHaveBeenCalledWith('  --diagnostics  Collect and display system diagnostics and exit');
  });
});

describe('printVersion', () => {
  let logSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('prints the version from package.json', () => {
    const version = mainModule.printVersion();
    const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
    expect(version).toBe(pkg.version);
    expect(logSpy).toHaveBeenCalledWith(pkg.version);
  });
});

describe('printDiagnostics', () => {
  let logSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('prints JSON diagnostics with keys', () => {
    const diag = mainModule.printDiagnostics();
    expect(logSpy).toHaveBeenCalled();
    expect(diag).toHaveProperty('nodeVersion');
    expect(diag).toHaveProperty('platform');
    expect(diag).toHaveProperty('cwd');
    expect(diag).toHaveProperty('env');
  });
});

describe('main dispatch', () => {
  let logSpy;
  let exitSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => { throw code; });
  });

  afterEach(() => {
    logSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('handles --help and exits', () => {
    expect(() => mainModule.main(['--help'])).toThrow();
    expect(logSpy).toHaveBeenCalledWith('Usage: node src/lib/main.js [options]');
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('handles --version and exits', () => {
    expect(() => mainModule.main(['--version'])).toThrow();
    const pkgVersion = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')).version;
    expect(logSpy).toHaveBeenCalledWith(pkgVersion);
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('handles --diagnostics and exits', () => {
    expect(() => mainModule.main(['--diagnostics'])).toThrow();
    expect(logSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('logs options when no special flags', () => {
    const options = mainModule.main([]);
    expect(logSpy).toHaveBeenCalledWith('Options:', { help: false, version: false, diagnostics: false });
    expect(options).toEqual({ help: false, version: false, diagnostics: false });
  });
});
