import { strict as assert } from 'assert';
import { normalizeUuidStr, defineEncoding } from '../../src/lib/main.js';

// Simple unit edge-case checks
(() => {
  // normalizeUuidStr should strip dashes, spaces and lowercase
  const inStr = '00AA-11bb-22CC 33dd-44EE';
  const out = normalizeUuidStr(inStr);
  assert.equal(out, '00aa11bb22cc33dd44ee');

  // defineEncoding should throw for duplicate characters
  let threw = false;
  try {
    defineEncoding('dup-test', 'aa');
  } catch (err) {
    threw = true;
  }
  assert.ok(threw, 'defineEncoding should throw on duplicate characters');
})();
