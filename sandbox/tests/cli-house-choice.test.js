import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { chooseHouse, main } from '../source/main.js';
import fs from 'fs';

describe('chooseHouse', () => {
  const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];

  test('returns a valid house', () => {
    for (let i = 0; i < 10; i++) {
      const h = chooseHouse(houses);
      expect(houses).toContain(h);
    }
  });

  test('with seed produces deterministic output', () => {
    const h1 = chooseHouse(houses, 12345);
    const h2 = chooseHouse(houses, 12345);
    expect(h1).toBe(h2);
  });
});

describe('house-choice command', () => {
  const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
  let logMock;

  beforeEach(() => {
    logMock = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logMock.mockRestore();
  });

  test('default behavior logs a single valid house', async () => {
    await main(['house-choice']);
    expect(logMock).toHaveBeenCalledTimes(1);
    const house = logMock.mock.calls[0][0];
    expect(houses).toContain(house);
  });

  test('--list logs full list', async () => {
    await main(['house-choice', '--list']);
    expect(logMock).toHaveBeenCalledTimes(1);
    const output = logMock.mock.calls[0][0];
    expect(output).toBe(houses.join('\n'));
  });

  test('--seed produces deterministic choice', async () => {
    await main(['house-choice', '--seed', '42']);
    expect(logMock).toHaveBeenCalledTimes(1);
    const first = logMock.mock.calls[0][0];
    logMock.mockClear();
    await main(['house-choice', '--seed', '42']);
    const second = logMock.mock.calls[0][0];
    expect(first).toBe(second);
    expect(houses).toContain(first);
  });
});

describe('plot-quadratic command', () => {
  beforeEach(() => {
    if (fs.existsSync('quadratic.svg')) fs.unlinkSync('quadratic.svg');
  });

  afterEach(() => {
    if (fs.existsSync('quadratic.svg')) fs.unlinkSync('quadratic.svg');
  });

  test('creates SVG file for quadratic plot', async () => {
    await main(['plot-quadratic', '--a', '2', '--b', '3', '--c', '1', '--output', 'quadratic.svg']);
    expect(fs.existsSync('quadratic.svg')).toBe(true);
    const content = fs.readFileSync('quadratic.svg', 'utf-8');
    expect(content.trim().startsWith('<svg')).toBe(true);
  });
});

describe('plot-sine command', () => {
  beforeEach(() => {
    if (fs.existsSync('sine.svg')) fs.unlinkSync('sine.svg');
  });

  afterEach(() => {
    if (fs.existsSync('sine.svg')) fs.unlinkSync('sine.svg');
  });

  test('creates SVG file for sine plot', async () => {
    await main(['plot-sine', '--frequency', '2', '--amplitude', '0.5', '--output', 'sine.svg']);
    expect(fs.existsSync('sine.svg')).toBe(true);
    const content = fs.readFileSync('sine.svg', 'utf-8');
    expect(content.trim().startsWith('<svg')).toBe(true);
  });
});