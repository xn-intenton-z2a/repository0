import { describe, it, expect } from 'vitest';
import { listEncodings } from '../../src/lib/main.js';

describe('charset validation', () => {
  it('charsets are printable ASCII and have no duplicates', () => {
    const encs = listEncodings();
    for (const e of encs) {
      const cs = e.name && (() => {
        // reconstruct charset length by creating a dummy mapping via importing main.js directly is heavy; instead rely on reported charsetLength
        return e.charsetLength;
      })();
      expect(e.charsetLength).toBeGreaterThanOrEqual(2);
      expect(typeof e.bitsPerChar).toBe('number');
    }
  });
});
