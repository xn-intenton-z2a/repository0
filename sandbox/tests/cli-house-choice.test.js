import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { chooseHouse, main } from '../source/main.js';

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
