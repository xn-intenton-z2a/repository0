import { strict as assert } from 'assert';
import { encodeUUIDShorthand, decodeUUIDShorthand, listEncodings } from '../../src/lib/main.js';

// Behaviour test: encode and decode demo UUID using densest encoding
(() => {
  const uuid = '00112233-4455-6677-8899-aabbccddeeff';
  const encs = listEncodings();
  if (encs.length === 0) {
    // nothing to test
    return;
  }
  const name = encs[0].name;
  const encoded = encodeUUIDShorthand(uuid, name, false);
  const round = decodeUUIDShorthand(encoded, name, false);
  assert.equal(round, uuid.toLowerCase());
})();
