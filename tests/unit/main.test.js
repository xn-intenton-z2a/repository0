import { describe, it, expect } from 'vitest';
import { main } from '../../src/lib/main.js';

describe('main', () => {
  it('should return Hello World!', () => {
    expect(main()).toBe('Hello World!');
  });
});
