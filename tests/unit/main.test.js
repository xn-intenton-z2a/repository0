import { describe, it, expect, afterEach, vi } from 'vitest';
import fs from 'fs';
import { main } from '../../src/lib/main.js';

describe('capital-cities CLI', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch and print OWL JSON to stdout', async () => {
    const sampleCountries = [
      { cca3: 'USA', capital: ['Washington D.C.'] },
      { cca3: 'FRA', capital: ['Paris'] }
    ];
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => sampleCountries
    })));
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const result = await main(['--capital-cities']);
    const expected = {
      ontology: {
        classes: ['Country', 'City'],
        objectProperties: [{ name: 'hasCapital', domain: 'Country', range: 'City' }],
        individuals: [
          { type: 'Country', id: 'USA' },
          { type: 'City', id: 'Washington D.C.' },
          { subject: 'USA', predicate: 'hasCapital', object: 'Washington D.C.' },
          { type: 'Country', id: 'FRA' },
          { type: 'City', id: 'Paris' },
          { subject: 'FRA', predicate: 'hasCapital', object: 'Paris' }
        ]
      }
    };
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const loggedArg = consoleSpy.mock.calls[0][0];
    expect(JSON.parse(loggedArg)).toEqual(expected);
    expect(result).toEqual(expected);
  });

  it('should write OWL JSON to file when --output is specified', async () => {
    const sampleCountries = [
      { cca3: 'USA', capital: ['Washington D.C.'] }
    ];
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => sampleCountries
    })));
    const writeSpy = vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
    const outputPath = 'out.json';
    const result = await main(['--capital-cities', '--output', outputPath]);
    const expectedOntology = {
      ontology: {
        classes: ['Country', 'City'],
        objectProperties: [{ name: 'hasCapital', domain: 'Country', range: 'City' }],
        individuals: [
          { type: 'Country', id: 'USA' },
          { type: 'City', id: 'Washington D.C.' },
          { subject: 'USA', predicate: 'hasCapital', object: 'Washington D.C.' }
        ]
      }
    };
    const expectedString = JSON.stringify(expectedOntology);
    expect(writeSpy).toHaveBeenCalledTimes(1);
    expect(writeSpy).toHaveBeenCalledWith(outputPath, expectedString);
    expect(result).toEqual(expectedOntology);
  });
});

describe('find-capital-of CLI', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should print capital for the given country code', async () => {
    const sampleCountries = [
      { cca3: 'USA', capital: ['Washington D.C.'] }
    ];
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => sampleCountries
    })));
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const result = await main(['--find-capital-of', 'USA']);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Washington D.C.');
    expect(result).toEqual({ country: 'USA', capital: 'Washington D.C.' });
  });

  it('should write capital JSON to file when --output is specified', async () => {
    const sampleCountries = [
      { cca3: 'FRA', capital: ['Paris'] }
    ];
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => sampleCountries
    })));
    const writeSpy = vi.spyOn(fs.promises, 'writeFile').mockResolvedValue();
    const outputPath = 'capital.json';
    const result = await main(['--find-capital-of', 'FRA', '--output', outputPath]);
    const expected = { country: 'FRA', capital: 'Paris' };
    const expectedString = JSON.stringify(expected);
    expect(writeSpy).toHaveBeenCalledTimes(1);
    expect(writeSpy).toHaveBeenCalledWith(outputPath, expectedString);
    expect(result).toEqual(expected);
  });

  it('should throw an error when country code not found', async () => {
    const sampleCountries = [
      { cca3: 'USA', capital: ['Washington D.C.'] }
    ];
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => sampleCountries
    })));
    await expect(main(['--find-capital-of', 'XYZ'])).rejects.toThrow('Country code XYZ not found.');
  });
});
