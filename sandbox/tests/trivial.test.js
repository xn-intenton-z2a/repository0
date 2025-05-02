import { describe, it, expect } from 'vitest';
import { trivial } from '../source/trivial.js';

describe('trivial function', () => {
  it('should return "Hello World"', () => {
    expect(trivial()).toBe("Hello World");
  });
});
